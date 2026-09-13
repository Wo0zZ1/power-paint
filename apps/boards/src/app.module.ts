import { Module } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { ZodValidationPipe } from 'nestjs-zod'

import { BoardsModule } from './boards/boards.module'
import { WorkspacesModule } from './workspaces/workspaces.module'

@Module({
	imports: [BoardsModule, WorkspacesModule],
	providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule {}
