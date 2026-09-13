import {
	BadRequestException,
	Body,
	Controller,
	Post,
	Req,
	Res,
} from '@nestjs/common'
import { getSignupCodeSchema, signupFormSchema } from '@power-paint/contracts'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import type { Request, Response } from 'express'
import { createZodDto } from 'nestjs-zod'

import { CONFIG } from '../config'

import { SignupService } from './signup.service'

class SignupDto extends createZodDto(signupFormSchema) {}
class SignupCodeDto extends createZodDto(getSignupCodeSchema()) {}

const VERIFICATION_COOKIE = 'signupVerificationId'

const verificationCookieOptions = {
	httpOnly: true,
	sameSite: 'lax',
	path: '/',
	secure: CONFIG.COOKIE_SECURE,
	maxAge: CONFIG.VERIFICATION_TTL_MS,
} as const

const sessionCookieOptions = {
	httpOnly: true,
	sameSite: 'lax',
	path: '/',
	secure: CONFIG.COOKIE_SECURE,
} as const

@ApiTags('auth')
@Controller('api/auth/signup')
export class SignupController {
	constructor(private readonly signup: SignupService) {}

	@Post()
	@ApiOperation({ summary: 'Начало регистрации, отправляет код на email' })
	async start(
		@Body() body: SignupDto,
		@Res({ passthrough: true }) response: Response,
	) {
		const { verificationId } = await this.signup.start(body)

		response.cookie(
			VERIFICATION_COOKIE,
			verificationId,
			verificationCookieOptions,
		)

		return { ok: true }
	}

	@Post('verify')
	@ApiOperation({ summary: 'Подтверждение кода, создаёт учётную запись и сессию' })
	async verify(
		@Body() body: SignupCodeDto,
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	) {
		const verificationId = this.readVerificationId(request)

		const { sessionToken, expires } = await this.signup.verify(
			verificationId,
			body.emailCode,
		)

		response.clearCookie(VERIFICATION_COOKIE, verificationCookieOptions)
		response.cookie(CONFIG.SESSION_COOKIE_NAME, sessionToken, {
			...sessionCookieOptions,
			expires,
		})

		return { ok: true }
	}

	@Post('resend')
	@ApiOperation({ summary: 'Повторная отправка кода' })
	resend(@Req() request: Request) {
		return this.signup.resend(this.readVerificationId(request))
	}

	@Post('abort')
	@ApiOperation({ summary: 'Отмена регистрации' })
	async abort(
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	) {
		const verificationId = this.readVerificationId(request)

		response.clearCookie(VERIFICATION_COOKIE, verificationCookieOptions)

		return this.signup.abort(verificationId)
	}

	private readVerificationId(request: Request): string {
		const verificationId = request.cookies?.[VERIFICATION_COOKIE]

		if (!verificationId)
			throw new BadRequestException('auth.errors.verification_not_started')

		return verificationId
	}
}
