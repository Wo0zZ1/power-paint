import { Database } from '@hocuspocus/extension-database'
import type { fetchPayload, storePayload } from '@hocuspocus/server'
import { Pool, type PoolConfig } from 'pg'

const DEFAULT_TABLE_NAME = 'yjs_documents'

let pool: Pool | null = null
let documentsTableReady: Promise<void> | null = null

function getDocumentsTableName() {
	const tableName = process.env.HOCUSPOCUS_DOCUMENTS_TABLE || DEFAULT_TABLE_NAME

	if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(tableName)) {
		throw new Error(
			'HOCUSPOCUS_DOCUMENTS_TABLE must be a safe SQL identifier (letters, numbers, underscore).',
		)
	}

	return tableName
}

function buildPoolConfig(): PoolConfig {
	const connectionString = process.env.DATABASE_URL

	if (!connectionString) {
		throw new Error('DATABASE_URL env is required for PostgreSQL storage.')
	}

	const config: PoolConfig = {
		application_name: 'power-paint-socket',
		connectionString,
	}

	const forceSsl =
		process.env.DATABASE_SSL === 'true' ||
		process.env.PGSSLMODE === 'require' ||
		/sslmode=require/i.test(connectionString)

	if (forceSsl) {
		config.ssl = {
			rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false',
		}
	}

	return config
}

function getPool() {
	if (!pool) {
		pool = new Pool(buildPoolConfig())
	}

	return pool
}

async function ensureDocumentsTable() {
	const tableName = getDocumentsTableName()

	await getPool().query(`
		CREATE TABLE IF NOT EXISTS "${tableName}" (
			document_name TEXT PRIMARY KEY,
			state BYTEA NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)
	`)
}

async function ensureDocumentsTableIsReady() {
	if (!documentsTableReady) {
		documentsTableReady = ensureDocumentsTable()
	}

	await documentsTableReady
}

async function fetchDocument({ documentName }: fetchPayload): Promise<Uint8Array | null> {
	await ensureDocumentsTableIsReady()

	const tableName = getDocumentsTableName()
	const result = await getPool().query<{ state: Buffer }>(
		`SELECT state FROM "${tableName}" WHERE document_name = $1 LIMIT 1`,
		[documentName],
	)

	return result.rows[0]?.state ?? null
}

async function storeDocument({ documentName, state }: storePayload): Promise<void> {
	await ensureDocumentsTableIsReady()

	const tableName = getDocumentsTableName()
	await getPool().query(
		`
			INSERT INTO "${tableName}" (document_name, state)
			VALUES ($1, $2)
			ON CONFLICT (document_name)
			DO UPDATE SET
				state = EXCLUDED.state,
				updated_at = NOW()
		`,
		[documentName, Buffer.from(state)],
	)
}

export const postgresDatabase = new Database({
	fetch: fetchDocument,
	store: storeDocument,
})

export async function ensurePostgresStorageIsReady() {
	await ensureDocumentsTableIsReady()
}

export async function closePostgresStorage() {
	documentsTableReady = null

	if (!pool) {
		return
	}

	const currentPool = pool
	pool = null

	await currentPool.end()
}
