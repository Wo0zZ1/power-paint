import { Database } from "@hocuspocus/extension-database";
import type { fetchPayload, storePayload } from "@hocuspocus/server";

import { CONFIG } from "../config";
import { closePool, getPool } from "../pool";

// Таблицу создаёт миграция в packages/db. Раньше сервис делал это сам через
// CREATE TABLE IF NOT EXISTS - то есть обходил миграции и мог с ними разойтись.

async function fetchDocument({
  documentName,
}: fetchPayload): Promise<Uint8Array | null> {
  const result = await getPool().query<{ state: Buffer }>(
    `SELECT state FROM ${CONFIG.DOCUMENTS_TABLE} WHERE document_name = $1 LIMIT 1`,
    [documentName],
  );

  return result.rows[0]?.state ?? null;
}

async function storeDocument({
  documentName,
  state,
}: storePayload): Promise<void> {
  await getPool().query(
    `
      INSERT INTO ${CONFIG.DOCUMENTS_TABLE} (document_name, state)
      VALUES ($1, $2)
      ON CONFLICT (document_name)
      DO UPDATE SET
        state = EXCLUDED.state,
        updated_at = NOW()
    `,
    [documentName, Buffer.from(state)],
  );
}

export const postgresDatabase = new Database({
  fetch: fetchDocument,
  store: storeDocument,
});

export const closePostgresStorage = () => closePool();
