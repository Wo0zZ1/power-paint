import { Injectable } from '@nestjs/common'
import { AccessLevel, WorkspaceType } from '@power-paint/db'
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

	async hasPersonal(ownerId: string) {
		const personal = await this.prisma.client.workspace.findFirst({
			where: { ownerId, type: WorkspaceType.personal },
			select: { id: true },
		})

		return Boolean(personal)
	}

	// Личную область заводят и обработчик события, и восстановление при чтении,
	// иногда одновременно. Вторую не даёт создать уникальный индекс, а
	// skipDuplicates превращает повтор в пустую вставку вместо ошибки.
	createPersonal({ ownerId, name }: { ownerId: string; name: string }) {
		return this.prisma.client.workspace.createMany({
			data: {
				ownerId,
				name: `${name}'s Workspace`,
				type: WorkspaceType.personal,
				accessLevel: AccessLevel.private,
			},
			skipDuplicates: true,
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
