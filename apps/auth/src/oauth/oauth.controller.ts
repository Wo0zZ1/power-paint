import { randomUUID } from 'node:crypto'

import {
	BadRequestException,
	Controller,
	Get,
	Param,
	Query,
	Req,
	Res,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import type { Request, Response } from 'express'

import { CONFIG } from '../config'

import { OauthService } from './oauth.service'

const STATE_COOKIE = 'oauthState'

const stateCookieOptions = {
	httpOnly: true,
	sameSite: 'lax',
	path: '/',
	secure: CONFIG.COOKIE_SECURE,
	maxAge: 10 * 60 * 1000,
} as const

@ApiTags('auth')
@Controller('api/auth/oauth')
export class OauthController {
	constructor(private readonly oauth: OauthService) {}

	@Get(':provider')
	@ApiOperation({ summary: 'Начало входа через провайдера, редирект на него' })
	start(
		@Param('provider') providerId: string,
		@Res({ passthrough: true }) response: Response,
	) {
		const provider = this.oauth.getProvider(providerId)
		const state = randomUUID()

		response.cookie(STATE_COOKIE, state, stateCookieOptions)
		response.redirect(this.oauth.buildAuthorizationUrl(provider, state))
	}

	@Get(':provider/callback')
	@ApiOperation({ summary: 'Возврат от провайдера, выдаёт session-cookie' })
	async callback(
		@Param('provider') providerId: string,
		@Query('code') code: string,
		@Query('state') state: string,
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	) {
		const provider = this.oauth.getProvider(providerId)

		// Защита от CSRF: state из редиректа должен совпасть с тем, что мы положили
		// в куку перед уходом к провайдеру.
		const expectedState = request.cookies?.[STATE_COOKIE]

		if (!expectedState || expectedState !== state)
			throw new BadRequestException('Invalid state')

		if (!code) throw new BadRequestException('Missing code')

		const { sessionToken, expires } = await this.oauth.signIn(provider, code)

		response.clearCookie(STATE_COOKIE, stateCookieOptions)
		response.cookie(CONFIG.SESSION_COOKIE_NAME, sessionToken, {
			httpOnly: true,
			sameSite: 'lax',
			path: '/',
			secure: CONFIG.COOKIE_SECURE,
			expires,
		})

		response.redirect(CONFIG.PUBLIC_BASE_URL)
	}
}
