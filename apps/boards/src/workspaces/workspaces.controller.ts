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

import {
	CreateWorkspaceDto,
	UpdateWorkspaceDto,
	WorkspacesQueryDto,
} from './workspace.dto'
import { WorkspacesService } from './workspaces.service'

@ApiTags('workspaces')
@Controller('api/workspaces')
export class WorkspacesController {
	constructor(private readonly workspaces: WorkspacesService) {}

	@Get()
	@ApiOperation({ summary: 'Страница рабочих областей, доступных пользователю' })
	getAll(
		@OptionalUserId() actorId: string | undefined,
		@Query() query: WorkspacesQueryDto,
	) {
		return this.workspaces.getAll(query, actorId)
	}

	@Get(':id/meta')
	@ApiOperation({ summary: 'Название области для метаданных страницы' })
	getMeta(@Param('id') id: string) {
		return this.workspaces.getMeta(id)
	}

	@Get(':id')
	@ApiOperation({ summary: 'Область с ролью текущего пользователя' })
	getOne(@Param('id') id: string, @OptionalUserId() actorId?: string) {
		return this.workspaces.getOne(id, actorId)
	}

	@Post()
	@ApiOperation({ summary: 'Создание рабочей области' })
	create(@Body() body: CreateWorkspaceDto, @CurrentUserId() actorId: string) {
		return this.workspaces.create(body, actorId)
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Изменение области, требует роль ADMIN' })
	update(
		@Param('id') id: string,
		@Body() body: UpdateWorkspaceDto,
		@CurrentUserId() actorId: string,
	) {
		return this.workspaces.update(id, body, actorId)
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Удаление области, требует роль OWNER' })
	remove(@Param('id') id: string, @CurrentUserId() actorId: string) {
		return this.workspaces.remove(id, actorId)
	}
}
