import { NotFoundException } from '@nestjs/common'

import { WorkspacesService } from './workspaces.service'

const makeService = (workspace: { name: string } | null) => {
	const findMeta = jest.fn().mockResolvedValue(workspace)

	return new WorkspacesService({ findMeta } as never, {} as never, {} as never)
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
})
