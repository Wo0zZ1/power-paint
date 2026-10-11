import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma.service'
import { WorkspaceRepository } from '../workspaces/workspace.repository'

import { EventsService } from './events.service'
import { UserCreatedListener } from './userCreated.listener'

@Module({
	providers: [
		PrismaService,
		WorkspaceRepository,
		EventsService,
		UserCreatedListener,
	],
	exports: [EventsService],
})
export class EventsModule {}
