import { HOCUSPOCUS_DOCUMENTS_TABLE } from "../config";
import { getPool } from "../pool";

let readyPromise: Promise<void> | null = null;

export async function ensureDocumentsTable() {
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS "${HOCUSPOCUS_DOCUMENTS_TABLE}" (
      document_name TEXT PRIMARY KEY,
      state BYTEA NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

export async function ensureDocumentsTableIsReady() {
  if (!readyPromise) readyPromise = ensureDocumentsTable();
  await readyPromise;
}

export function resetDocumentsTableReady() {
  readyPromise = null;
}
