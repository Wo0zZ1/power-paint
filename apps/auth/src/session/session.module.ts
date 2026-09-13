import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma.service'

import { IntrospectController } from './introspect.controller'
import { SessionService } from './session.service'

@Module({
	controllers: [IntrospectController],
	providers: [PrismaService, SessionService],
	exports: [SessionService],
})
export class SessionModule {}
