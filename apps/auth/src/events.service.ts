import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { EVENT_STREAMS } from '@power-paint/contracts'
import type {
	SessionRevokedEvent,
	UserCreatedEvent,
} from '@power-paint/contracts'
import { createPublisher } from '@power-paint/events'

import { CONFIG } from './config'

@Injectable()
export class EventsService implements OnModuleDestroy {
	private readonly publisher = createPublisher(CONFIG.REDIS_URL)

	userCreated(payload: UserCreatedEvent) {
		this.publisher.publish(EVENT_STREAMS.USER_CREATED, payload)
	}

	sessionsRevoked(payload: SessionRevokedEvent) {
		this.publisher.publish(EVENT_STREAMS.SESSION_REVOKED, payload)
	}

	onModuleDestroy() {
		return this.publisher.close()
	}
}
