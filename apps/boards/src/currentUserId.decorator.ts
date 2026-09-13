import {
	createParamDecorator,
	ExecutionContext,
	UnauthorizedException,
} from '@nestjs/common'
import type { Request } from 'express'

const readUserId = (context: ExecutionContext) =>
	context.switchToHttp().getRequest<Request>().header('x-user-id')

// Личность приходит от шлюза, который уже проверил сессию.
export const CurrentUserId = createParamDecorator(
	(_: unknown, context: ExecutionContext): string => {
		const userId = readUserId(context)

		if (!userId) throw new UnauthorizedException()

		return userId
	},
)

// Публичные доски и области открываются без входа, поэтому для чтения
// отсутствие пользователя - нормальная ситуация, а не ошибка.
export const OptionalUserId = createParamDecorator(
	(_: unknown, context: ExecutionContext): string | undefined =>
		readUserId(context),
)
