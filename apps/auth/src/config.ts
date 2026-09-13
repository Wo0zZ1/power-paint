import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
	DATABASE_URL: z.string().min(1),
	AUTH_SECRET: z.string().min(1),
	AUTH_GOOGLE_ID: z.string().min(1),
	AUTH_GOOGLE_SECRET: z.string().min(1),
	AUTH_GITHUB_ID: z.string().min(1),
	AUTH_GITHUB_SECRET: z.string().min(1),
	PORT: z.coerce.number().default(3002),
	SESSION_COOKIE_NAME: z.string().default('authjs.session-token'),
	SESSION_MAX_AGE_SEC: z.coerce.number().default(30 * 24 * 60 * 60),
	COOKIE_SECURE: z
		.string()
		.default('false')
		.transform(value => value === 'true'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success)
	throw new Error(
		`Env not configured: ${z.prettifyError(parsed.error)}`,
	)

export const CONFIG = parsed.data
