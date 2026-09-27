import { SessionService } from './session.service'

describe('SessionService', () => {
	test('Отзыв сессии должен сообщать шлюзу - иначе его кэш пускает по ней ещё до минуты', async () => {
		const prisma = {
			client: { session: { deleteMany: jest.fn().mockResolvedValue({ count: 1 }) } },
		}
		const events = { sessionsRevoked: jest.fn() }

		await new SessionService(prisma as never, events as never).revoke('session-1')

		expect(events.sessionsRevoked).toHaveBeenCalledWith({
			sessionTokens: ['session-1'],
		})
	})
})
