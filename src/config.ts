import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  POSTGRES_USER: z
    .string()
    .min(1, "POSTGRES_USER env is required for PostgreSQL storage."),
  POSTGRES_PASSWORD: z
    .string()
    .min(1, "POSTGRES_PASSWORD env is required for PostgreSQL storage."),
  POSTGRES_HOST: z
    .string()
    .min(1, "POSTGRES_HOST env is required for PostgreSQL storage."),
  POSTGRES_PORT: z
    .string()
    .min(1, "POSTGRES_PORT env is required for PostgreSQL storage."),
  POSTGRES_DB: z
    .string()
    .min(1, "POSTGRES_DB env is required for PostgreSQL storage."),
  POSTGRES_SCHEMA: z
    .string()
    .min(1, "POSTGRES_SCHEMA env is required for PostgreSQL storage."),
  POSTGRES_SSLMODE: z.string(),
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
  DATABASE_SSL_REJECT_UNAUTHORIZED: z.string().optional(),
});

const env = envSchema.parse(process.env);

export const DATABASE_URL = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}?schema=${process.env.POSTGRES_SCHEMA}&sslmode=${process.env.POSTGRES_SSLMODE}`;
export const POSTGRES_USER = env.POSTGRES_USER;
export const POSTGRES_PASSWORD = env.POSTGRES_PASSWORD;
export const POSTGRES_HOST = env.POSTGRES_HOST;
export const POSTGRES_PORT = env.POSTGRES_PORT;
export const POSTGRES_DB = env.POSTGRES_DB;
export const POSTGRES_SCHEMA = env.POSTGRES_SCHEMA;
export const POSTGRES_SSLMODE = env.POSTGRES_SSLMODE;
export const PORT = env.PORT;
export const WS_TOKEN_SECRET = env.WS_TOKEN_SECRET;
export const HOCUSPOCUS_DOCUMENTS_TABLE = env.HOCUSPOCUS_DOCUMENTS_TABLE;
export const DATABASE_SSL_REJECT_UNAUTHORIZED =
  env.DATABASE_SSL_REJECT_UNAUTHORIZED;
