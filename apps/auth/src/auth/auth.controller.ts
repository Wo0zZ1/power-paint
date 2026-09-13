import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import type { Request, Response } from 'express'

import { CONFIG } from '../config'
import { SessionService } from '../session/session.service'

import { AuthService } from './auth.service'
import { CurrentUserId } from './currentUserId.decorator'
import { SigninDto } from './signin.dto'

const COOKIE_OPTIONS = {
	httpOnly: true,
	sameSite: 'lax',
	path: '/',
	secure: CONFIG.COOKIE_SECURE,
} as const

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
	constructor(
		private readonly auth: AuthService,
		private readonly sessions: SessionService,
	) {}

	@Post('login')
	@ApiOperation({ summary: 'Вход по email и паролю, выдаёт session-cookie' })
	async login(
		@Body() body: SigninDto,
		@Res({ passthrough: true }) response: Response,
	) {
		const { sessionToken, expires } = await this.auth.signIn(body)

		response.cookie(CONFIG.SESSION_COOKIE_NAME, sessionToken, {
			...COOKIE_OPTIONS,
			expires,
		})

		return { ok: true }
	}

	@Post('logout')
	@ApiOperation({ summary: 'Выход, отзывает сессию и чистит куку' })
	async logout(
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	) {
		const sessionToken = request.cookies?.[CONFIG.SESSION_COOKIE_NAME]

		if (sessionToken) await this.sessions.revoke(sessionToken)

		response.clearCookie(CONFIG.SESSION_COOKIE_NAME, COOKIE_OPTIONS)

		return { ok: true }
	}

	@Get('me')
	@ApiOperation({
		summary: 'Личность текущего пользователя без профиля - профиль отдаёт users',
	})
	me(@CurrentUserId() userId: string) {
		return this.auth.identify(userId)
	}
}
