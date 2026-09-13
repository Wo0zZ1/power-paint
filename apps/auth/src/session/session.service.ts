import { randomUUID } from 'node:crypto'

import { Injectable } from '@nestjs/common'

import { CONFIG } from '../config'
import { PrismaService } from '../prisma.service'

export interface SessionIdentity {
	userId: string
	email: string
	role: string
}

@Injectable()
export class SessionService {
	constructor(private readonly prisma: PrismaService) {}

	async create(userId: string) {
		const sessionToken = randomUUID()
		const expires = new Date(Date.now() + CONFIG.SESSION_MAX_AGE_SEC * 1000)

		await this.prisma.client.session.create({
			data: { sessionToken, userId, expires },
		})

		return { sessionToken, expires }
	}

	// Возвращает null вместо исключения: вызывающий решает, 401 это или анонимный доступ.
	async resolve(sessionToken: string): Promise<SessionIdentity | null> {
		const session = await this.prisma.client.session.findUnique({
			where: { sessionToken },
			include: { user: true },
		})

		if (!session) return null

		if (session.expires <= new Date()) {
			await this.revoke(sessionToken)
			return null
		}

		return {
			userId: session.user.id,
			email: session.user.email,
			role: session.user.role,
		}
	}

	async revoke(sessionToken: string) {
		await this.prisma.client.session.deleteMany({ where: { sessionToken } })
	}
}
