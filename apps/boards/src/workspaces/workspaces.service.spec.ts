import { ForbiddenException, NotFoundException } from '@nestjs/common'

import { WorkspacesService } from './workspaces.service'

const makeService = (workspace: { name: string } | null) => {
	const findMeta = jest.fn().mockResolvedValue(workspace)

	return new WorkspacesService(
		{ findMeta } as never,
		{} as never,
		{} as never,
		{} as never,
	)
}

// Область с двумя досками, где пользователь - администратор
const makeWritableService = (role = 'OWNER') => {
	const workspace = {
		id: 'w1',
		type: 'team',
		members: [],
		boards: [
			{ id: 'b1', members: [] },
			{ id: 'b2', members: [] },
		],
	}
	const events = { boardAccessChanged: jest.fn(), boardDeleted: jest.fn() }
	const service = new WorkspacesService(
		{
			findPlainById: jest.fn().mockResolvedValue(workspace),
			update: jest.fn().mockResolvedValue(workspace),
			remove: jest.fn().mockResolvedValue(workspace),
		} as never,
		{ toWorkspace: jest.fn().mockResolvedValue(role) } as never,
		{ enrich: jest.fn(async (groups: unknown[]) => groups) } as never,
		events as never,
	)

	return { service, events }
}

describe('WorkspacesService', () => {
	test('Метаданные области отдают название', async () => {
		await expect(makeService({ name: 'Учёба' }).getMeta('w1')).resolves.toEqual({
			name: 'Учёба',
		})
	})

	test('Метаданные несуществующей области - 404', async () => {
		await expect(makeService(null).getMeta('w1')).rejects.toBeInstanceOf(
			NotFoundException,
		)
	})

	test('Смена участников области сообщает о смене прав каждой её доски', async () => {
		const { service, events } = makeWritableService()

		await service.update('w1', { members: [] }, 'u1')

		expect(events.boardAccessChanged.mock.calls).toEqual([
			[{ boardId: 'b1' }],
			[{ boardId: 'b2' }],
		])
	})

	test('Смена владельца области сообщает о смене прав её досок', async () => {
		const { service, events } = makeWritableService()

		await service.update('w1', { ownerId: 'u2' }, 'u1')

		expect(events.boardAccessChanged).toHaveBeenCalledTimes(2)
	})

	test('Переименование области права досок не трогает', async () => {
		const { service, events } = makeWritableService()

		await service.update('w1', { name: 'Новое имя' }, 'u1')

		expect(events.boardAccessChanged).not.toHaveBeenCalled()
	})

	test('Удаление области сообщает об удалении каждой её доски', async () => {
		const { service, events } = makeWritableService()

		await service.remove('w1', 'u1')

		expect(events.boardDeleted.mock.calls).toEqual([
			[{ boardId: 'b1' }],
			[{ boardId: 'b2' }],
		])
	})

	test('Администратор не может передать область - иначе сделает владельцем себя', async () => {
		const { service } = makeWritableService('ADMIN')

		await expect(
			service.update('w1', { ownerId: 'u2' }, 'u1'),
		).rejects.toBeInstanceOf(ForbiddenException)
	})
})
