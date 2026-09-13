import { Module } from '@nestjs/common'
import { ZodValidationPipe } from 'nestjs-zod'
import { APP_PIPE } from '@nestjs/core'

import { AuthModule } from './auth/auth.module'
import { SessionModule } from './session/session.module'

@Module({
	imports: [AuthModule, SessionModule],
	providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule {}
