import { Injectable } from '@nestjs/common'
import { AccessRole } from '@power-paint/contracts'
import { AccessLevel, MemberRole } from '@power-paint/db'
import type { Board, Prisma, Workspace } from '@power-paint/db'

import { PrismaService } from '../prisma.service'

const roleByMembership: Record<MemberRole, AccessRole> = {
	[MemberRole.admin]: 'ADMIN',
	[MemberRole.editor]: 'EDITOR',
	[MemberRole.viewer]: 'VIEWER',
}

const roleByAccessLevel: Record<AccessLevel, AccessRole> = {
	[AccessLevel.public_edit]: 'EDITOR',
	[AccessLevel.public_view]: 'VIEWER',
	[AccessLevel.private]: 'NONE',
}

const strongest = (...roles: AccessRole[]): AccessRole =>
	roles.reduce((best, role) =>
		AccessRole[role] > AccessRole[best] ? role : best,
	)

type BoardIdentity = Pick<
	Board,
	'id' | 'workspaceId' | 'ownerId' | 'accessLevel'
>

@Injectable()
export class AccessService {
	constructor(private readonly prisma: PrismaService) {}

	async toWorkspace(
		workspace: Workspace,
		userId?: string,
	): Promise<AccessRole> {
		if (userId && userId === workspace.ownerId) return 'OWNER'

		const membership = userId
			? await this.prisma.client.workspaceMember.findUnique({
					where: {
						workspaceId_userId: { workspaceId: workspace.id, userId },
					},
				})
			: null

		if (membership) return roleByMembership[membership.role]

		return roleByAccessLevel[workspace.accessLevel]
	}

	// Права доски наследуются от рабочей области: владелец области - владелец доски,
	// участник области получает свою роль и на доске, публичность области открывает
	// доску. Именно этот инвариант держит boards и workspaces в одном сервисе.
	async toBoard(board: BoardIdentity, userId?: string): Promise<AccessRole> {
		if (userId && userId === board.ownerId) return 'OWNER'

		const workspace = await this.prisma.client.workspace.findUnique({
			where: { id: board.workspaceId },
		})

		if (!workspace) return 'NONE'

		if (userId && userId === workspace.ownerId) return 'OWNER'

		const [boardMember, workspaceMember] = userId
			? await Promise.all([
					this.prisma.client.boardMember.findUnique({
						where: { boardId_userId: { boardId: board.id, userId } },
					}),
					this.prisma.client.workspaceMember.findUnique({
						where: {
							workspaceId_userId: { workspaceId: workspace.id, userId },
						},
					}),
				])
			: [null, null]

		if (boardMember || workspaceMember)
			return strongest(
				boardMember ? roleByMembership[boardMember.role] : 'NONE',
				workspaceMember ? roleByMembership[workspaceMember.role] : 'NONE',
			)

		return strongest(
			roleByAccessLevel[board.accessLevel],
			roleByAccessLevel[workspace.accessLevel],
		)
	}

	// Те же правила, что в toWorkspace и toBoard, но условием для базы: список
	// режется страницами, и фильтр после выборки делал бы страницы неполными.
	visibleWorkspaces(userId?: string): Prisma.WorkspaceWhereInput {
		const isPublic = { accessLevel: { not: AccessLevel.private } }

		if (!userId) return isPublic

		return {
			OR: [{ ownerId: userId }, { members: { some: { userId } } }, isPublic],
		}
	}

	manageableWorkspaces(userId?: string): Prisma.WorkspaceWhereInput {
		if (!userId) return { id: { in: [] } }

		return {
			OR: [
				{ ownerId: userId },
				{ members: { some: { userId, role: MemberRole.admin } } },
			],
		}
	}

	visibleBoards(userId?: string): Prisma.BoardWhereInput {
		const isPublic = [
			{ accessLevel: { not: AccessLevel.private } },
			{ workspace: { accessLevel: { not: AccessLevel.private } } },
		]

		if (!userId) return { OR: isPublic }

		return {
			OR: [
				{ ownerId: userId },
				{ workspace: { ownerId: userId } },
				{ members: { some: { userId } } },
				{ workspace: { members: { some: { userId } } } },
				...isPublic,
			],
		}
	}
}
