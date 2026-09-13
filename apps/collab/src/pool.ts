import { Pool } from "pg";

import { CONFIG } from "./config";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool)
    pool = new Pool({
      application_name: "power-paint-collab",
      connectionString: CONFIG.DATABASE_URL,
      ssl: CONFIG.DATABASE_URL.includes("sslmode=require")
        ? { rejectUnauthorized: CONFIG.DATABASE_SSL_REJECT_UNAUTHORIZED }
        : undefined,
    });

  return pool;
}

export async function closePool() {
  if (!pool) return;

  const current = pool;
  pool = null;
  await current.end();
}
