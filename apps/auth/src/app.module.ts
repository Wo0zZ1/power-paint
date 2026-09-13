import { Module } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { ZodValidationPipe } from 'nestjs-zod'

import { AuthModule } from './auth/auth.module'
import { SessionModule } from './session/session.module'
import { SignupModule } from './signup/signup.module'

@Module({
	imports: [AuthModule, SessionModule, SignupModule],
	providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule {}
