import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma.service'

import { InternalProfilesController } from './internal.controller'
import { ProfileRepository } from './profile.repository'
import { ProfilesController } from './profiles.controller'
import { ProfilesService } from './profiles.service'

@Module({
	controllers: [ProfilesController, InternalProfilesController],
	providers: [PrismaService, ProfileRepository, ProfilesService],
})
export class ProfilesModule {}
