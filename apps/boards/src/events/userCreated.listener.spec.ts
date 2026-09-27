import { randomUUID } from 'node:crypto'

import { WorkspaceType } from '@power-paint/db'

import { PrismaService } from '../prisma.service'

import { UserCreatedListener } from './userCreated.listener'

// Единственность личной области держит индекс в базе, а не код обработчика,
// поэтому проверять её с моком Prisma бессмысленно. Нужна живая база.
const describeIntegration =
	process.env.RUN_INTEGRATION_TESTS === 'true' ? describe : describe.skip

describeIntegration('UserCreatedListener (нужна живая база)', () => {
	const prisma = new PrismaService()
	const listener = new UserCreatedListener(prisma)

	afterAll(() => prisma.client.$disconnect())

	test('Одновременная повторная доставка не создаёт вторую личную область', async () => {
		const userId = randomUUID()

		await Promise.all([
			listener.createPersonalWorkspace({ userId, name: 'Максим' }),
			listener.createPersonalWorkspace({ userId, name: 'Максим' }),
		])

		const count = await prisma.client.workspace.count({
			where: { ownerId: userId, type: WorkspaceType.personal },
		})

		expect(count).toBe(1)
	})
})
