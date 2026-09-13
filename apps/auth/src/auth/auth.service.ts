import { Injectable, UnauthorizedException } from '@nestjs/common'
import type { SigninData } from '@power-paint/contracts'

import { compareHash } from '../lib/hash'
import { SessionService } from '../session/session.service'

import { AccountRepository } from './account.repository'

@Injectable()
export class AuthService {
	constructor(
		private readonly accounts: AccountRepository,
		private readonly sessions: SessionService,
	) {}

	async signIn({ email, password }: SigninData) {
		const user = await this.accounts.findByEmail(email)

		// Одинаковая ошибка на неизвестный email и на неверный пароль:
		// иначе эндпоинт превращается в перечислитель зарегистрированных адресов.
		if (!user?.password) throw new UnauthorizedException('Invalid credentials')

		if (!compareHash(password, user.password))
			throw new UnauthorizedException('Invalid credentials')

		return this.sessions.create(user.id)
	}

	async identify(userId: string) {
		const user = await this.accounts.findById(userId)
		if (!user) throw new UnauthorizedException()

		return { id: user.id, email: user.email, role: user.role }
	}
}
