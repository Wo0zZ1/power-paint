import { randomUUID } from 'node:crypto'

import { AccessRole } from '@power-paint/contracts'
import { AccessLevel, MemberRole } from '@power-paint/db'

import { PrismaService } from '../prisma.service'

import { AccessService } from './access.service'

// Фильтр списков и расчёт роли - два описания одних правил. Расходятся они
// молча: в списке появляется недоступная область или пропадает своя. Сверяем
// их на живой базе по всем сочетаниям уровня доступа и связи с пользователем.
const describeIntegration =
	process.env.RUN_INTEGRATION_TESTS === 'true' ? describe : describe.skip

describeIntegration('AccessService: фильтры списков (нужна живая база)', () => {
	const prisma = new PrismaService()
	const access = new AccessService(prisma)

	const owner = randomUUID()
	const admin = randomUUID()
	const viewer = randomUUID()
	const boardMember = randomUUID()
	const stranger = randomUUID()
	const actors = [owner, admin, viewer, boardMember, stranger, undefined]

	const levels = Object.values(AccessLevel)
	const workspaceIds: string[] = []
	const boardIds: string[] = []

	beforeAll(async () => {
		for (const workspaceLevel of levels) {
			const workspace = await prisma.client.workspace.create({
				data: {
					name: `qa-${workspaceLevel}`,
					ownerId: owner,
					accessLevel: workspaceLevel,
					members: {
						create: [
							{ userId: admin, role: MemberRole.admin },
							{ userId: viewer, role: MemberRole.viewer },
						],
					},
				},
			})
			workspaceIds.push(workspace.id)

			for (const boardLevel of levels) {
				const board = await prisma.client.board.create({
					data: {
						name: `qa-${boardLevel}`,
						workspaceId: workspace.id,
						ownerId: admin,
						accessLevel: boardLevel,
						members: { create: { userId: boardMember, role: MemberRole.viewer } },
					},
				})
				boardIds.push(board.id)
			}
		}
	})

	afterAll(async () => {
		await prisma.client.workspace.deleteMany({ where: { id: { in: workspaceIds } } })
		await prisma.client.$disconnect()
	})

	const idsWithRole = async <T extends { id: string }>(
		rows: T[],
		toRole: (row: T) => Promise<AccessRole>,
		minimum: number,
	) => {
		const roles = await Promise.all(rows.map(toRole))

		return rows.filter((_, index) => AccessRole[roles[index]] >= minimum).map(row => row.id).sort()
	}

	test.each(actors.map(actor => [actor ?? 'аноним', actor]))(
		'Видимые области совпадают с ролью VIEWER и выше: %s',
		async (_, actor) => {
			const rows = await prisma.client.workspace.findMany({ where: { id: { in: workspaceIds } } })

			const filtered = await prisma.client.workspace.findMany({
				where: { AND: [{ id: { in: workspaceIds } }, access.visibleWorkspaces(actor)] },
			})

			expect(filtered.map(row => row.id).sort()).toEqual(
				await idsWithRole(rows, row => access.toWorkspace(row, actor), AccessRole.VIEWER),
			)
		},
	)

	test.each(actors.map(actor => [actor ?? 'аноним', actor]))(
		'Управляемые области совпадают с ролью ADMIN и выше: %s',
		async (_, actor) => {
			const rows = await prisma.client.workspace.findMany({ where: { id: { in: workspaceIds } } })

			const filtered = await prisma.client.workspace.findMany({
				where: { AND: [{ id: { in: workspaceIds } }, access.manageableWorkspaces(actor)] },
			})

			expect(filtered.map(row => row.id).sort()).toEqual(
				await idsWithRole(rows, row => access.toWorkspace(row, actor), AccessRole.ADMIN),
			)
		},
	)

	test.each(actors.map(actor => [actor ?? 'аноним', actor]))(
		'Видимые доски совпадают с ролью VIEWER и выше: %s',
		async (_, actor) => {
			const rows = await prisma.client.board.findMany({ where: { id: { in: boardIds } } })

			const filtered = await prisma.client.board.findMany({
				where: { AND: [{ id: { in: boardIds } }, access.visibleBoards(actor)] },
			})

			expect(filtered.map(row => row.id).sort()).toEqual(
				await idsWithRole(rows, row => access.toBoard(row, actor), AccessRole.VIEWER),
			)
		},
	)
})
