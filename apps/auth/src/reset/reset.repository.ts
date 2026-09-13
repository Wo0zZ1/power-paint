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
	// так что сервис вправе их связать.
	applyNewPassword(id: string, userId: string, passwordHash: string) {
		return this.prisma.client.$transaction([
			this.prisma.client.user.update({
				where: { id: userId },
				data: { password: passwordHash },
			}),
			this.prisma.client.session.deleteMany({ where: { userId } }),
			this.prisma.client.passwordReset.deleteMany({ where: { id } }),
		])
	}
}
