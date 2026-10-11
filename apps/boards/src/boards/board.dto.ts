import {
	boardsQuerySchema,
	createBoardSchema,
	updateBoardSchema,
} from '@power-paint/contracts'
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export class CreateBoardDto extends createZodDto(createBoardSchema) {}
export class UpdateBoardDto extends createZodDto(updateBoardSchema) {}
export class BoardsQueryDto extends createZodDto(boardsQuerySchema) {}

const base64ImageSchema = z
	.string()
	.regex(
		/^data:image\/(png|jpeg|jpg);base64,[A-Za-z0-9+/]+={0,2}$/,
		'Invalid data URL for preview image',
	)

const savePreviewSchema = z.object({
	previewDataUrl: base64ImageSchema,
	theme: z.enum(['light', 'dark']),
})

export class SavePreviewDto extends createZodDto(savePreviewSchema) {}
