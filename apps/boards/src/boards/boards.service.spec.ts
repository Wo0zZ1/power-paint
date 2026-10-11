import {
	BadRequestException,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common'
import { updateBoardSchema } from '@power-paint/contracts'

import { MembersService } from '../members.service'

import { BoardsService } from './boards.service'

const makeService = (board: { name: string } | null) => {
	const findMeta = jest.fn().mockResolvedValue(board)

	return new BoardsService(
		{ findMeta } as never,
		{} as never,
		{} as never,
		{} as never,
		{} as never,
	)
}

describe('BoardsService', () => {
	test('Метаданные доски отдают название', async () => {
		await expect(makeService({ name: 'Схема' }).getMeta('b1')).resolves.toEqual({
			name: 'Схема',
		})
	})

	test('Метаданные несуществующей доски - 404', async () => {
		await expect(makeService(null).getMeta('b1')).rejects.toBeInstanceOf(
			NotFoundException,
		)
	})

	test('Смена владельца доски сообщает о смене прав', async () => {
		const board = { id: 'b1', members: [] }
		const events = { boardAccessChanged: jest.fn() }
		const service = new BoardsService(
			{
				findById: jest.fn().mockResolvedValue(board),
				update: jest.fn().mockResolvedValue(board),
			} as never,
			{ toBoard: jest.fn().mockResolvedValue('OWNER') } as never,
			{
				enrich: jest.fn(async (groups: unknown[]) => groups),
				assertExist: jest.fn(),
			} as never,
			{} as never,
			events as never,
		)

		await service.update('b1', { ownerId: 'u2' }, 'u1')

		expect(events.boardAccessChanged).toHaveBeenCalledWith({ boardId: 'b1' })
	})

	test('Передать доску несуществующему пользователю нельзя - владелец навсегда потерял бы к ней доступ', async () => {
		const board = { id: 'b1', members: [] }
		const update = jest.fn().mockResolvedValue(board)
		const service = new BoardsService(
			{ findById: jest.fn().mockResolvedValue(board), update } as never,
			{ toBoard: jest.fn().mockResolvedValue('OWNER') } as never,
			new MembersService({ getMany: jest.fn().mockResolvedValue(new Map()) } as never),
			{} as never,
			{ boardAccessChanged: jest.fn() } as never,
		)

		await expect(
			service.update('b1', { ownerId: 'u-нет' }, 'u1'),
		).rejects.toBeInstanceOf(BadRequestException)
		expect(update).not.toHaveBeenCalled()
	})

	test('Один пользователь дважды в списке участников отклоняется на входе, а не падает в БД', () => {
		const userId = '11111111-1111-4111-8111-111111111111'

		const parsed = updateBoardSchema.safeParse({
			members: [
				{ userId, role: 'editor' },
				{ userId, role: 'viewer' },
			],
		})

		expect(parsed.success).toBe(false)
	})

	test('Администратор не может передать доску - иначе сделает владельцем себя', async () => {
		const board = { id: 'b1', members: [] }
		const update = jest.fn().mockResolvedValue(board)
		const service = new BoardsService(
			{ findById: jest.fn().mockResolvedValue(board), update } as never,
			{ toBoard: jest.fn().mockResolvedValue('ADMIN') } as never,
			{} as never,
			{} as never,
			{} as never,
		)

		await expect(
			service.update('b1', { ownerId: 'u1' }, 'u1'),
		).rejects.toBeInstanceOf(ForbiddenException)
		expect(update).not.toHaveBeenCalled()
	})
})
