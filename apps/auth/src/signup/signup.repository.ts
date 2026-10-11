import { Injectable } from '@nestjs/common'
import type { Prisma } from '@power-paint/db'

import { PrismaService } from '../prisma.service'

@Injectable()
export class SignupRepository {
	constructor(private readonly prisma: PrismaService) {}

	findPendingByEmail(email: string) {
		return this.prisma.client.signupVerification.findUnique({ where: { email } })
	}

	upsertPending(email: string, data: Prisma.SignupVerificationCreateInput) {
		return this.prisma.client.signupVerification.upsert({
			where: { email },
			create: data,
			update: data,
		})
	}

	// verificationId приходит из куки: регистрацию могли отменить или начать
	// заново в другой вкладке, поэтому null вместо исключения update.
	async incrementAttempts(verificationId: string) {
		const [pending] =
			await this.prisma.client.signupVerification.updateManyAndReturn({
				where: { verificationId },
				data: { attempts: { increment: 1 } },
			})

		return pending ?? null
	}

	async refreshCode(verificationId: string, codeHash: string, expiresAt: Date) {
		const [pending] =
			await this.prisma.client.signupVerification.updateManyAndReturn({
				where: { verificationId },
				data: { codeHash, expiresAt, attempts: 0 },
			})

		return pending ?? null
	}

	deletePending(verificationId: string) {
		return this.prisma.client.signupVerification.deleteMany({
			where: { verificationId },
		})
	}

	findAccountByEmail(email: string) {
		return this.prisma.client.user.findUnique({ where: { email } })
	}

	createAccount(email: string, passwordHash: string) {
		return this.prisma.client.user.create({
			data: { email, password: passwordHash, emailVerified: new Date() },
		})
	}

	deleteAccount(id: string) {
		return this.prisma.client.user.deleteMany({ where: { id } })
	}
}
