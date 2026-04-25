import 'dotenv/config'
import {
	AccessLevel,
	MemberRole,
	PrismaClient,
	Role,
	WorkspaceType,
} from '.prisma/client/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

async function main() {
	await prisma.$connect()

	await prisma.user.deleteMany()

	const user1 = await prisma.user.create({
		data: {
			name: 'Макс Wo0zZ1',
			email: 'mper06@mail.ru',
			emailVerified: new Date(),
			image: 'https://avatars.githubusercontent.com/u/98224112?v=4',
			password: '3cc849279ba298b587a34cabaeffc5ecb3a044bbf97c516fab7ede9d1af77cfa',
			locale: 'ru',
			preferredColor: '#6128a5',
			role: Role.User,
			workspaces_owned: {
				createMany: {
					data: [
						{
							name: "Макс Wo0zZ1's workspace",
							type: WorkspaceType.personal,
							accessLevel: AccessLevel.private,
						},
						{
							name: "Макс Wo0zZ1's private workspace",
							type: WorkspaceType.team,
							accessLevel: AccessLevel.private,
						},
						{
							name: "Макс Wo0zZ1's public view workspace",
							type: WorkspaceType.team,
							accessLevel: AccessLevel.public_view,
						},
						{
							name: "Макс Wo0zZ1's public edit workspace",
							type: WorkspaceType.team,
							accessLevel: AccessLevel.public_edit,
						},
					],
				},
			},
		},
		include: {
			workspaces_owned: true,
		},
	})

	const user1_personal_workspace = user1.workspaces_owned[0]

	await prisma.board.createMany({
		data: [
			{
				ownerId: user1.id,
				name: "Макс Wo0zZ1's private board",
				workspaceId: user1_personal_workspace.id,
				accessLevel: AccessLevel.private,
			},
			{
				ownerId: user1.id,
				name: "Макс Wo0zZ1's public view board",
				workspaceId: user1_personal_workspace.id,
				accessLevel: AccessLevel.public_view,
			},
			{
				ownerId: user1.id,
				name: "Макс Wo0zZ1's public edit board",
				workspaceId: user1_personal_workspace.id,
				accessLevel: AccessLevel.public_edit,
			},
		],
	})

	const user2 = await prisma.user.create({
		data: {
			name: 'Алексей',
			email: 'alexey@example.com',
			emailVerified: new Date(),
			image: 'https://avatars.githubusercontent.com/u/9822113?v=4',
			role: Role.User,
			workspaces_owned: {
				createMany: {
					data: [
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
					],
				},
			},
		},
		include: {
			workspaces_owned: true,
		},
	})

	const user2_personal_workspace = user2.workspaces_owned[0]

	await prisma.board.createMany({
		data: [
			{
				name: "Алексей's private board",
				ownerId: user2.id,
				workspaceId: user2_personal_workspace.id,
				accessLevel: AccessLevel.private,
			},

			{
				name: "Алексей's public view board",
				ownerId: user2.id,
				workspaceId: user2_personal_workspace.id,
				accessLevel: AccessLevel.public_view,
			},
			{
				name: "Алексей's public edit board",
				ownerId: user2.id,
				workspaceId: user2_personal_workspace.id,
				accessLevel: AccessLevel.public_edit,
			},
		],
	})

	const user2_private_board_with_viewer = await prisma.board.create({
		data: {
			name: "Алексей's private board with viewer",
			ownerId: user2.id,
			workspaceId: user2_personal_workspace.id,
			accessLevel: AccessLevel.private,
		},
	})

	const user2_private_board_with_editor = await prisma.board.create({
		data: {
			name: "Алексей's private board with editor",
			ownerId: user2.id,
			workspaceId: user2_personal_workspace.id,
			accessLevel: AccessLevel.private,
		},
	})

	const user2_private_board_with_admin = await prisma.board.create({
		data: {
			name: "Алексей's private board with admin",
			ownerId: user2.id,
			workspaceId: user2_personal_workspace.id,
			accessLevel: AccessLevel.private,
		},
	})

	await prisma.boardMember.createMany({
		data: [
			{
				boardId: user2_private_board_with_viewer.id,
				userId: user1.id,
				role: MemberRole.viewer,
			},
			{
				boardId: user2_private_board_with_editor.id,
				userId: user1.id,
				role: MemberRole.editor,
			},
			{
				boardId: user2_private_board_with_admin.id,
				userId: user1.id,
				role: MemberRole.admin,
			},
		],
	})
}

main().catch(async e => {
	console.error(e)
	await prisma.$disconnect()
	process.exit(1)
})
