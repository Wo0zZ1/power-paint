import {
	BadRequestException,
	Body,
	Controller,
	Post,
	Req,
	Res,
} from '@nestjs/common'
import {
	forgotPasswordSchema,
	resetPasswordSchema,
	signupCodeSchema,
} from '@power-paint/contracts'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import type { Request, Response } from 'express'
import { createZodDto } from 'nestjs-zod'

import { CONFIG } from '../config'

import { ResetService } from './reset.service'

class ForgotPasswordDto extends createZodDto(forgotPasswordSchema) {}
class ResetCodeDto extends createZodDto(signupCodeSchema) {}
class NewPasswordDto extends createZodDto(resetPasswordSchema) {}

const RESET_COOKIE = 'resetPasswordToken'

const cookieOptions = {
	httpOnly: true,
	sameSite: 'lax',
	path: '/',
	secure: CONFIG.COOKIE_SECURE,
	maxAge: CONFIG.VERIFICATION_TTL_MS,
} as const

@ApiTags('auth')
@Controller('api/auth/reset-password')
export class ResetController {
	constructor(private readonly reset: ResetService) {}

	@Post()
	@ApiOperation({
		summary: 'Запрос сброса пароля, всегда отвечает успехом',
	})
	async request(
		@Body() body: ForgotPasswordDto,
		@Res({ passthrough: true }) response: Response,
	) {
		const { resetId } = await this.reset.request(body.email)

		response.cookie(RESET_COOKIE, resetId, cookieOptions)

		return { ok: true }
	}

	@Post('verify')
	@ApiOperation({ summary: 'Обмен кода из письма на одноразовый токен' })
	async verify(
		@Body() body: ResetCodeDto,
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	) {
		const [resetId] = this.readCookie(request)

		const { resetToken } = await this.reset.verifyCode(resetId, body.emailCode)

		response.cookie(RESET_COOKIE, `${resetId}:${resetToken}`, cookieOptions)

		return { ok: true }
	}

	@Post('resend')
	@ApiOperation({ summary: 'Повторная отправка кода' })
	resend(@Req() request: Request) {
		const [resetId] = this.readCookie(request)

		return this.reset.resend(resetId)
	}

	@Post('confirm')
	@ApiOperation({ summary: 'Установка нового пароля, отзывает все сессии' })
	async confirm(
		@Body() body: NewPasswordDto,
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	) {
		const [resetId, resetToken] = this.readCookie(request)

		if (!resetToken) throw new BadRequestException('errors.unknown_error')

		await this.reset.updatePassword(resetId, resetToken, body.password)

		response.clearCookie(RESET_COOKIE, cookieOptions)
		response.clearCookie(CONFIG.SESSION_COOKIE_NAME, { path: '/' })

		return { ok: true }
	}

	@Post('abort')
	@ApiOperation({ summary: 'Отмена сброса пароля' })
	async abort(
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	) {
		const [resetId] = this.readCookie(request)

		response.clearCookie(RESET_COOKIE, cookieOptions)

		return this.reset.abort(resetId)
	}

	private readCookie(request: Request): [string, string?] {
		const value = request.cookies?.[RESET_COOKIE]

		if (!value) throw new BadRequestException('errors.unknown_error')

		const [resetId, resetToken] = value.split(':')

		return [resetId, resetToken]
	}
}
