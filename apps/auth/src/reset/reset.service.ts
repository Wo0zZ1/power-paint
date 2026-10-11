import { randomUUID } from 'node:crypto'

import { BadRequestException, Injectable } from '@nestjs/common'

import { UsersClient } from '../clients/users.client'
import { CONFIG } from '../config'
import { MailerService } from '../email/mailer.service'
import { ResetPasswordEmail } from '../email/templates/reset'
import { EventsService } from '../events.service'
import { generateCode } from '../lib/code'
import { compareHash, hashPassword, hashValue } from '../lib/hash'

import { ResetRepository } from './reset.repository'

@Injectable()
export class ResetService {
	constructor(
		private readonly resets: ResetRepository,
		private readonly mailer: MailerService,
		private readonly users: UsersClient,
		private readonly events: EventsService,
	) {}

	// Всегда возвращает один и тот же resetId, даже если такого email нет:
	// иначе эндпоинт становится перечислителем зарегистрированных адресов.
	async request(email: string) {
		const resetId = randomUUID()

		const account = await this.resets.findAccountByEmail(email)
		if (!account) return { resetId }

		const code = generateCode()
		const expiresAt = new Date(Date.now() + CONFIG.VERIFICATION_TTL_MS)

		const record = await this.resets.upsert(
			resetId,
			account.id,
			hashValue(code),
			expiresAt,
		)

		// Письмо уходит в фоне: SMTP отвечает секундами, и ожидание выдало бы
		// по времени ответа, что адрес зарегистрирован.
		this.sendCode(account.id, account.email, code).catch(error =>
			console.error('Failed to send reset code:', error),
		)

		return { resetId: record.id }
	}

	async resend(resetId: string) {
		const code = generateCode()
		const expiresAt = new Date(Date.now() + CONFIG.VERIFICATION_TTL_MS)

		const record = await this.resets.replaceCode(
			resetId,
			hashValue(code),
			expiresAt,
		)

		// Сброс для незарегистрированного адреса существует только в куке:
		// ответ тот же, что и для настоящего, письмо просто не уходит.
		if (!record) return { ok: true }

		await this.sendCodeByUserId(record.userId, code)

		return { ok: true }
	}

	// Обмен кода из письма на одноразовый токен: код короткий и подбираемый,
	// а токен уходит в куку и живёт до смены пароля.
	async verifyCode(resetId: string, emailCode: string) {
		const record = await this.resets.incrementAttempts(resetId)

		if (!record) throw new BadRequestException('auth.errors.invalid_email_code')

		if (record.expiresAt < new Date())
			throw new BadRequestException('auth.errors.code_expired')

		if (record.attempts > CONFIG.MAX_VERIFICATION_ATTEMPTS)
			throw new BadRequestException('auth.errors.compromised_email_code')

		if (!compareHash(emailCode, record.codeHash))
			throw new BadRequestException('auth.errors.invalid_email_code')

		const resetToken = randomUUID()

		await this.resets.replaceCode(
			record.id,
			hashValue(resetToken),
			new Date(Date.now() + CONFIG.VERIFICATION_TTL_MS),
		)

		return { resetToken }
	}

	async updatePassword(resetId: string, resetToken: string, password: string) {
		const record = await this.resets.findById(resetId)
		if (!record) throw new BadRequestException('errors.unknown_error')

		if (record.expiresAt < new Date())
			throw new BadRequestException('auth.errors.code_expired')

		if (!compareHash(resetToken, record.codeHash))
			throw new BadRequestException('errors.unknown_error')

		const sessionTokens = await this.resets.applyNewPassword(
			record.id,
			record.userId,
			await hashPassword(password),
		)

		if (sessionTokens.length) this.events.sessionsRevoked({ sessionTokens })

		return { ok: true }
	}

	async abort(resetId: string) {
		await this.resets.deleteById(resetId)

		return { ok: true }
	}

	// Имя и язык живут в users, поэтому письмо собирается после запроса профиля.
	// Если профиль недоступен, письмо всё равно уходит - на английский и по адресу.
	private async sendCode(userId: string, email: string, validationCode: string) {
		const profile = await this.users.getProfile(userId)

		await this.mailer.send({
			to: email,
			subject: 'Reset your password',
			component: ResetPasswordEmail({
				name: profile?.name ?? email,
				locale: profile?.locale ?? 'en',
				validationCode,
			}),
		})
	}

	private async sendCodeByUserId(userId: string, validationCode: string) {
		const profile = await this.users.getProfile(userId)
		if (!profile) return

		await this.sendCode(userId, profile.email, validationCode)
	}
}
