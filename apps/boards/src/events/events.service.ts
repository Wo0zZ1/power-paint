import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { EVENT_STREAMS } from '@power-paint/contracts'
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
		this.publisher.publish(EVENT_STREAMS.BOARD_DELETED, payload)
	}

	boardAccessChanged(payload: BoardAccessChangedEvent) {
		this.publisher.publish(EVENT_STREAMS.BOARD_ACCESS_CHANGED, payload)
	}

	onModuleDestroy() {
		return this.publisher.close()
	}
}
