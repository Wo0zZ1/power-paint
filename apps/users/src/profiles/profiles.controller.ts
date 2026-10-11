import {
	BadRequestException,
	Body,
	Controller,
	DefaultValuePipe,
	Get,
	Headers,
	Param,
	ParseIntPipe,
	Patch,
	Query,
	UnauthorizedException,
} from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { MAX_USERS_BATCH_SIZE } from '@power-paint/contracts'

import { CurrentUserId } from '../currentUserId.decorator'

import { UpdateProfileDto } from './profile.dto'
import { ProfilesService } from './profiles.service'

@ApiTags('users')
@Controller('api/users')
export class ProfilesController {
	constructor(private readonly profiles: ProfilesService) {}

	@Get()
	@ApiOperation({
		summary: 'Профили пачкой по списку id либо поиск по имени или точному email',
	})
	@ApiQuery({ name: 'ids', required: false })
	@ApiQuery({ name: 'query', required: false })
	list(
		@Query('ids') ids?: string,
		@Query('query') query?: string,
		@Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
		@Headers('x-user-id') actorId?: string,
	) {
		if (ids) {
			const userIds = ids.split(',').filter(Boolean)

			if (userIds.length > MAX_USERS_BATCH_SIZE)
				throw new BadRequestException(
					`At most ${MAX_USERS_BATCH_SIZE} ids per request`,
				)

			return this.profiles.getMany(userIds)
		}

		if (!query) throw new BadRequestException('Either ids or query is required')

		// Поиск - только для вошедших: в выдаче есть email. Пачка по ids открыта,
		// потому что её зовёт boards без личности, а id не перебрать.
		if (!actorId) throw new UnauthorizedException()

		if (limit < 1) throw new BadRequestException('limit must be positive')

		return this.profiles.search(query, Math.min(limit, MAX_USERS_BATCH_SIZE))
	}

	// Объявлен раньше :id, иначе «me» примут за id пользователя.
	@Get('me')
	@ApiOperation({ summary: 'Собственный профиль с закрытыми полями' })
	getOwn(@CurrentUserId() actorId: string) {
		return this.profiles.getOwn(actorId)
	}

	@Get(':id')
	@ApiOperation({ summary: 'Профиль пользователя' })
	getOne(@Param('id') id: string) {
		return this.profiles.getOne(id)
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Изменение собственного профиля' })
	update(
		@Param('id') id: string,
		@CurrentUserId() actorId: string,
		@Body() body: UpdateProfileDto,
	) {
		return this.profiles.update(id, actorId, body)
	}
}
