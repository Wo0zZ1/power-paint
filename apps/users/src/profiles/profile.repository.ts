import { Injectable } from '@nestjs/common'
import type { Prisma } from '@power-paint/db'

import { PrismaService } from '../prisma.service'

@Injectable()
export class ProfileRepository {
	constructor(private readonly prisma: PrismaService) {}

	findById(userId: string) {
		return this.prisma.client.profile.findUnique({ where: { userId } })
	}

	findManyByIds(userIds: string[]) {
		return this.prisma.client.profile.findMany({
			where: { userId: { in: userIds } },
		})
	}

	search(query: string, take: number) {
		return this.prisma.client.profile.findMany({
			where: {
				OR: [
					{ name: { contains: query, mode: 'insensitive' } },
					{ email: { contains: query, mode: 'insensitive' } },
				],
			},
			orderBy: { name: 'asc' },
			take,
		})
	}

	create(data: Prisma.ProfileCreateInput) {
		return this.prisma.client.profile.create({ data })
	}

	update(userId: string, data: Prisma.ProfileUpdateInput) {
		return this.prisma.client.profile.update({ where: { userId }, data })
	}

	deleteById(userId: string) {
		return this.prisma.client.profile.deleteMany({ where: { userId } })
	}
}
