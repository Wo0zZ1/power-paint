import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

// Схема и миграции живут в packages/db - там же, откуда их берут сервисы.
// Migrator только применяет их и наполняет базу тестовыми данными.
export default defineConfig({
	schema: '../../packages/db/prisma/schema.prisma',
	migrations: {
		path: '../../packages/db/prisma/migrations',
		seed: 'node dist/seed.js',
	},
	datasource: {
		url: env('DATABASE_URL'),
	},
})
