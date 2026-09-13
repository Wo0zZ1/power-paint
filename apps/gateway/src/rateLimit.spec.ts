import type { NextFunction, Request, Response } from 'express'

import { rateLimit } from './rateLimit'
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

describeIntegration('rateLimit (нужен живой Redis)', () => {
	test('Запросы в пределах лимита проходят, следующий получает 429', async () => {
		const limiter = rateLimit(3)
		const address = `test-${Date.now()}`

		const results = []
		for (let i = 0; i < 4; i++) results.push(await call(limiter, address))

		expect(results.slice(0, 3).every(r => r.passed)).toBe(true)
		expect(results[3].passed).toBe(false)
		expect(results[3].response.statusCode).toBe(429)
	})

	test('Отказ содержит Retry-After', async () => {
		const limiter = rateLimit(1)
		const address = `test-retry-${Date.now()}`

		await call(limiter, address)
		const { response } = await call(limiter, address)

		expect(response.headers['retry-after']).toBeDefined()
	})

	test('Лимит считается по ключу, а не глобально', async () => {
		const limiter = rateLimit(1)
		const suffix = Date.now()

		await call(limiter, `first-${suffix}`)
		const other = await call(limiter, `second-${suffix}`)

		expect(other.passed).toBe(true)
	})
})
