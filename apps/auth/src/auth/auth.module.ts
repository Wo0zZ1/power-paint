import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma.service'
import { SessionModule } from '../session/session.module'

import { AccountRepository } from './account.repository'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
	imports: [SessionModule],
	controllers: [AuthController],
	providers: [PrismaService, AccountRepository, AuthService],
})
export class AuthModule {}
