import { Module } from '@nestjs/common'

import { UsersClient } from '../clients/users.client'
import { MailerService } from '../email/mailer.service'
import { PrismaService } from '../prisma.service'

import { ResetController } from './reset.controller'
import { ResetRepository } from './reset.repository'
import { ResetService } from './reset.service'

@Module({
	controllers: [ResetController],
	providers: [
		PrismaService,
		ResetRepository,
		ResetService,
		MailerService,
		UsersClient,
	],
})
export class ResetModule {}
