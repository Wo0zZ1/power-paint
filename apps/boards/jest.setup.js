// Конфиг падает на старте, если переменных нет - для юнит-тестов подставляем заглушки.
process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test'
process.env.USERS_SERVICE_URL ??= 'http://localhost:0'
