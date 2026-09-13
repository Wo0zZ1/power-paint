import type { NextFunction, Request, Response } from 'express'

import { stripForgedIdentity, USER_ID_HEADER, USER_ROLE_HEADER } from './identity.middleware'

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
