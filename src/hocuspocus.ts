import { Server } from '@hocuspocus/server'
import { onAuthenticate } from './extensions/auth'
import { postgresDatabase } from './extensions/database'

export { closePostgresStorage, ensurePostgresStorageIsReady } from './extensions/database'

/**
 * Hocuspocus v3: используем new Server({}) вместо Server.configure({})
 *
 * Hocuspocus обрабатывает Y.js awareness из коробки.
 * Фронтенд использует awareness для хранения:
 *   - позиции курсора пользователя (x, y на canvas)
 *   - имя и цвет пользователя
 *   - список активных участников
 */
export const hocuspocus = new Server({
	name: 'power-paint',

	extensions: [
		/**
		 * PostgreSQL хранит бинарное состояние Y.js в таблице yjs_documents
		 * или в таблице из HOCUSPOCUS_DOCUMENTS_TABLE.
		 *
		 * В качестве подключения используется DATABASE_URL.
		 */
		postgresDatabase,
	],

	/**
	 * Проверка токена сессии при подключении.
	 * Логика вынесена в src/extensions/auth.ts.
	 */
	async onAuthenticate(data) {
		return onAuthenticate(data)
	},

	async onConnect({ documentName }) {
		console.log(`[connect]  room: ${documentName}`)
	},

	async onDisconnect({ documentName }) {
		console.log(`[disconnect] room: ${documentName}`)
	},
})
