import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'

import { SessionService } from './session.service'
import type { SessionIdentity } from './session.service'

interface IntrospectBody {
	sessionToken?: string
}

// Внутренний эндпоинт: вызывается только шлюзом, наружу через него не публикуется.
// Поэтому он вне /api и скрыт из Swagger.
@ApiExcludeController()
@Controller('internal')
export class IntrospectController {
	constructor(private readonly sessions: SessionService) {}

	@Post('introspect')
	async introspect(@Body() body: IntrospectBody): Promise<SessionIdentity> {
		if (!body.sessionToken) throw new UnauthorizedException()

		const identity = await this.sessions.resolve(body.sessionToken)
		if (!identity) throw new UnauthorizedException()

		return identity
	}
}
