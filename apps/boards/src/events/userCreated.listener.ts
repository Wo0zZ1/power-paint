import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { EVENT_STREAMS, userCreatedSchema } from '@power-paint/contracts'
import type { UserCreatedEvent } from '@power-paint/contracts'
import { AccessLevel, WorkspaceType } from '@power-paint/db'
import { consumeGroup } from '@power-paint/events'

import { CONFIG } from '../config'
import { PrismaService } from '../prisma.service'

const CONSUMER_GROUP = 'boards'

@Injectable()
export class UserCreatedListener implements OnModuleInit, OnModuleDestroy {
	private consumer?: ReturnType<typeof consumeGroup>

	constructor(private readonly prisma: PrismaService) {}

	onModuleInit() {
		this.consumer = consumeGroup({
			redisUrl: CONFIG.REDIS_URL,
			stream: EVENT_STREAMS.USER_CREATED,
			group: CONSUMER_GROUP,
			schema: userCreatedSchema,
			handler: payload => this.createPersonalWorkspace(payload),
		})
	}

	onModuleDestroy() {
		return this.consumer?.close()
	}

	// Доставка повторяется, пока обработчик не подтвердит событие, поэтому он
	// идемпотентен: вторую личную область не даёт создать уникальный индекс,
	// а skipDuplicates превращает повтор в пустую вставку вместо ошибки.
	async createPersonalWorkspace({ userId, name }: UserCreatedEvent) {
		await this.prisma.client.workspace.createMany({
			data: {
				ownerId: userId,
				name: `${name}'s Workspace`,
				type: WorkspaceType.personal,
				accessLevel: AccessLevel.private,
			},
			skipDuplicates: true,
		})
	}
}
