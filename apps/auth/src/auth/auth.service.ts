import { randomUUID } from 'node:crypto'

import { Injectable, UnauthorizedException } from '@nestjs/common'
import type { SigninData } from '@power-paint/contracts'

import { hashPassword, verifyPassword } from '../lib/hash'
import { SessionService } from '../session/session.service'

import { AccountRepository } from './account.repository'

// Пароль неизвестного пользователя сверяется с этим хешем: scrypt идёт
// десятки миллисекунд, и без приманки быстрый отказ выдавал бы, что адреса нет.
const decoyHash = hashPassword(randomUUID())

@Injectable()
export class AuthService {
	constructor(
		private readonly accounts: AccountRepository,
		private readonly sessions: SessionService,
	) {}

	async signIn({ email, password }: SigninData) {
		const user = await this.accounts.findByEmail(email)

		const { ok, needsRehash } = await verifyPassword(
			password,
			user?.password ?? (await decoyHash),
		)

		// Одинаковая ошибка на неизвестный email и на неверный пароль:
		// иначе эндпоинт превращается в перечислитель зарегистрированных адресов.
		if (!user?.password || !ok)
			throw new UnauthorizedException('Invalid credentials')

		// Старые пароли лежат под sha256 без соли. Переписать их разом нельзя -
		// исходного пароля нет ни у кого, кроме владельца. Поэтому хеш обновляется
		// в тот единственный момент, когда пароль известен: при удачном входе.
		if (needsRehash)
			await this.accounts.updatePassword(user.id, await hashPassword(password))

		return this.sessions.create(user.id)
	}

	async identify(userId: string) {
		const user = await this.accounts.findById(userId)
		if (!user) throw new UnauthorizedException()

		return { id: user.id, email: user.email, role: user.role }
	}
}
