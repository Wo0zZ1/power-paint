import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { EVENT_CHANNELS, userCreatedSchema } from '@power-paint/contracts'
import type { UserCreatedEvent } from '@power-paint/contracts'
import { AccessLevel, WorkspaceType } from '@power-paint/db'
import { createSubscriber } from '@power-paint/events'

import { CONFIG } from '../config'
import { PrismaService } from '../prisma.service'

@Injectable()
export class UserCreatedListener implements OnModuleInit, OnModuleDestroy {
	private readonly subscriber = createSubscriber(CONFIG.REDIS_URL)

	constructor(private readonly prisma: PrismaService) {}

	async onModuleInit() {
		await this.subscriber.connect()
		await this.subscriber.subscribe(
			EVENT_CHANNELS.USER_CREATED,
			userCreatedSchema,
			payload => this.createPersonalWorkspace(payload),
		)
	}

	onModuleDestroy() {
		return this.subscriber.close()
	}

	// Обработчик идемпотентен: доставка события может повториться, а второй
	// личной области у пользователя быть не должно.
	private async createPersonalWorkspace({ userId, name }: UserCreatedEvent) {
		const existing = await this.prisma.client.workspace.findFirst({
			where: { ownerId: userId, type: WorkspaceType.personal },
		})

		if (existing) return

		await this.prisma.client.workspace.create({
			data: {
				ownerId: userId,
				name: `${name}'s Workspace`,
				type: WorkspaceType.personal,
				accessLevel: AccessLevel.private,
			},
		})
	}
}
