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

export const attachIdentity = async (
	request: Request,
	_: Response,
	next: NextFunction,
) => {
	const sessionToken = request.cookies?.[CONFIG.SESSION_COOKIE_NAME]

	if (!sessionToken) return next()

	const identity = await introspect(sessionToken)

	if (!identity) return next()

	request.identity = { userId: identity.userId, role: identity.role }
	request.headers[USER_ID_HEADER] = identity.userId
	request.headers[USER_ROLE_HEADER] = identity.role

	next()
}
