import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { EVENT_CHANNELS } from '@power-paint/contracts'
import type {
	BoardAccessChangedEvent,
	BoardDeletedEvent,
} from '@power-paint/contracts'
import { createPublisher } from '@power-paint/events'

import { CONFIG } from '../config'

@Injectable()
export class EventsService implements OnModuleDestroy {
	private readonly publisher = createPublisher(CONFIG.REDIS_URL)

	boardDeleted(payload: BoardDeletedEvent) {
		return this.publisher.publish(EVENT_CHANNELS.BOARD_DELETED, payload)
	}

	boardAccessChanged(payload: BoardAccessChangedEvent) {
		return this.publisher.publish(EVENT_CHANNELS.BOARD_ACCESS_CHANGED, payload)
	}

	onModuleDestroy() {
		return this.publisher.close()
	}
}
