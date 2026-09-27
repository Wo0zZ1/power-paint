import { UsersClient } from './users.client'

describe('UsersClient', () => {
	afterEach(() => jest.restoreAllMocks())

	test('Больше 100 участников должно запрашиваться частями - users режет пачку на 100', async () => {
		const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(async url => {
			const ids = new URL(String(url)).searchParams.get('ids')!.split(',')

			return {
				ok: ids.length <= 100,
				json: async () => ids.map(id => ({ id })),
			} as Response
		})

		const userIds = Array.from({ length: 250 }, (_, index) => `user-${index}`)

		const profiles = await new UsersClient().getMany(userIds)

		expect(fetchMock).toHaveBeenCalledTimes(3)
		expect(profiles.size).toBe(250)
	})
})
