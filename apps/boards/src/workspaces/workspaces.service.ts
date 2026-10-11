import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { AccessRole } from '@power-paint/contracts'
import type { WorkspaceWithAccess } from '@power-paint/contracts'
import { WorkspaceType } from '@power-paint/db'
import type { Workspace as PrismaWorkspace, WorkspaceType as WorkspaceTypeValue } from '@power-paint/db'

import { AccessService } from '../access/access.service'
import { UsersClient } from '../clients/users.client'
import { EventsService } from '../events/events.service'
import { MembersService } from '../members.service'

import { WorkspaceRepository } from './workspace.repository'
import type { CreateWorkspaceDto, UpdateWorkspaceDto } from './workspace.dto'

type WorkspaceRow = PrismaWorkspace & {
	members: { userId: string }[]
	boards: (Record<string, unknown> & { members: { userId: string }[] })[]
}

@Injectable()
export class WorkspacesService {
	constructor(
		private readonly workspaces: WorkspaceRepository,
		private readonly access: AccessService,
		private readonly members: MembersService,
		private readonly events: EventsService,
		private readonly users: UsersClient,
	) {}

	async getAll(
		filters: { ownerId?: string; type?: WorkspaceTypeValue },
		userId?: string,
	) {
		if (userId) await this.ensurePersonal(userId)

		const workspaces = await this.workspaces.findMany({
			ownerId: filters.ownerId,
			type: filters.type,
		})

		const enriched = await Promise.all(
			workspaces.map(workspace => this.enrich(workspace as WorkspaceRow)),
		)

		const withAccess = await Promise.all(
			enriched.map(async (workspace, index) => ({
				workspace,
				accessRole: await this.access.toWorkspace(workspaces[index], userId),
			})),
		)

		return withAccess.filter(
			({ accessRole }) => AccessRole[accessRole] >= AccessRole.VIEWER,
		)
	}

	async getMeta(id: string) {
		const workspace = await this.workspaces.findMeta(id)
		if (!workspace) throw new NotFoundException('Workspace not found')

		return workspace
	}

	async getOne(id: string, userId?: string): Promise<WorkspaceWithAccess> {
		const workspace = await this.workspaces.findById(id)
		if (!workspace) throw new NotFoundException('Workspace not found')

		const accessRole = await this.access.toWorkspace(workspace, userId)

		if (AccessRole[accessRole] < AccessRole.VIEWER) throw new ForbiddenException()

		return {
			workspace: await this.enrich(workspace as WorkspaceRow),
			accessRole,
		}
	}

	async create(
		data: CreateWorkspaceDto,
		userId: string,
	): Promise<WorkspaceWithAccess> {
		const workspace = await this.workspaces.create({
			name: data.name,
			accessLevel: data.accessLevel,
			ownerId: userId,
		})

		return {
			workspace: await this.enrich(workspace as WorkspaceRow),
			accessRole: 'OWNER',
		}
	}

	async update(
		id: string,
		data: UpdateWorkspaceDto,
		userId: string,
	): Promise<WorkspaceWithAccess> {
		const accessRole = await this.requireRole(id, userId, AccessRole.ADMIN)

		// Передать область может только владелец: иначе администратор назначил бы
		// владельцем себя и получил право удаления.
		if (data.ownerId && AccessRole[accessRole] < AccessRole.OWNER)
			throw new ForbiddenException()

		await this.members.assertExist([
			...(data.members ?? []).map(member => member.userId),
			...(data.ownerId ? [data.ownerId] : []),
		])

		const updated = await this.workspaces.update(
			id,
			{ name: data.name, accessLevel: data.accessLevel, ownerId: data.ownerId },
			data.members,
		)

		// Доски наследуют права области, поэтому её участники, уровень доступа и
		// владелец - это права каждой её доски, и подключённые к холстам должны узнать.
		if (data.members || data.accessLevel || data.ownerId)
			for (const { id: boardId } of updated.boards)
				this.events.boardAccessChanged({ boardId })

		return {
			workspace: await this.enrich(updated as WorkspaceRow),
			accessRole,
		}
	}

	async remove(id: string, userId: string): Promise<WorkspaceWithAccess> {
		const accessRole = await this.requireRole(id, userId, AccessRole.OWNER)

		const removed = await this.workspaces.remove(id)

		// Доски удаляются каскадом в БД, минуя BoardsService, и событие за них
		// не отправит никто, кроме области.
		for (const { id: boardId } of removed.boards)
			this.events.boardDeleted({ boardId })

		return {
			workspace: await this.enrich(removed as WorkspaceRow),
			accessRole,
		}
	}

	// Личная область создаётся вместе с пользователем и удалению или переименованию
	// не подлежит - иначе он останется без места для досок.
	private async requireRole(id: string, userId: string, minimum: number) {
		const workspace = await this.workspaces.findPlainById(id)
		if (!workspace) throw new NotFoundException('Workspace not found')

		if (workspace.type === WorkspaceType.personal) throw new ForbiddenException()

		const accessRole = await this.access.toWorkspace(workspace, userId)

		if (AccessRole[accessRole] < minimum) throw new ForbiddenException()

		return accessRole
	}

	// Событие о новом пользователе auth шлёт без гарантии доставки и может его
	// потерять. Тогда личная область досоздаётся здесь, при первом же списке.
	private async ensurePersonal(userId: string) {
		if (await this.workspaces.hasPersonal(userId)) return

		const profile = (await this.users.getMany([userId])).get(userId)
		if (!profile) return

		await this.workspaces.createPersonal({ ownerId: userId, name: profile.name })
	}

	// Участники области и участники всех её досок обогащаются одним запросом.
	private async enrich(workspace: WorkspaceRow) {
		const groups = [workspace.members, ...workspace.boards.map(b => b.members)]

		const [members, ...boardMembers] = await this.members.enrich(groups)

		return {
			...workspace,
			members,
			boards: workspace.boards.map((board, index) => ({
				...board,
				members: boardMembers[index],
			})),
		} as WorkspaceWithAccess['workspace']
	}
}
