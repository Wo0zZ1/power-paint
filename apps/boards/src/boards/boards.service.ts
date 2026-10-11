import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { AccessRole } from '@power-paint/contracts'
import type { BoardsQuery, BoardWithAccess } from '@power-paint/contracts'

import { AccessService } from '../access/access.service'
import { EventsService } from '../events/events.service'
import { MembersService } from '../members.service'
import { PrismaService } from '../prisma.service'

import { BoardRepository } from './board.repository'
import type { CreateBoardDto, UpdateBoardDto } from './board.dto'

@Injectable()
export class BoardsService {
	constructor(
		private readonly boards: BoardRepository,
		private readonly access: AccessService,
		private readonly members: MembersService,
		private readonly prisma: PrismaService,
		private readonly events: EventsService,
	) {}

	async getAll(query: BoardsQuery, userId?: string) {
		const boards = await this.boards.findMany({
			where: {
				AND: [
					{ ownerId: query.userId, workspaceId: query.workspaceId },
					this.access.visibleBoards(userId),
				],
			},
			take: query.limit,
		})

		const enriched = await this.members.enrich(boards.map(b => b.members))

		return Promise.all(
			boards.map(async (board, index) => ({
				board: { ...board, members: enriched[index] },
				accessRole: await this.access.toBoard(board, userId),
			})),
		)
	}

	async getMeta(id: string) {
		const board = await this.boards.findMeta(id)
		if (!board) throw new NotFoundException('Board not found')

		return board
	}

	async getOne(id: string, userId?: string): Promise<BoardWithAccess> {
		const board = await this.boards.findById(id)
		if (!board) throw new NotFoundException('Board not found')

		const accessRole = await this.access.toBoard(board, userId)

		if (AccessRole[accessRole] < AccessRole.VIEWER) throw new ForbiddenException()

		const [members] = await this.members.enrich([board.members])

		return { board: { ...board, members }, accessRole }
	}

	async create(data: CreateBoardDto, userId: string): Promise<BoardWithAccess> {
		const workspace = await this.prisma.client.workspace.findUnique({
			where: { id: data.workspaceId },
		})

		if (!workspace) throw new NotFoundException('Workspace not found')

		const workspaceRole = await this.access.toWorkspace(workspace, userId)

		if (AccessRole[workspaceRole] < AccessRole.ADMIN)
			throw new ForbiddenException()

		const board = await this.boards.create({
			name: data.name,
			workspaceId: data.workspaceId,
			accessLevel: data.accessLevel,
			ownerId: userId,
		})

		return { board: { ...board, members: [] }, accessRole: 'OWNER' }
	}

	async update(
		id: string,
		data: UpdateBoardDto,
		userId: string,
	): Promise<BoardWithAccess> {
		const accessRole = await this.requireRole(id, userId, AccessRole.ADMIN)

		// Передать доску может только владелец: иначе администратор назначил бы
		// владельцем себя и получил право удаления.
		if (data.ownerId && AccessRole[accessRole] < AccessRole.OWNER)
			throw new ForbiddenException()

		await this.members.assertExist([
			...(data.members ?? []).map(member => member.userId),
			...(data.ownerId ? [data.ownerId] : []),
		])

		const updated = await this.boards.update(
			id,
			{ name: data.name, accessLevel: data.accessLevel, ownerId: data.ownerId },
			data.members,
		)

		const [members] = await this.members.enrich([updated.members])

		// Права могли измениться - подключённые к холсту должны узнать об этом,
		// иначе исключённый участник продолжит рисовать до разрыва соединения.
		if (data.members || data.accessLevel || data.ownerId)
			this.events.boardAccessChanged({ boardId: id })

		return { board: { ...updated, members }, accessRole }
	}

	async remove(id: string, userId: string): Promise<BoardWithAccess> {
		const accessRole = await this.requireRole(id, userId, AccessRole.OWNER)

		const removed = await this.boards.remove(id)

		const [members] = await this.members.enrich([removed.members])

		this.events.boardDeleted({ boardId: id })

		return { board: { ...removed, members }, accessRole }
	}

	private async requireRole(id: string, userId: string, minimum: number) {
		const board = await this.boards.findById(id)
		if (!board) throw new NotFoundException('Board not found')

		const accessRole = await this.access.toBoard(board, userId)

		if (AccessRole[accessRole] < minimum) throw new ForbiddenException()

		return accessRole
	}
}
