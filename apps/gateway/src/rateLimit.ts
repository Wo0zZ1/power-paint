import type { Express, NextFunction, Request, Response } from 'express'

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
		? `user:${request.identity.userId}`
		: `ip:${clientAddress(request)}`

// У каждого лимита свой счётчик: в общем ключе обычная навигация съедала бы
// строгий лимит входа, и пользователя выбрасывало бы из приложения.
export const rateLimit = ({ scope, max }: { scope: string; max: number }) =>
	async (request: Request, response: Response, next: NextFunction) => {
		let result: LimitResult

		try {
			result = await consume(`rate:${scope}:${limitKey(request)}`, max)
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

const generalRateLimit = rateLimit({ scope: 'general', max: CONFIG.RATE_LIMIT_MAX })
const credentialsRateLimit = rateLimit({
	scope: 'credentials',
	max: CONFIG.RATE_LIMIT_AUTH_MAX,
})

export const mountRateLimits = (app: Express) => {
	// Жёсткий лимит - только там, где перебирают пароль или код из письма.
	// Проверка сессии (/api/auth/me) идёт на каждый рендер страницы и под ним
	// исчерпала бы лимит за пару минут обычной работы.
	app.use(
		['/api/auth/login', '/api/auth/signup', '/api/auth/reset-password'],
		credentialsRateLimit,
	)
	app.use(['/api/auth', '/api/users', '/api/boards', '/api/workspaces'], generalRateLimit)
}
