import Redis from 'ioredis'

import { CONFIG } from './config'

// lazyConnect и отсутствие повторов на старте: шлюз должен подниматься даже
// при недоступном Redis, деградируя, а не падая.
export const redis = new Redis(CONFIG.REDIS_URL, {
	lazyConnect: true,
	maxRetriesPerRequest: 1,
	enableOfflineQueue: false,
})

redis.on('error', error => console.error('Redis error:', error.message))

export const connectRedis = () =>
	redis.connect().catch(error => {
		console.error('Redis unavailable at startup:', error.message)
	})
