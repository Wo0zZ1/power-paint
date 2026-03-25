import { Pool, PoolConfig } from "pg";

import {
  PGSSLMODE,
  DATABASE_URL,
  DATABASE_SSL,
  DATABASE_SSL_REJECT_UNAUTHORIZED,
} from "./config";

let pool: Pool | null = null;

function buildPoolConfig(): PoolConfig {
  const config: PoolConfig = {
    application_name: "power-paint-socket",
    connectionString: DATABASE_URL,
  };

  const forceSsl =
    DATABASE_SSL === "true" ||
    PGSSLMODE === "require" ||
    /sslmode=require/i.test(DATABASE_URL);

  if (forceSsl) {
    config.ssl = {
      rejectUnauthorized: DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
    };
  }

  return config;
}

export function getPool(): Pool {
  if (!pool) pool = new Pool(buildPoolConfig());

  return pool;
}

export async function closePool() {
  if (!pool) return;

  const current = pool;
  pool = null;
  await current.end();
}
