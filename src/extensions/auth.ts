import type { onAuthenticatePayload } from '@hocuspocus/server'

/**
 * Проверка сессии пользователя.
 *
 * Фронтенд (Next.js / NextAuth) должен передавать токен сессии
 * в поле `token` при подключении к Hocuspocus.
 *
 * TODO: подключить Prisma и проверять сессию в БД:
 *
 * import { PrismaClient } from '@prisma/client'
 * const prisma = new PrismaClient()
 *
 * async function validateSession(token: string) {
 *   const session = await prisma.session.findUnique({
 *     where: { sessionToken: token },
 *     include: { user: true },
 *   })
 *   if (!session || session.expires < new Date()) {
 *     throw new Error('Unauthorized')
 *   }
 *   return { userId: session.user.id, name: session.user.name }
 * }
 */
export async function onAuthenticate({ token, documentName }: onAuthenticatePayload) {
	// Когда аутентификация не включена — пропускаем всех.
	// Раскомментируй и замени на реальную проверку, когда будет готова Prisma-интеграция.

	// if (!token) throw new Error('Unauthorized: no token')
	// return await validateSession(token)

	return {}
}
