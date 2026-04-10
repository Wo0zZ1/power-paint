import 'dotenv/config'
import { execSync } from 'child_process'

function runMigrations() {
	try {
		console.log('Запуск миграций...')

		execSync('npx prisma migrate deploy', { stdio: 'inherit' })

		console.log('Миграции успешно применены.')
	} catch (error) {
		console.error('Ошибка при применении миграций:', error)
		process.exit(1)
	}
}

function runSeed() {
	try {
		console.log('Сидинг данных...')

		execSync('npx prisma db seed', { stdio: 'inherit' })

		console.log('Сидинг успешно завершён.')
	} catch (error) {
		console.error('Ошибка при сидинге:', error)
		process.exit(1)
	}
}

function main() {
	const RUN_SEED = process.env.RUN_SEED === 'true' || false

	runMigrations()

	if (RUN_SEED) runSeed()
}

main()
