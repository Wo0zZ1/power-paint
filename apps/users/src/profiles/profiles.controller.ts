import {
	BadRequestException,
	Body,
	Controller,
	DefaultValuePipe,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Query,
} from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'

import { CurrentUserId } from '../currentUserId.decorator'

import { UpdateProfileDto } from './profile.dto'
import { ProfilesService } from './profiles.service'

const MAX_BATCH_SIZE = 100

@ApiTags('users')
@Controller('api/users')
export class ProfilesController {
	constructor(private readonly profiles: ProfilesService) {}

	@Get()
	@ApiOperation({
		summary: 'Профили пачкой по списку id либо поиск по имени и email',
	})
	@ApiQuery({ name: 'ids', required: false })
	@ApiQuery({ name: 'query', required: false })
	list(
		@Query('ids') ids?: string,
		@Query('query') query?: string,
		@Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
	) {
		if (ids) {
			const userIds = ids.split(',').filter(Boolean)

			if (userIds.length > MAX_BATCH_SIZE)
				throw new BadRequestException(`At most ${MAX_BATCH_SIZE} ids per request`)

			return this.profiles.getMany(userIds)
		}

		if (query) return this.profiles.search(query, Math.min(limit, MAX_BATCH_SIZE))

		throw new BadRequestException('Either ids or query is required')
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
