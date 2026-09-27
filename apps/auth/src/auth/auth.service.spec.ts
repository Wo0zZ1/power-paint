import { createHash } from 'node:crypto'

import { UnauthorizedException } from '@nestjs/common'

import * as hash from '../lib/hash'
import { hashPassword } from '../lib/hash'

import { AuthService } from './auth.service'
import type { AccountRepository } from './account.repository'
import type { SessionService } from '../session/session.service'

const PASSWORD = 'correct horse battery staple'

const legacyHash = (value: string) =>
	createHash('sha256').update(value).digest('hex')

const build = (password: string) => {
	const accounts = {
		findByEmail: jest.fn().mockResolvedValue({
			id: 'user-1',
			email: 'user@example.com',
			password,
		}),
		updatePassword: jest.fn().mockResolvedValue(undefined),
	}

	const sessions = { create: jest.fn().mockResolvedValue({ sessionToken: 'token' }) }

	const service = new AuthService(
		accounts as unknown as AccountRepository,
		sessions as unknown as SessionService,
	)

	return { service, accounts, sessions }
}

describe('AuthService sign in', () => {
	test('Должен пускать по старому sha256-паролю и переписать хеш на scrypt', async () => {
		const { service, accounts } = build(legacyHash(PASSWORD))

		await service.signIn({ email: 'user@example.com', password: PASSWORD })

		expect(accounts.updatePassword).toHaveBeenCalledTimes(1)

		const [userId, stored] = accounts.updatePassword.mock.calls[0]

		expect(userId).toBe('user-1')
		expect(stored.startsWith('scrypt$')).toBe(true)
	})

	test('Не должен трогать пароль, уже лежащий под scrypt', async () => {
		const { service, accounts, sessions } = build(await hashPassword(PASSWORD))

		await service.signIn({ email: 'user@example.com', password: PASSWORD })

		expect(accounts.updatePassword).not.toHaveBeenCalled()
		expect(sessions.create).toHaveBeenCalledWith('user-1')
	})

	test('Не должен переписывать хеш при неверном пароле', async () => {
		const { service, accounts, sessions } = build(legacyHash(PASSWORD))

		await expect(
			service.signIn({ email: 'user@example.com', password: 'wrong' }),
		).rejects.toThrow(UnauthorizedException)

		expect(accounts.updatePassword).not.toHaveBeenCalled()
		expect(sessions.create).not.toHaveBeenCalled()
	})

	test('Должен отвечать одинаково на неизвестный email и на неверный пароль', async () => {
		const { service, accounts } = build(legacyHash(PASSWORD))
		accounts.findByEmail.mockResolvedValue(null)

		await expect(
			service.signIn({ email: 'nobody@example.com', password: PASSWORD }),
		).rejects.toThrow('Invalid credentials')
	})

	test('Должен считать хеш и на неизвестный email - иначе время ответа выдаёт адрес', async () => {
		const verify = jest.spyOn(hash, 'verifyPassword')
		const { service, accounts } = build(legacyHash(PASSWORD))
		accounts.findByEmail.mockResolvedValue(null)

		await expect(
			service.signIn({ email: 'nobody@example.com', password: PASSWORD }),
		).rejects.toThrow('Invalid credentials')

		expect(verify).toHaveBeenCalled()
		verify.mockRestore()
	})
})
