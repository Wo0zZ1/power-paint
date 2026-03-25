import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL env is required for PostgreSQL storage."),
  DATABASE_SSL: z.enum(["true", "false"]),
  PORT: z.string().transform((value) => {
    const port = Number(value);
    if (isNaN(port) || port <= 0 || port > 65535)
      throw new Error("PORT must be a valid number between 1 and 65535.");
    return port;
  }),
  WS_TOKEN_SECRET: z
    .string()
    .min(1, "WS_TOKEN_SECRET env is required for WebSocket authentication."),
  HOCUSPOCUS_DOCUMENTS_TABLE: z
    .string()
    .regex(
      /^[A-Za-z_][A-Za-z0-9_]*$/,
      "HOCUSPOCUS_DOCUMENTS_TABLE must be a safe SQL identifier (letters, numbers, underscore).",
    ),
  PGSSLMODE: z.string().optional(),
  DATABASE_SSL_REJECT_UNAUTHORIZED: z.string().optional(),
});

const env = envSchema.parse(process.env);

export const DATABASE_URL = env.DATABASE_URL;
export const DATABASE_SSL = env.DATABASE_SSL;
export const PORT = env.PORT;
export const WS_TOKEN_SECRET = env.WS_TOKEN_SECRET;
export const HOCUSPOCUS_DOCUMENTS_TABLE = env.HOCUSPOCUS_DOCUMENTS_TABLE;
export const PGSSLMODE = env.PGSSLMODE;
export const DATABASE_SSL_REJECT_UNAUTHORIZED =
  env.DATABASE_SSL_REJECT_UNAUTHORIZED;
