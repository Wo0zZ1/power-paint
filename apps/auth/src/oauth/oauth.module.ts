import { Module } from '@nestjs/common'

import { UsersClient } from '../clients/users.client'
import { EventsService } from '../events.service'
import { PrismaService } from '../prisma.service'
import { SessionModule } from '../session/session.module'

import { OauthController } from './oauth.controller'
import { OauthRepository } from './oauth.repository'
import { OauthService } from './oauth.service'

@Module({
	imports: [SessionModule],
	controllers: [OauthController],
	providers: [PrismaService, OauthRepository, OauthService,
		EventsService, UsersClient],
})
export class OauthModule {}
