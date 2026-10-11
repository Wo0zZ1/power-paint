import { NotFoundException } from '@nestjs/common'

import { PreviewService } from './preview.service'

const PNG_DATA_URL = `data:image/png;base64,${Buffer.from('png').toString('base64')}`

const makeService = (
	board: { lightPreview: string | null; darkPreview: string | null } | null,
) =>
	new PreviewService(
		{ findPreviews: jest.fn().mockResolvedValue(board) } as never,
		{} as never,
	)

describe('PreviewService', () => {
	test('Доска без снимка отдаёт заглушку, а не 404 - клиенту не нужно подставлять картинку самому', async () => {
		const service = makeService({ lightPreview: null, darkPreview: null })

		const image = await service.get('b1', 'dark')

		expect(image.contentType).toBe('image/svg+xml')
		expect(image.body.toString()).toContain('<svg')
	})

	test('Снимок доски отдаётся как есть', async () => {
		const service = makeService({ lightPreview: PNG_DATA_URL, darkPreview: null })

		const image = await service.get('b1', 'light')

		expect(image).toEqual({ contentType: 'image/png', body: Buffer.from('png') })
	})

	test('Несуществующая доска - 404', async () => {
		await expect(makeService(null).get('b1', 'light')).rejects.toBeInstanceOf(
			NotFoundException,
		)
	})
})
