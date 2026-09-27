import { hashValue } from '../lib/hash'

import { SignupService } from './signup.service'

// Шаблоны писем тянут ESM-пакеты, которые Jest не грузит, а тесту важен
// не текст письма.
jest.mock('../email/templates/signup', () => ({ SignupEmail: jest.fn() }))
jest.mock('../email/mailer.service', () => ({ MailerService: jest.fn() }))

describe('SignupService', () => {
	test('Если профиль не создался, должен убрать и профиль, и учётную запись', async () => {
		const signups = {
			incrementAttempts: jest.fn().mockResolvedValue({
				email: 'user@example.com',
				passwordHash: 'hash',
				firstName: 'Ivan',
				lastName: 'Ivanov',
				image: null,
				phone: null,
				locale: 'ru',
				preferredColor: null,
				codeHash: hashValue('123456'),
				expiresAt: new Date(Date.now() + 60_000),
				attempts: 1,
			}),
			createAccount: jest
				.fn()
				.mockResolvedValue({ id: 'user-1', email: 'user@example.com' }),
			deleteAccount: jest.fn().mockResolvedValue(undefined),
		}
		// Таймаут: users мог создать профиль, но ответ до auth не дошёл.
		const users = {
			createProfile: jest.fn().mockRejectedValue(new Error('timeout')),
			deleteProfile: jest.fn().mockResolvedValue(undefined),
		}

		const service = new SignupService(
			signups as never,
			{} as never,
			users as never,
			{} as never,
			{} as never,
		)

		await expect(service.verify('verification-1', '123456')).rejects.toThrow(
			'timeout',
		)

		expect(users.deleteProfile).toHaveBeenCalledWith('user-1')
		expect(signups.deleteAccount).toHaveBeenCalledWith('user-1')
	})
})
