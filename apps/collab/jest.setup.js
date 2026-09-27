// Конфиг падает на старте, если переменных нет - для юнит-тестов подставляем заглушки.
process.env.DATABASE_URL ??= "postgresql://test:test@localhost:5432/test";
process.env.REDIS_URL ??= "redis://localhost:0";
process.env.BOARDS_SERVICE_URL ??= "http://boards";
process.env.ACCESS_CHECK_TIMEOUT_MS ??= "50";
