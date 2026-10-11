import type { AddressInfo } from 'node:net'

import express from 'express'
import type { NextFunction, Request, Response } from 'express'

import { CONFIG } from './config'
import { mountRateLimits, rateLimit } from './rateLimit'
import { redis } from './redis'

// Скользящее окно живёт в Redis, и подменять его моком бессмысленно: проверять
// надо поведение транзакции, а не собственную заглушку. Набор требует живого
// Redis и включается флагом - иначе тест молча проходил бы без проверки,
// что хуже честного пропуска.
const describeIntegration =
	process.env.RUN_INTEGRATION_TESTS === 'true' ? describe : describe.skip

beforeAll(() => redis.connect())

afterAll(() => redis.quit())

const requestFrom = (address: string) =>
	({
		socket: { remoteAddress: address },
		header: () => undefined,
	}) as unknown as Request

const responseStub = () => {
	const response = {
		statusCode: 0,
		headers: {} as Record<string, string>,
		setHeader(name: string, value: string) {
			this.headers[name.toLowerCase()] = value
		},
		status(code: number) {
			this.statusCode = code
			return this
		},
		json() {
			return this
		},
	}

	return response as unknown as Response & typeof response
}

const call = async (limiter: ReturnType<typeof rateLimit>, address: string) => {
	const response = responseStub()
	const next = jest.fn() as unknown as NextFunction

	await limiter(requestFrom(address), response, next)

	return { passed: (next as jest.Mock).mock.calls.length > 0, response }
}

// Шлюз в миниатюре: личность уже установлена, лимиты смонтированы как в server.ts.
const serve = async (userId: string) => {
	const app = express()

	app.use((request, _, next) => {
		request.identity = { userId, role: 'user' }
		next()
	})
	mountRateLimits(app)
	app.use((_, response) => {
		response.json({ ok: true })
	})

	const server = app.listen(0)
	await new Promise(resolve => server.once('listening', resolve))

	return {
		url: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
		close: () => new Promise(resolve => server.close(resolve)),
	}
}

describeIntegration('rateLimit (нужен живой Redis)', () => {
	test('Запросы в пределах лимита проходят, следующий получает 429', async () => {
		const limiter = rateLimit({ scope: 'test', max: 3 })
		const address = `test-${Date.now()}`

		const results = []
		for (let i = 0; i < 4; i++) results.push(await call(limiter, address))

		expect(results.slice(0, 3).every(r => r.passed)).toBe(true)
		expect(results[3].passed).toBe(false)
		expect(results[3].response.statusCode).toBe(429)
	})

	test('Отказ содержит Retry-After', async () => {
		const limiter = rateLimit({ scope: 'test', max: 1 })
		const address = `test-retry-${Date.now()}`

		await call(limiter, address)
		const { response } = await call(limiter, address)

		expect(response.headers['retry-after']).toBeDefined()
	})

	test('Проверка сессии не расходует лимит входа - иначе после нескольких переходов по страницам пользователя выбрасывает на вход', async () => {
		const { url, close } = await serve(`limits-${Date.now()}`)

		for (let i = 0; i <= CONFIG.RATE_LIMIT_AUTH_MAX; i++) await fetch(`${url}/api/auth/me`)
		const login = await fetch(`${url}/api/auth/login`, { method: 'POST' })

		await close()
		expect(login.status).toBe(200)
	})

	test('Вход по-прежнему ограничен строгим лимитом', async () => {
		const { url, close } = await serve(`brute-${Date.now()}`)

		const statuses = []
		for (let i = 0; i <= CONFIG.RATE_LIMIT_AUTH_MAX; i++)
			statuses.push((await fetch(`${url}/api/auth/login`, { method: 'POST' })).status)

		await close()
		expect(statuses.at(-1)).toBe(429)
	})

	test('Лимит считается по ключу, а не глобально', async () => {
		const limiter = rateLimit({ scope: 'test', max: 1 })
		const suffix = Date.now()

		await call(limiter, `first-${suffix}`)
		const other = await call(limiter, `second-${suffix}`)

		expect(other.passed).toBe(true)
	})
})
