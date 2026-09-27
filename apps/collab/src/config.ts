import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  BOARDS_SERVICE_URL: z.string().min(1),
  PORT: z.coerce.number().default(3005),
  ACCESS_CHECK_TIMEOUT_MS: z.coerce.number().default(3000),
  // Схема collab принадлежит этому сервису, поэтому таблица квалифицирована ею.
  DOCUMENTS_TABLE: z.string().default("collab.yjs_documents"),
  DATABASE_SSL_REJECT_UNAUTHORIZED: z
    .string()
    .default("true")
    .transform((value) => value !== "false"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success)
  throw new Error(`Env not configured: ${z.prettifyError(parsed.error)}`);

export const CONFIG = parsed.data;
