import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma.service'

@Injectable()
export class OauthRepository {
	constructor(private readonly prisma: PrismaService) {}

	findAccount(provider: string, providerAccountId: string) {
		return this.prisma.client.account.findUnique({
			where: { provider_providerAccountId: { provider, providerAccountId } },
		})
	}

	findUserByEmail(email: string) {
		return this.prisma.client.user.findUnique({ where: { email } })
	}

	createUser(email: string) {
		return this.prisma.client.user.create({
			data: { email, emailVerified: new Date() },
		})
	}

	deleteUser(id: string) {
		return this.prisma.client.user.deleteMany({ where: { id } })
	}

	linkAccount(userId: string, provider: string, providerAccountId: string) {
		return this.prisma.client.account.create({
			data: { userId, provider, providerAccountId, type: 'oauth' },
		})
	}
}
