import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma.service'

@Injectable()
export class AccountRepository {
	constructor(private readonly prisma: PrismaService) {}

	findByEmail(email: string) {
		return this.prisma.client.user.findUnique({ where: { email } })
	}

	findById(id: string) {
		return this.prisma.client.user.findUnique({ where: { id } })
	}

	updatePassword(id: string, password: string) {
		return this.prisma.client.user.update({ where: { id }, data: { password } })
	}
}
