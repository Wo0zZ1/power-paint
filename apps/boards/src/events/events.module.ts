import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma.service'

import { EventsService } from './events.service'
import { UserCreatedListener } from './userCreated.listener'

@Module({
	providers: [PrismaService, EventsService, UserCreatedListener],
	exports: [EventsService],
})
export class EventsModule {}
