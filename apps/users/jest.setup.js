// Конфиг падает на старте, если переменных нет - для юнит-тестов подставляем заглушки.
process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test'
