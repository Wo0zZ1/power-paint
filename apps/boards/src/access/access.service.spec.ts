import { AccessLevel, MemberRole, WorkspaceType } from '@power-paint/db'

import { AccessService } from './access.service'

const OWNER_ID = 'owner-1'
const MEMBER_ID = 'member-1'
const STRANGER_ID = 'stranger-1'

const workspace = (overrides: Partial<{ ownerId: string; accessLevel: AccessLevel }> = {}) => ({
	id: 'workspace-1',
	name: 'Область',
	ownerId: OWNER_ID,
	type: WorkspaceType.team,
	accessLevel: AccessLevel.private,
	preview: null,
	updatedAt: new Date(),
	createdAt: new Date(),
	...overrides,
})

const board = (overrides: Partial<{ ownerId: string; accessLevel: AccessLevel }> = {}) => ({
	id: 'board-1',
	workspaceId: 'workspace-1',
	ownerId: OWNER_ID,
	accessLevel: AccessLevel.private,
	...overrides,
})

interface PrismaStub {
	workspaceMember?: { userId: string; role: MemberRole } | null
	boardMember?: { userId: string; role: MemberRole } | null
	workspaceRow?: ReturnType<typeof workspace> | null
}

const makeService = ({
	workspaceMember = null,
	boardMember = null,
	workspaceRow = workspace(),
}: PrismaStub = {}) => {
	const prisma = {
		client: {
			workspace: { findUnique: jest.fn().mockResolvedValue(workspaceRow) },
			workspaceMember: { findUnique: jest.fn().mockResolvedValue(workspaceMember) },
			boardMember: { findUnique: jest.fn().mockResolvedValue(boardMember) },
		},
	}

	return new AccessService(prisma as never)
}

describe('AccessService', () => {
	test('Владелец доски получает OWNER', async () => {
		const service = makeService()

		expect(await service.toBoard(board(), OWNER_ID)).toBe('OWNER')
	})

	test('Владелец области получает OWNER на чужой доске внутри неё', async () => {
		const service = makeService()

		expect(await service.toBoard(board({ ownerId: STRANGER_ID }), OWNER_ID)).toBe(
			'OWNER',
		)
	})

	test('Участник области получает свою роль на доске - наследование прав', async () => {
		const service = makeService({
			workspaceMember: { userId: MEMBER_ID, role: MemberRole.editor },
		})

		expect(
			await service.toBoard(board({ ownerId: STRANGER_ID }), MEMBER_ID),
		).toBe('EDITOR')
	})

	test('При ролях на доске и на области берётся сильнейшая', async () => {
		const service = makeService({
			boardMember: { userId: MEMBER_ID, role: MemberRole.viewer },
			workspaceMember: { userId: MEMBER_ID, role: MemberRole.admin },
		})

		expect(
			await service.toBoard(board({ ownerId: STRANGER_ID }), MEMBER_ID),
		).toBe('ADMIN')
	})

	test('Публичная на чтение область открывает приватную доску', async () => {
		const service = makeService({
			workspaceRow: workspace({ accessLevel: AccessLevel.public_view }),
		})

		expect(
			await service.toBoard(board({ ownerId: STRANGER_ID }), MEMBER_ID),
		).toBe('VIEWER')
	})

	test('Публичная на запись доска доступна в приватной области', async () => {
		const service = makeService()

		expect(
			await service.toBoard(
				board({ ownerId: STRANGER_ID, accessLevel: AccessLevel.public_edit }),
				MEMBER_ID,
			),
		).toBe('EDITOR')
	})

	test('Посторонний на приватной доске получает NONE', async () => {
		const service = makeService()

		expect(
			await service.toBoard(board({ ownerId: STRANGER_ID }), MEMBER_ID),
		).toBe('NONE')
	})

	test('Аноним на публичной доске получает VIEWER', async () => {
		const service = makeService()

		expect(
			await service.toBoard(
				board({ ownerId: STRANGER_ID, accessLevel: AccessLevel.public_view }),
			),
		).toBe('VIEWER')
	})

	test('Доска без существующей области недоступна никому', async () => {
		const service = makeService({ workspaceRow: null })

		expect(await service.toBoard(board({ ownerId: STRANGER_ID }), MEMBER_ID)).toBe(
			'NONE',
		)
	})

	test('Владелец области получает OWNER на самой области', async () => {
		const service = makeService()

		expect(await service.toWorkspace(workspace(), OWNER_ID)).toBe('OWNER')
	})

	test('Участник области получает свою роль на области', async () => {
		const service = makeService({
			workspaceMember: { userId: MEMBER_ID, role: MemberRole.admin },
		})

		expect(await service.toWorkspace(workspace(), MEMBER_ID)).toBe('ADMIN')
	})

	test('Посторонний на приватной области получает NONE', async () => {
		const service = makeService()

		expect(await service.toWorkspace(workspace(), STRANGER_ID)).toBe('NONE')
	})
})
