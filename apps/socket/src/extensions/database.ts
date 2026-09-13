import { Database } from "@hocuspocus/extension-database";
import type { fetchPayload, storePayload } from "@hocuspocus/server";

import { HOCUSPOCUS_DOCUMENTS_TABLE } from "../config";
import { getPool, closePool } from "../pool";
import {
  ensureDocumentsTableIsReady,
  resetDocumentsTableReady,
} from "./documentsTableReady";

async function fetchDocument({
  documentName,
}: fetchPayload): Promise<Uint8Array | null> {
  await ensureDocumentsTableIsReady();

  const result = await getPool().query<{ state: Buffer }>(
    `SELECT state FROM "${HOCUSPOCUS_DOCUMENTS_TABLE}" WHERE document_name = $1 LIMIT 1`,
    [documentName],
  );
  return result.rows[0]?.state ?? null;
}

async function storeDocument({
  documentName,
  state,
}: storePayload): Promise<void> {
  await ensureDocumentsTableIsReady();

  await getPool().query(
    `
      INSERT INTO "${HOCUSPOCUS_DOCUMENTS_TABLE}" (document_name, state)
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

export async function ensurePostgresStorageIsReady() {
  await ensureDocumentsTableIsReady();
}

export async function closePostgresStorage() {
  resetDocumentsTableReady();
  await closePool();
}
