import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma.service'

@Injectable()
export class ResetRepository {
	constructor(private readonly prisma: PrismaService) {}

	findAccountByEmail(email: string) {
		return this.prisma.client.user.findUnique({ where: { email } })
	}

	findById(id: string) {
		return this.prisma.client.passwordReset.findUnique({ where: { id } })
	}

	upsert(id: string, userId: string, codeHash: string, expiresAt: Date) {
		return this.prisma.client.passwordReset.upsert({
			where: { userId },
			create: { id, userId, codeHash, expiresAt },
			update: { codeHash, expiresAt, attempts: 0 },
		})
	}

	incrementAttempts(id: string) {
		return this.prisma.client.passwordReset.update({
			where: { id },
			data: { attempts: { increment: 1 } },
		})
	}

	replaceCode(id: string, codeHash: string, expiresAt: Date) {
		return this.prisma.client.passwordReset.update({
			where: { id },
			data: { codeHash, expiresAt, attempts: 0 },
		})
	}

	deleteById(id: string) {
		return this.prisma.client.passwordReset.deleteMany({ where: { id } })
	}

	// Смена пароля и отзыв всех сессий - одна транзакция: обе таблицы в схеме auth,
	// так что сервис вправе их связать. Возвращает отозванные токены: шлюз
	// кэширует личность по токену и должен их забыть.
	applyNewPassword(id: string, userId: string, passwordHash: string) {
		return this.prisma.client.$transaction(async tx => {
			await tx.user.update({
				where: { id: userId },
				data: { password: passwordHash },
			})

			const sessions = await tx.session.findMany({
				where: { userId },
				select: { sessionToken: true },
			})

			await tx.session.deleteMany({ where: { userId } })
			await tx.passwordReset.deleteMany({ where: { id } })

			return sessions.map(({ sessionToken }) => sessionToken)
		})
	}
}
