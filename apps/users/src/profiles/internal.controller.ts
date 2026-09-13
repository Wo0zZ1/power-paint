import { Body, Controller, Delete, Param, Post } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'

import { CreateProfileDto } from './profile.dto'
import { ProfilesService } from './profiles.service'
import { ProfileRepository } from './profile.repository'

// Внутренние операции, доступные только другим сервисам: профиль заводит auth
// в момент регистрации, он же просит удалить его при удалении учётной записи.
// Наружу через шлюз эти пути не публикуются.
@ApiExcludeController()
@Controller('internal/profiles')
export class InternalProfilesController {
	constructor(
		private readonly profiles: ProfilesService,
		private readonly repository: ProfileRepository,
	) {}

	@Post()
	create(@Body() body: CreateProfileDto) {
		return this.profiles.create(body)
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		await this.repository.deleteById(id)

		return { ok: true }
	}
}
