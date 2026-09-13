import { Module } from '@nestjs/common'

import { AccessService } from '../access/access.service'
import { UsersClient } from '../clients/users.client'
import { MembersService } from '../members.service'
import { PrismaService } from '../prisma.service'

import { BoardRepository } from './board.repository'
import { BoardsController } from './boards.controller'
import { BoardsService } from './boards.service'
import { PreviewController } from './preview.controller'
import { PreviewService } from './preview.service'

@Module({
	controllers: [BoardsController, PreviewController],
	providers: [
		PrismaService,
		AccessService,
		UsersClient,
		MembersService,
		BoardRepository,
		BoardsService,
		PreviewService,
	],
})
export class BoardsModule {}
