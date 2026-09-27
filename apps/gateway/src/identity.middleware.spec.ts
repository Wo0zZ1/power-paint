import type { IncomingMessage } from 'node:http'

import type { NextFunction, Request, Response } from 'express'

import {
	identifyUpgrade,
	stripForgedIdentity,
	USER_ID_HEADER,
	USER_ROLE_HEADER,
} from './identity.middleware'
import { introspect } from './introspect'

jest.mock('./introspect', () => ({ introspect: jest.fn() }))

const requestWith = (headers: Record<string, string>) =>
	({ headers: { ...headers } }) as unknown as Request

const run = (request: Request) => {
	const next = jest.fn() as unknown as NextFunction

	stripForgedIdentity(request, {} as Response, next)

	return next
}

describe('stripForgedIdentity', () => {
	test('Заголовок личности из клиентского запроса вырезается', () => {
		const request = requestWith({ [USER_ID_HEADER]: 'victim' })

		run(request)

		expect(request.headers[USER_ID_HEADER]).toBeUndefined()
	})

	test('Заголовок роли тоже вырезается - иначе можно назваться администратором', () => {
		const request = requestWith({ [USER_ROLE_HEADER]: 'Admin' })

		run(request)

		expect(request.headers[USER_ROLE_HEADER]).toBeUndefined()
	})

	test('Остальные заголовки не трогаются', () => {
		const request = requestWith({
			[USER_ID_HEADER]: 'victim',
			cookie: 'authjs.session-token=abc',
			'user-agent': 'curl',
		})

		run(request)

		expect(request.headers.cookie).toBe('authjs.session-token=abc')
		expect(request.headers['user-agent']).toBe('curl')
	})

	test('Запрос без заголовков личности проходит без изменений', () => {
		const request = requestWith({ accept: 'application/json' })

		const next = run(request)

		expect(next).toHaveBeenCalled()
		expect(request.headers).toEqual({ accept: 'application/json' })
	})
})

describe('identifyUpgrade', () => {
	const upgradeWith = (headers: Record<string, string>) =>
		({ headers: { ...headers } }) as unknown as IncomingMessage

	beforeEach(() => jest.mocked(introspect).mockReset())

	test('Поддельная личность в апгрейде без сессии вырезается', async () => {
		const request = upgradeWith({ [USER_ID_HEADER]: 'victim', [USER_ROLE_HEADER]: 'Admin' })

		await identifyUpgrade(request)

		expect(request.headers[USER_ID_HEADER]).toBeUndefined()
		expect(request.headers[USER_ROLE_HEADER]).toBeUndefined()
		expect(introspect).not.toHaveBeenCalled()
	})

	test('Апгрейд с живой сессией получает личность из интроспекции, а не от клиента', async () => {
		jest.mocked(introspect).mockResolvedValue({ userId: 'u1', email: 'u1@test', role: 'User' })
		const request = upgradeWith({
			[USER_ID_HEADER]: 'victim',
			cookie: 'theme=dark; authjs.session-token=abc',
		})

		await identifyUpgrade(request)

		expect(introspect).toHaveBeenCalledWith('abc')
		expect(request.headers[USER_ID_HEADER]).toBe('u1')
		expect(request.headers[USER_ROLE_HEADER]).toBe('User')
	})

	test('Апгрейд с недействительной сессией проходит анонимом', async () => {
		jest.mocked(introspect).mockResolvedValue(null)
		const request = upgradeWith({
			[USER_ID_HEADER]: 'victim',
			cookie: 'authjs.session-token=expired',
		})

		await identifyUpgrade(request)

		expect(request.headers[USER_ID_HEADER]).toBeUndefined()
	})
})
