import { OauthService } from './oauth.service'
import type { OAuthProvider } from './providers'

describe('OauthService', () => {
	afterEach(() => jest.restoreAllMocks())

	test('Если профиль нового пользователя не создался, должен убрать и профиль, и учётную запись', async () => {
		jest.spyOn(global, 'fetch').mockResolvedValue({
			ok: true,
			json: async () => ({ access_token: 'access' }),
		} as Response)

		const provider = {
			id: 'github',
			tokenUrl: 'https://provider/token',
			fetchProfile: jest.fn().mockResolvedValue({
				providerAccountId: 'gh-1',
				email: 'user@example.com',
				name: 'User',
			}),
		} as unknown as OAuthProvider

		const accounts = {
			findAccount: jest.fn().mockResolvedValue(null),
			findUserByEmail: jest.fn().mockResolvedValue(null),
			createUser: jest.fn().mockResolvedValue({ id: 'user-1' }),
			linkAccount: jest.fn().mockResolvedValue(undefined),
			deleteUser: jest.fn().mockResolvedValue(undefined),
		}
		const users = {
			createProfile: jest.fn().mockRejectedValue(new Error('timeout')),
			deleteProfile: jest.fn().mockResolvedValue(undefined),
		}

		const service = new OauthService(
			accounts as never,
			users as never,
			{} as never,
			{} as never,
		)

		await expect(service.signIn(provider, 'code')).rejects.toThrow('timeout')

		expect(users.deleteProfile).toHaveBeenCalledWith('user-1')
		expect(accounts.deleteUser).toHaveBeenCalledWith('user-1')
	})
})
