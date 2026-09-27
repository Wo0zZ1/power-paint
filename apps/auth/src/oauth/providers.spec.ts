import { PROVIDERS } from './providers'

const respondWith = (body: unknown) =>
	jest
		.spyOn(global, 'fetch')
		.mockResolvedValue({ ok: true, json: async () => body } as Response)

describe('Google provider', () => {
	afterEach(() => jest.restoreAllMocks())

	test('Не должен отдавать профиль с неподтверждённым email - по нему привязали бы чужую учётную запись', async () => {
		respondWith({ sub: 'g-1', email: 'victim@example.com', email_verified: false })

		await expect(PROVIDERS.google.fetchProfile('token')).rejects.toThrow()
	})

	test('Должен отдавать профиль с подтверждённым email', async () => {
		respondWith({ sub: 'g-1', email: 'User@Example.com', email_verified: true })

		await expect(PROVIDERS.google.fetchProfile('token')).resolves.toMatchObject({
			providerAccountId: 'g-1',
			email: 'user@example.com',
		})
	})
})
