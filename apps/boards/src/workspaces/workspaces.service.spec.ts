import {
	BadRequestException,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common'
import { updateWorkspaceSchema } from '@power-paint/contracts'

import { MembersService } from '../members.service'

import { WorkspacesService } from './workspaces.service'

const makeService = (workspace: { name: string } | null) => {
	const findMeta = jest.fn().mockResolvedValue(workspace)

	return new WorkspacesService(
		{ findMeta } as never,
		{} as never,
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
		{
			enrich: jest.fn(async (groups: unknown[]) => groups),
			assertExist: jest.fn(),
		} as never,
		events as never,
		{} as never,
	)

	return { service, events }
}

const makeListingService = (hasPersonal: boolean) => {
	const repository = {
		hasPersonal: jest.fn().mockResolvedValue(hasPersonal),
		createPersonal: jest.fn(),
		findMany: jest.fn().mockResolvedValue([]),
	}
	const users = {
		getMany: jest.fn().mockResolvedValue(
			new Map([['u1', { id: 'u1', name: 'Максим Перекопский' }]]),
		),
	}
	const service = new WorkspacesService(
		repository as never,
		{} as never,
		{} as never,
		{} as never,
		users as never,
	)

	return { service, repository }
}

describe('WorkspacesService', () => {
	test('Пользователь без личной области получает её при запросе списка - иначе потерянное событие оставило бы его без области навсегда', async () => {
		const { service, repository } = makeListingService(false)

		await service.getAll({}, 'u1')

		expect(repository.createPersonal).toHaveBeenCalledWith({
			ownerId: 'u1',
			name: 'Максим Перекопский',
		})
	})

	test('Личная область на месте - список ничего не создаёт', async () => {
		const { service, repository } = makeListingService(true)

		await service.getAll({}, 'u1')

		expect(repository.createPersonal).not.toHaveBeenCalled()
	})

	test('Анонимный список личную область не заводит', async () => {
		const { service, repository } = makeListingService(false)

		await service.getAll({})

		expect(repository.hasPersonal).not.toHaveBeenCalled()
	})

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

	test('Участником области не может стать пользователь, которого нет в users', async () => {
		const workspace = { id: 'w1', type: 'team', members: [], boards: [] }
		const update = jest.fn().mockResolvedValue(workspace)
		const service = new WorkspacesService(
			{ findPlainById: jest.fn().mockResolvedValue(workspace), update } as never,
			{ toWorkspace: jest.fn().mockResolvedValue('OWNER') } as never,
			new MembersService({ getMany: jest.fn().mockResolvedValue(new Map()) } as never),
			{ boardAccessChanged: jest.fn() } as never,
			{} as never,
		)

		await expect(
			service.update('w1', { members: [{ userId: 'u-нет', role: 'editor' }] }, 'u1'),
		).rejects.toBeInstanceOf(BadRequestException)
		expect(update).not.toHaveBeenCalled()
	})

	test('Один пользователь дважды в списке участников области отклоняется на входе', () => {
		const userId = '11111111-1111-4111-8111-111111111111'

		const parsed = updateWorkspaceSchema.safeParse({
			members: [
				{ userId, role: 'editor' },
				{ userId, role: 'admin' },
			],
		})

		expect(parsed.success).toBe(false)
	})
})
