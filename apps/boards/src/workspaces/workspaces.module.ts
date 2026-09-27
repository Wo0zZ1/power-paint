import { Module } from '@nestjs/common'

import { AccessService } from '../access/access.service'
import { EventsModule } from '../events/events.module'
import { UsersClient } from '../clients/users.client'
import { MembersService } from '../members.service'
import { PrismaService } from '../prisma.service'

import { WorkspaceRepository } from './workspace.repository'
import { WorkspacesController } from './workspaces.controller'
import { WorkspacesService } from './workspaces.service'

@Module({
	imports: [EventsModule],
	controllers: [WorkspacesController],
	providers: [
		PrismaService,
		AccessService,
		UsersClient,
		MembersService,
		WorkspaceRepository,
		WorkspacesService,
	],
})
export class WorkspacesModule {}
