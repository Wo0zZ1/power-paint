import { Module } from '@nestjs/common'

import { UsersClient } from '../clients/users.client'
import { PrismaService } from '../prisma.service'
import { SessionModule } from '../session/session.module'

import { OauthController } from './oauth.controller'
import { OauthRepository } from './oauth.repository'
import { OauthService } from './oauth.service'

@Module({
	imports: [SessionModule],
	controllers: [OauthController],
	providers: [PrismaService, OauthRepository, OauthService, UsersClient],
})
export class OauthModule {}
