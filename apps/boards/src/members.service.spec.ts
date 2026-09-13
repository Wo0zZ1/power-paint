import type { PublicUser } from '@power-paint/contracts'

import { MembersService } from './members.service'

const profile = (id: string, name: string): PublicUser => ({
	id,
	name,
	image: null,
	email: `${name}@example.com`,
	preferredColor: '#000000',
	created_at: new Date(),
})

const makeService = (profiles: PublicUser[]) => {
	const getMany = jest
		.fn()
		.mockResolvedValue(new Map(profiles.map(p => [p.id, p])))

	return { service: new MembersService({ getMany } as never), getMany }
}

describe('MembersService', () => {
	test('Профили запрашиваются одним вызовом на весь набор, а не по участнику', async () => {
		const { service, getMany } = makeService([
			profile('u1', 'Максим'),
			profile('u2', 'Алексей'),
			profile('u3', 'Ольга'),
		])

		await service.enrich([
			[{ userId: 'u1' }, { userId: 'u2' }],
			[{ userId: 'u3' }],
		])

		expect(getMany).toHaveBeenCalledTimes(1)
	})

	test('Повторяющиеся участники запрашиваются один раз', async () => {
		const { service, getMany } = makeService([profile('u1', 'Максим')])

		await service.enrich([
			[{ userId: 'u1' }],
			[{ userId: 'u1' }],
			[{ userId: 'u1' }],
		])

		expect(getMany).toHaveBeenCalledWith(['u1'])
	})

	test('Группы возвращаются в том же порядке и с теми же участниками', async () => {
		const { service } = makeService([
			profile('u1', 'Максим'),
			profile('u2', 'Алексей'),
		])

		const [first, second] = await service.enrich([
			[{ userId: 'u2' }],
			[{ userId: 'u1' }, { userId: 'u2' }],
		])

		expect(first.map(m => m.user.name)).toEqual(['Алексей'])
		expect(second.map(m => m.user.name)).toEqual(['Максим', 'Алексей'])
	})

	test('Участник без профиля пропускается - в users его уже удалили', async () => {
		const { service } = makeService([profile('u1', 'Максим')])

		const [members] = await service.enrich([
			[{ userId: 'u1' }, { userId: 'u-удалён' }],
		])

		expect(members).toHaveLength(1)
		expect(members[0].user.id).toBe('u1')
	})

	test('Пустой набор не идёт в users вовсе', async () => {
		const { service, getMany } = makeService([])

		await service.enrich([[], []])

		expect(getMany).toHaveBeenCalledWith([])
	})
})
