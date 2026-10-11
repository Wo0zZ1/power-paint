import {
	Body,
	Controller,
	Get,
	Header,
	Param,
	Put,
	Query,
	StreamableFile,
} from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'

import { CurrentUserId } from '../currentUserId.decorator'

import { SavePreviewDto } from './board.dto'
import { PreviewService } from './preview.service'

@ApiTags('boards')
@Controller('api/boards/:id/preview')
export class PreviewController {
	constructor(private readonly previews: PreviewService) {}

	@Get()
	@ApiOperation({ summary: 'Снимок холста картинкой' })
	@ApiQuery({ name: 'theme', required: false, enum: ['light', 'dark'] })
	@Header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
	// StreamableFile, а не Buffer: голый Buffer Nest сериализует в JSON.
	async get(@Param('id') id: string, @Query('theme') theme?: string) {
		const { contentType, body } = await this.previews.get(id, theme)

		return new StreamableFile(body, { type: contentType })
	}

	@Put()
	@ApiOperation({ summary: 'Обновление снимка, требует роль EDITOR' })
	save(
		@Param('id') id: string,
		@Body() body: SavePreviewDto,
		@CurrentUserId() actorId: string,
	) {
		return this.previews.save(id, body, actorId)
	}
}
