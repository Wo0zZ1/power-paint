import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
	PORT: z.coerce.number().default(3001),
	REDIS_URL: z.string().min(1),
	AUTH_SERVICE_URL: z.string().min(1),
	USERS_SERVICE_URL: z.string().min(1),
	BOARDS_SERVICE_URL: z.string().min(1),
	COLLAB_SERVICE_URL: z.string().min(1),
	WEB_SERVICE_URL: z.string().min(1),
	SESSION_COOKIE_NAME: z.string().default('authjs.session-token'),
	SESSION_CACHE_TTL_SEC: z.coerce.number().default(60),
	RATE_LIMIT_WINDOW_SEC: z.coerce.number().default(60),
	RATE_LIMIT_MAX: z.coerce.number().default(300),
	RATE_LIMIT_AUTH_MAX: z.coerce.number().default(20),
	// Адреса, которым можно верить в X-Forwarded-For: nginx и контейнер Web,
	// делающий запросы при серверном рендеринге.
	TRUSTED_PROXIES: z
		.string()
		.default('')
		.transform(value => value.split(',').map(item => item.trim()).filter(Boolean)),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success)
	throw new Error(`Env not configured: ${z.prettifyError(parsed.error)}`)

export const CONFIG = parsed.data
