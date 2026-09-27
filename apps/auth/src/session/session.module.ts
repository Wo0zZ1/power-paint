import { Module } from '@nestjs/common'

import { EventsService } from '../events.service'
import { PrismaService } from '../prisma.service'

import { IntrospectController } from './introspect.controller'
import { SessionService } from './session.service'

@Module({
	controllers: [IntrospectController],
	providers: [PrismaService, SessionService, EventsService],
	exports: [SessionService],
})
export class SessionModule {}
