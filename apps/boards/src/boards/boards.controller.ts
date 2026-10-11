import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { CurrentUserId, OptionalUserId } from '../currentUserId.decorator'

import { BoardsQueryDto, CreateBoardDto, UpdateBoardDto } from './board.dto'
import { BoardsService } from './boards.service'

@ApiTags('boards')
@Controller('api/boards')
export class BoardsController {
	constructor(private readonly boards: BoardsService) {}

	@Get()
	@ApiOperation({ summary: 'Доски, доступные пользователю' })
	getAll(
		@OptionalUserId() actorId: string | undefined,
		@Query() query: BoardsQueryDto,
	) {
		return this.boards.getAll(query, actorId)
	}

	@Get(':id/meta')
	@ApiOperation({ summary: 'Название доски для метаданных страницы' })
	getMeta(@Param('id') id: string) {
		return this.boards.getMeta(id)
	}

	@Get(':id')
	@ApiOperation({ summary: 'Доска с ролью текущего пользователя' })
	getOne(@Param('id') id: string, @OptionalUserId() actorId?: string) {
		return this.boards.getOne(id, actorId)
	}

	@Post()
	@ApiOperation({ summary: 'Создание доски, требует роль ADMIN в области' })
	create(@Body() body: CreateBoardDto, @CurrentUserId() actorId: string) {
		return this.boards.create(body, actorId)
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Изменение доски, требует роль ADMIN' })
	update(
		@Param('id') id: string,
		@Body() body: UpdateBoardDto,
		@CurrentUserId() actorId: string,
	) {
		return this.boards.update(id, body, actorId)
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Удаление доски, требует роль OWNER' })
	remove(@Param('id') id: string, @CurrentUserId() actorId: string) {
		return this.boards.remove(id, actorId)
	}
}
