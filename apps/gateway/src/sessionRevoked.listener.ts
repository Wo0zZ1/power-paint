import { EVENT_STREAMS, sessionRevokedSchema } from '@power-paint/contracts'
import { consumeGroup } from '@power-paint/events'

import { CONFIG } from './config'
import { dropCache } from './introspect'

// Кэш личности общий для всех экземпляров шлюза - он в Redis, поэтому событие
// достаточно обработать одному из группы. Без него выход и смена пароля
// действовали бы только по истечении TTL кэша.
export const listenSessionRevoked = () =>
	consumeGroup({
		redisUrl: CONFIG.REDIS_URL,
		stream: EVENT_STREAMS.SESSION_REVOKED,
		group: 'gateway',
		schema: sessionRevokedSchema,
		handler: async ({ sessionTokens }) => {
			await Promise.all(sessionTokens.map(token => dropCache(token)))
		},
	})
