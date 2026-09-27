import type { IncomingHttpHeaders, IncomingMessage } from 'node:http'

import { parse } from 'cookie'
import type { NextFunction, Request, Response } from 'express'

import { CONFIG } from './config'
import { introspect } from './introspect'

declare module 'express-serve-static-core' {
	interface Request {
		identity?: { userId: string; role: string }
	}
}

export const USER_ID_HEADER = 'x-user-id'
export const USER_ROLE_HEADER = 'x-user-role'

// Клиент не должен иметь возможности представиться кем угодно, просто выставив
// заголовок. Всё, что приходит снаружи под этими именами, вырезается до всякой
// обработки - доверяем только тому, что поставил сам шлюз.
export const stripForgedIdentity = (
	request: Request,
	_: Response,
	next: NextFunction,
) => {
	delete request.headers[USER_ID_HEADER]
	delete request.headers[USER_ROLE_HEADER]

	next()
}

const identify = async (
	headers: IncomingHttpHeaders,
	sessionToken?: string,
) => {
	if (!sessionToken) return null

	const identity = await introspect(sessionToken)

	if (!identity) return null

	headers[USER_ID_HEADER] = identity.userId
	headers[USER_ROLE_HEADER] = identity.role

	return identity
}

export const attachIdentity = async (
	request: Request,
	_: Response,
	next: NextFunction,
) => {
	const identity = await identify(
		request.headers,
		request.cookies?.[CONFIG.SESSION_COOKIE_NAME],
	)

	if (identity) request.identity = { userId: identity.userId, role: identity.role }

	next()
}

// Апгрейд до WebSocket - событие HTTP-сервера, а не запрос Express, и цепочка
// app.use его не видит. Без этого клиент ставил бы x-user-id сам, а настоящая
// сессия до collab не доходила.
export const identifyUpgrade = async (request: IncomingMessage) => {
	delete request.headers[USER_ID_HEADER]
	delete request.headers[USER_ROLE_HEADER]

	await identify(
		request.headers,
		parse(request.headers.cookie ?? '')[CONFIG.SESSION_COOKIE_NAME],
	)
}
