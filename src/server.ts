import 'dotenv/config'

import {
	closePostgresStorage,
	ensurePostgresStorageIsReady,
	hocuspocus,
} from './hocuspocus'

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 1234

let isShuttingDown = false

async function shutdown(signal: NodeJS.Signals) {
	if (isShuttingDown) {
		return
	}

	isShuttingDown = true
	console.log(`[shutdown] signal: ${signal}`)

	try {
		await hocuspocus.destroy()
	} catch (error) {
		console.error('[shutdown] failed to destroy hocuspocus', error)
	}

	try {
		await closePostgresStorage()
	} catch (error) {
		console.error('[shutdown] failed to close postgres pool', error)
	}

	process.exit(0)
}

async function main() {
	await ensurePostgresStorageIsReady()
	await hocuspocus.listen(PORT)

	console.log(`[listen] port: ${PORT}`)
}

process.once('SIGINT', () => {
	void shutdown('SIGINT')
})

process.once('SIGTERM', () => {
	void shutdown('SIGTERM')
})

void main().catch(async error => {
	console.error('[startup] failed to start server', error)

	try {
		await hocuspocus.destroy()
	} catch (destroyError) {
		console.error('[startup] failed to destroy hocuspocus', destroyError)
	}

	try {
		await closePostgresStorage()
	} catch (closeError) {
		console.error('[startup] failed to close postgres pool', closeError)
	}

	process.exit(1)
})
