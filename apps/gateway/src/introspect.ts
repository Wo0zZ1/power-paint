import { CONFIG } from './config'
import { redis } from './redis'

export interface Identity {
	userId: string
	email: string
	role: string
}

const cacheKey = (sessionToken: string) => `session:${sessionToken}`

const readCache = async (sessionToken: string): Promise<Identity | null> => {
	try {
		const cached = await redis.get(cacheKey(sessionToken))

		return cached ? (JSON.parse(cached) as Identity) : null
	} catch {
		// Redis недоступен - идём в auth напрямую, кэш только ускоряет.
		return null
	}
}

const writeCache = async (sessionToken: string, identity: Identity) => {
	try {
		await redis.setex(
			cacheKey(sessionToken),
			CONFIG.SESSION_CACHE_TTL_SEC,
			JSON.stringify(identity),
		)
	} catch {
		// Промах записи в кэш не должен ломать запрос.
	}
}

// Шлюз не знает, как устроена сессия, и спрашивает у её владельца - паттерн
// token introspection. Кэш с коротким TTL убирает поход в auth на каждый запрос;
// цена - отозванная сессия живёт ещё до TTL.
export const introspect = async (
	sessionToken: string,
): Promise<Identity | null> => {
	const cached = await readCache(sessionToken)
	if (cached) return cached

	const response = await fetch(
		`${CONFIG.AUTH_SERVICE_URL}/internal/introspect`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ sessionToken }),
		},
	).catch(() => null)

	if (!response?.ok) return null

	const identity = (await response.json()) as Identity

	await writeCache(sessionToken, identity)

	return identity
}

export const dropCache = async (sessionToken: string) => {
	try {
		await redis.del(cacheKey(sessionToken))
	} catch {
		// Кэш сам протухнет по TTL.
	}
}
