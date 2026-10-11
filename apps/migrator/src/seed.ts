import 'dotenv/config'
import {
	AccessLevel,
	Locale,
	MemberRole,
	Role,
	WorkspaceType,
} from '@power-paint/db'
import { createPrismaClient } from '@power-paint/db/client'

const prisma = createPrismaClient()

// Сид пишет сразу во все схемы: migrator - инфраструктурный инструмент, он владеет
// базой целиком, в отличие от сервисов, каждый из которых ограничен своей схемой.

interface SeedUser {
	name: string
	email: string
	image?: string
	password?: string
	locale?: Locale
	preferredColor?: string
}

const createUser = async ({
	name,
	email,
	image,
	password,
	locale,
	preferredColor,
}: SeedUser) => {
	const user = await prisma.user.create({
		data: {
			email,
			password,
			emailVerified: new Date(),
			role: Role.User,
		},
	})

	await prisma.profile.create({
		data: { userId: user.id, name, email, image, locale, preferredColor },
	})

	return user
}

interface SeedWorkspace {
	name: string
	type: WorkspaceType
	accessLevel: AccessLevel
}

const createWorkspaces = (ownerId: string, items: SeedWorkspace[]) =>
	Promise.all(
		items.map(data => prisma.workspace.create({ data: { ...data, ownerId } })),
	)

async function main() {
	await prisma.$connect()

	// Сид только на пустую базу: раньше он её очищал, и случайный RUN_SEED=true
	// стёр бы настоящих пользователей.
	if ((await prisma.user.count()) > 0) {
		console.log('Seed skipped: database is not empty')
		return
	}

	const user1 = await createUser({
		name: 'Admin',
		email: 'admin@mail.ru',
		// sha256 пароля admin - старый формат: вход этим пользователем проверяет
		// ленивое перехеширование в scrypt.
		password: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
		locale: Locale.ru,
		preferredColor: '#6128a5',
	})

	const user1Workspaces = await createWorkspaces(user1.id, [
		{
			name: "Admin's workspace",
			type: WorkspaceType.personal,
			accessLevel: AccessLevel.private,
		},
		{
			name: "Admin's private workspace",
			type: WorkspaceType.team,
			accessLevel: AccessLevel.private,
		},
		{
			name: "Admin's public view workspace",
			type: WorkspaceType.team,
			accessLevel: AccessLevel.public_view,
		},
		{
			name: "Admin's public edit workspace",
			type: WorkspaceType.team,
			accessLevel: AccessLevel.public_edit,
		},
	])

	const user1PersonalWorkspace = user1Workspaces[0]

	await prisma.board.createMany({
		data: [
			{
				id: '00000000-0000-0000-0000-000000000001',
				ownerId: user1.id,
				name: "Admin's private board",
				workspaceId: user1PersonalWorkspace.id,
				accessLevel: AccessLevel.private,
			},
			{
				id: '00000000-0000-0000-0000-000000000002',
				ownerId: user1.id,
				name: "Admin's public view board",
				workspaceId: user1PersonalWorkspace.id,
				accessLevel: AccessLevel.public_view,
			},
			{
				id: '00000000-0000-0000-0000-000000000003',
				ownerId: user1.id,
				name: "Admin's public edit board",
				workspaceId: user1PersonalWorkspace.id,
				accessLevel: AccessLevel.public_edit,
			},
		],
	})

	const user2 = await createUser({
		name: 'Алексей',
		email: 'alexey@example.com',
		image: 'https://avatars.githubusercontent.com/u/9822113?v=4',
	})

	const user2Workspaces = await createWorkspaces(user2.id, [
		{
			name: "Алексей's workspace",
			type: WorkspaceType.personal,
			accessLevel: AccessLevel.private,
		},
		{
			name: "Алексей's public view workspace",
			type: WorkspaceType.team,
			accessLevel: AccessLevel.public_view,
		},
		{
			name: "Алексей's public edit workspace",
			type: WorkspaceType.team,
			accessLevel: AccessLevel.public_edit,
		},
		{
			name: "Алексей's private workspace",
			type: WorkspaceType.team,
			accessLevel: AccessLevel.private,
		},
	])

	const user2PersonalWorkspace = user2Workspaces[0]

	await prisma.board.createMany({
		data: [
			{
				id: '00000000-0000-0000-0000-000000000004',
				name: "Алексей's private board",
				ownerId: user2.id,
				workspaceId: user2PersonalWorkspace.id,
				accessLevel: AccessLevel.private,
			},
			{
				id: '00000000-0000-0000-0000-000000000005',
				name: "Алексей's public view board",
				ownerId: user2.id,
				workspaceId: user2PersonalWorkspace.id,
				accessLevel: AccessLevel.public_view,
			},
			{
				id: '00000000-0000-0000-0000-000000000006',
				name: "Алексей's public edit board",
				ownerId: user2.id,
				workspaceId: user2PersonalWorkspace.id,
				accessLevel: AccessLevel.public_edit,
			},
		],
	})

	const sharedMembers = await Promise.all(
		(
			[
				['00000000-0000-0000-0000-000000000007', 'viewer', MemberRole.viewer],
				['00000000-0000-0000-0000-000000000008', 'editor', MemberRole.editor],
				['00000000-0000-0000-0000-000000000009', 'admin', MemberRole.admin],
			] as const
		).map(async ([id, label, role]) => {
			const board = await prisma.board.create({
				data: {
					id,
					name: `Алексей's private board with ${label}`,
					ownerId: user2.id,
					workspaceId: user2PersonalWorkspace.id,
					accessLevel: AccessLevel.private,
				},
			})

			return { boardId: board.id, userId: user1.id, role }
		}),
	)

	await prisma.boardMember.createMany({ data: sharedMembers })

	await prisma.$disconnect()
}

main().catch(async e => {
	console.error(e)
	await prisma.$disconnect()
	process.exit(1)
})
