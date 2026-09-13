import {
	createParamDecorator,
	ExecutionContext,
	UnauthorizedException,
} from '@nestjs/common'
import type { Request } from 'express'

// Личность пользователя приходит от шлюза, который уже проверил сессию.
// Сервис куки не разбирает - это делает только эндпоинт интроспекции.
export const CurrentUserId = createParamDecorator(
	(_: unknown, context: ExecutionContext): string => {
		const request = context.switchToHttp().getRequest<Request>()
		const userId = request.header('x-user-id')

		if (!userId) throw new UnauthorizedException()

		return userId
	},
)
