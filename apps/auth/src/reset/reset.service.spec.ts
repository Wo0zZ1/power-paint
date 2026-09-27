import { hashValue } from '../lib/hash'

import { ResetService } from './reset.service'

// Шаблоны писем тянут ESM-пакеты, которые Jest не грузит, а тесту важен
// не текст письма.
jest.mock('../email/templates/reset', () => ({ ResetPasswordEmail: jest.fn() }))
jest.mock('../email/mailer.service', () => ({ MailerService: jest.fn() }))

const build = () => {
	const resets = {
		findAccountByEmail: jest
			.fn()
			.mockResolvedValue({ id: 'user-1', email: 'user@example.com' }),
		upsert: jest.fn().mockResolvedValue({ id: 'reset-1' }),
		findById: jest.fn().mockResolvedValue({
			id: 'reset-1',
			userId: 'user-1',
			codeHash: hashValue('reset-token'),
			expiresAt: new Date(Date.now() + 60_000),
		}),
		applyNewPassword: jest.fn().mockResolvedValue(['session-1', 'session-2']),
	}

	// Письмо, которое никогда не уходит: ответ, ждущий его, не вернётся вовсе.
	const mailer = { send: jest.fn(() => new Promise(() => undefined)) }
	const users = { getProfile: jest.fn().mockResolvedValue(null) }
	const events = { sessionsRevoked: jest.fn() }

	const service = new ResetService(
		resets as never,
		mailer as never,
		users as never,
		events as never,
	)

	return { service, resets, events }
}

describe('ResetService', () => {
	test('Запрос сброса не должен ждать письма - иначе время ответа выдаёт, есть ли адрес', async () => {
		const { service } = build()

		await expect(service.request('user@example.com')).resolves.toEqual({
			resetId: 'reset-1',
		})
	}, 1_000)

	test('Смена пароля должна сообщать об отозванных сессиях, чтобы шлюз забыл их', async () => {
		const { service, events } = build()

		await service.updatePassword('reset-1', 'reset-token', 'new password 123')

		expect(events.sessionsRevoked).toHaveBeenCalledWith({
			sessionTokens: ['session-1', 'session-2'],
		})
	})
})
