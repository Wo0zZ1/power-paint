import { Module } from '@nestjs/common'

import { UsersClient } from '../clients/users.client'
import { MailerService } from '../email/mailer.service'
import { PrismaService } from '../prisma.service'
import { SessionModule } from '../session/session.module'

import { SignupController } from './signup.controller'
import { SignupRepository } from './signup.repository'
import { SignupService } from './signup.service'

@Module({
	imports: [SessionModule],
	controllers: [SignupController],
	providers: [
		PrismaService,
		SignupRepository,
		SignupService,
		MailerService,
		UsersClient,
	],
})
export class SignupModule {}
