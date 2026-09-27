import { Injectable } from '@nestjs/common'
import type { MemberRole, Prisma } from '@power-paint/db'

import { PrismaService } from '../prisma.service'

const withBoardsAndMembers = {
	boards: {
		omit: { darkPreview: true, lightPreview: true },
		include: { members: true },
	},
	members: true,
} as const

@Injectable()
export class WorkspaceRepository {
	constructor(private readonly prisma: PrismaService) {}

	findMany(where: Prisma.WorkspaceWhereInput) {
		return this.prisma.client.workspace.findMany({
			where,
			include: withBoardsAndMembers,
			orderBy: { updatedAt: 'desc' },
		})
	}

	findMeta(id: string) {
		return this.prisma.client.workspace.findUnique({
			where: { id },
			select: { name: true },
		})
	}

	findById(id: string) {
		return this.prisma.client.workspace.findUnique({
			where: { id },
			include: withBoardsAndMembers,
		})
	}

	findPlainById(id: string) {
		return this.prisma.client.workspace.findUnique({ where: { id } })
	}

	create(data: Prisma.WorkspaceUncheckedCreateInput) {
		return this.prisma.client.workspace.create({
			data,
			include: withBoardsAndMembers,
		})
	}

	update(
		id: string,
		data: Prisma.WorkspaceUncheckedUpdateInput,
		members?: { userId: string; role: MemberRole }[],
	) {
		return this.prisma.client.workspace.update({
			where: { id },
			data: members
				? { ...data, members: { deleteMany: {}, create: members } }
				: data,
			include: withBoardsAndMembers,
		})
	}

	remove(id: string) {
		return this.prisma.client.workspace.delete({
			where: { id },
			include: withBoardsAndMembers,
		})
	}
}
