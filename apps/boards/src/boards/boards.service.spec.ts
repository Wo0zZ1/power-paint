import { NotFoundException } from '@nestjs/common'

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

})
