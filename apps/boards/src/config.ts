import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
	DATABASE_URL: z.string().min(1),
	USERS_SERVICE_URL: z.string().min(1),
	PORT: z.coerce.number().default(3004),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success)
	throw new Error(`Env not configured: ${z.prettifyError(parsed.error)}`)

export const CONFIG = parsed.data
