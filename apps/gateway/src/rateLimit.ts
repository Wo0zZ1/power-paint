import type { NextFunction, Request, Response } from 'express'

import { clientAddress } from './clientAddress'
import { CONFIG } from './config'
import { redis } from './redis'

interface LimitResult {
	allowed: boolean
	retryAfterSec: number
}

// Скользящее окно на упорядоченном множестве: старые отметки выбрасываются
// по времени, затем считается остаток. Всё одной транзакцией, иначе параллельные
// запросы просочатся мимо лимита.
const consume = async (key: string, max: number): Promise<LimitResult> => {
	const now = Date.now()
	const windowMs = CONFIG.RATE_LIMIT_WINDOW_SEC * 1000

	const [, , countResult] = (await redis
		.multi()
		.zremrangebyscore(key, 0, now - windowMs)
		.zadd(key, now, `${now}-${Math.random()}`)
		.zcard(key)
		.expire(key, CONFIG.RATE_LIMIT_WINDOW_SEC)
		.exec()) as [unknown, unknown, [Error | null, number], unknown]

	const count = countResult[1]

	return {
		allowed: count <= max,
		retryAfterSec: CONFIG.RATE_LIMIT_WINDOW_SEC,
	}
}

// Ключ по пользователю, если он известен: иначе весь серверный рендеринг Web
// придёт с одного адреса и упрётся в лимит как один клиент.
const limitKey = (request: Request) =>
	request.identity
		? `rate:user:${request.identity.userId}`
		: `rate:ip:${clientAddress(request)}`

export const rateLimit = (max: number) =>
	async (request: Request, response: Response, next: NextFunction) => {
		let result: LimitResult

		try {
			result = await consume(limitKey(request), max)
		} catch (error) {
			// Redis недоступен - пропускаем. Лимит защищает от злоупотребления,
			// но не ценой полной недоступности сервиса.
			console.error('Rate limit unavailable:', (error as Error).message)

			return next()
		}

		if (result.allowed) return next()

		response.setHeader('Retry-After', String(result.retryAfterSec))

		return response.status(429).json({ message: 'Too many requests' })
	}

export const generalRateLimit = rateLimit(CONFIG.RATE_LIMIT_MAX)
export const authRateLimit = rateLimit(CONFIG.RATE_LIMIT_AUTH_MAX)
