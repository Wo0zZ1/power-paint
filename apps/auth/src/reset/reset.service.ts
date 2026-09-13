import { randomUUID } from 'node:crypto'

import { BadRequestException, Injectable } from '@nestjs/common'

import { UsersClient } from '../clients/users.client'
import { CONFIG } from '../config'
import { MailerService } from '../email/mailer.service'
import { ResetPasswordEmail } from '../email/templates/reset'
import { compareHash, hashPassword, hashValue } from '../lib/hash'

import { ResetRepository } from './reset.repository'

const generateCode = () => String(Math.floor(100000 + Math.random() * 900000))

@Injectable()
export class ResetService {
	constructor(
		private readonly resets: ResetRepository,
		private readonly mailer: MailerService,
		private readonly users: UsersClient,
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

		await this.sendCode(account.id, account.email, code)

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

		await this.sendCodeByUserId(record.userId, code)

		return { ok: true }
	}

	// Обмен кода из письма на одноразовый токен: код короткий и подбираемый,
	// а токен уходит в куку и живёт до смены пароля.
	async verifyCode(resetId: string, emailCode: string) {
		const record = await this.resets.incrementAttempts(resetId)

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

		await this.resets.applyNewPassword(
			record.id,
			record.userId,
			await hashPassword(password),
		)

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
