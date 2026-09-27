import { Injectable } from '@nestjs/common'
import type { MemberRole, Prisma } from '@power-paint/db'

import { PrismaService } from '../prisma.service'

// Превью хранятся как data-URL и весят много, поэтому в списки не попадают.
const withoutPreviews = {
	darkPreview: true,
	lightPreview: true,
} as const

@Injectable()
export class BoardRepository {
	constructor(private readonly prisma: PrismaService) {}

	findMany(where: Prisma.BoardWhereInput) {
		return this.prisma.client.board.findMany({
			where,
			omit: withoutPreviews,
			include: { members: true },
			orderBy: { updatedAt: 'desc' },
		})
	}

	findById(id: string) {
		return this.prisma.client.board.findUnique({
			where: { id },
			omit: withoutPreviews,
			include: { members: true },
		})
	}

	create(data: Prisma.BoardUncheckedCreateInput) {
		return this.prisma.client.board.create({
			data,
			omit: withoutPreviews,
			include: { members: true },
		})
	}

	update(
		id: string,
		data: Prisma.BoardUncheckedUpdateInput,
		members?: { userId: string; role: MemberRole }[],
	) {
		return this.prisma.client.board.update({
			where: { id },
			omit: withoutPreviews,
			data: members ? { ...data, members: { deleteMany: {}, create: members } } : data,
			include: { members: true },
		})
	}

	remove(id: string) {
		return this.prisma.client.board.delete({
			where: { id },
			omit: withoutPreviews,
			include: { members: true },
		})
	}

	findMeta(id: string) {
		return this.prisma.client.board.findUnique({
			where: { id },
			select: { name: true },
		})
	}

	findPreviews(id: string) {
		return this.prisma.client.board.findUnique({
			where: { id },
			select: { name: true, lightPreview: true, darkPreview: true },
		})
	}

	savePreview(id: string, theme: 'dark' | 'light', dataUrl: string) {
		return this.prisma.client.board.update({
			where: { id },
			data: theme === 'dark' ? { darkPreview: dataUrl } : { lightPreview: dataUrl },
		})
	}
}
