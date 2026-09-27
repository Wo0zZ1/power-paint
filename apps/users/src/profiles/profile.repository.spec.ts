import { ProfileRepository } from './profile.repository'

describe('ProfileRepository', () => {
	test('Email должен искаться только целиком, а не по подстроке', async () => {
		const findMany = jest.fn().mockResolvedValue([])
		const repository = new ProfileRepository({
			client: { profile: { findMany } },
		} as never)

		await repository.search('ann', 20)

		const { where } = findMany.mock.calls[0][0]

		expect(where.OR).toContainEqual({
			email: { equals: 'ann', mode: 'insensitive' },
		})
		expect(where.OR).not.toContainEqual({
			email: { contains: 'ann', mode: 'insensitive' },
		})
	})
})
