import { randomUUID } from 'node:crypto'

import { BadRequestException, ConflictException, Injectable } from '@nestjs/common'
import type { SignupFormData } from '@power-paint/contracts'

import { UsersClient } from '../clients/users.client'
import { CONFIG } from '../config'
import { MailerService } from '../email/mailer.service'
import { EventsService } from '../events.service'
import { SignupEmail } from '../email/templates/signup'
import { generateCode } from '../lib/code'
import { compareHash, hashPassword, hashValue } from '../lib/hash'
import { SessionService } from '../session/session.service'

import { SignupRepository } from './signup.repository'

@Injectable()
export class SignupService {
	constructor(
		private readonly signups: SignupRepository,
		private readonly mailer: MailerService,
		private readonly users: UsersClient,
		private readonly sessions: SessionService,
		private readonly events: EventsService,
	) {}

	async start(data: SignupFormData) {
		const existing = await this.signups.findAccountByEmail(data.email)
		if (existing) throw new ConflictException('auth.errors.email_in_use')

		const verificationId = randomUUID()
		const code = generateCode()

		const pending = await this.signups.upsertPending(data.email, {
			verificationId,
			email: data.email,
			firstName: data.firstName,
			lastName: data.lastName,
			passwordHash: await hashPassword(data.password),
			phone: data.phone ?? null,
			locale: data.locale,
			preferredColor: data.preferredColor ?? null,
			image: data.image ?? null,
			codeHash: hashValue(code),
			expiresAt: new Date(Date.now() + CONFIG.VERIFICATION_TTL_MS),
			attempts: 0,
		})

		await this.sendCode(pending.email, pending.firstName, pending.locale, code)

		return { verificationId: pending.verificationId }
	}

	async resend(verificationId: string) {
		const code = generateCode()
		const expiresAt = new Date(Date.now() + CONFIG.VERIFICATION_TTL_MS)

		const pending = await this.signups.refreshCode(
			verificationId,
			hashValue(code),
			expiresAt,
		)

		if (!pending)
			throw new BadRequestException('auth.errors.verification_not_started')

		await this.sendCode(pending.email, pending.firstName, pending.locale, code)

		return { ok: true }
	}

	async verify(verificationId: string, emailCode: string) {
		const pending = await this.signups.incrementAttempts(verificationId)

		if (!pending) throw new BadRequestException('auth.errors.invalid_email_code')

		if (pending.expiresAt < new Date())
			throw new BadRequestException('auth.errors.code_expired')

		if (pending.attempts > CONFIG.MAX_VERIFICATION_ATTEMPTS)
			throw new BadRequestException('auth.errors.compromised_email_code')

		if (!compareHash(emailCode, pending.codeHash))
			throw new BadRequestException('auth.errors.invalid_email_code')

		const account = await this.signups.createAccount(
			pending.email,
			pending.passwordHash,
		)

		// Профиль живёт в другом сервисе, поэтому общей транзакции нет.
		// Если он не создался - откатываем учётную запись вручную, иначе останется
		// пользователь, которого не видно в интерфейсе. Профиль убираем тоже:
		// при таймауте users мог его создать, просто ответ до нас не дошёл.
		try {
			await this.users.createProfile({
				userId: account.id,
				email: account.email,
				name: `${pending.firstName} ${pending.lastName}`,
				image: pending.image,
				phone: pending.phone,
				locale: pending.locale,
				preferredColor: pending.preferredColor ?? undefined,
			})
		} catch (error) {
			await this.users.deleteProfile(account.id)
			await this.signups.deleteAccount(account.id)
			throw error
		}

		await this.signups.deletePending(verificationId)

		// Персональную область заводит boards, получив это событие. Асинхронно,
		// потому что вход не должен ждать чужой записи и падать из-за неё.
		this.events.userCreated({
			userId: account.id,
			name: `${pending.firstName} ${pending.lastName}`,
		})

		return this.sessions.create(account.id)
	}

	async abort(verificationId: string) {
		await this.signups.deletePending(verificationId)

		return { ok: true }
	}

	private sendCode(
		to: string,
		name: string,
		locale: string,
		validationCode: string,
	) {
		return this.mailer.send({
			to,
			subject: 'Verify your email',
			component: SignupEmail({ name, locale, validationCode }),
		})
	}
}
