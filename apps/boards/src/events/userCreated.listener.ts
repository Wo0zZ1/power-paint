import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { EVENT_STREAMS, userCreatedSchema } from '@power-paint/contracts'
import type { UserCreatedEvent } from '@power-paint/contracts'
import { consumeGroup } from '@power-paint/events'

import { CONFIG } from '../config'
import { WorkspaceRepository } from '../workspaces/workspace.repository'

const CONSUMER_GROUP = 'boards'

@Injectable()
export class UserCreatedListener implements OnModuleInit, OnModuleDestroy {
	private consumer?: ReturnType<typeof consumeGroup>

	constructor(private readonly workspaces: WorkspaceRepository) {}

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

	// Доставка повторяется, пока обработчик не подтвердит событие, поэтому
	// создание идемпотентно - см. WorkspaceRepository.createPersonal.
	async createPersonalWorkspace({ userId, name }: UserCreatedEvent) {
		await this.workspaces.createPersonal({ ownerId: userId, name })
	}
}
