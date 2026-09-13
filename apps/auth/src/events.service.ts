import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { EVENT_CHANNELS } from '@power-paint/contracts'
import type { UserCreatedEvent, UserDeletedEvent } from '@power-paint/contracts'
import { createPublisher } from '@power-paint/events'

import { CONFIG } from './config'

@Injectable()
export class EventsService implements OnModuleDestroy {
	private readonly publisher = createPublisher(CONFIG.REDIS_URL)

	userCreated(payload: UserCreatedEvent) {
		return this.publisher.publish(EVENT_CHANNELS.USER_CREATED, payload)
	}

	userDeleted(payload: UserDeletedEvent) {
		return this.publisher.publish(EVENT_CHANNELS.USER_DELETED, payload)
	}

	onModuleDestroy() {
		return this.publisher.close()
	}
}
