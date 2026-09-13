import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Путь к корню Next.js для загрузки next.config.ts и .env файлов
  dir: "./",
});

// Кастомные настройки, передаваемые в Jest
const config: Config = {
  // Автоматический сбор coverage (при запуске jest --coverage)
  coverageProvider: "v8",

  // jsdom эмулирует браузерное окружение, что нужно для @testing-library
  testEnvironment: "jsdom",

  // Файл(ы) настройки, выполняющиеся перед тестами (например, импорт jest-dom)
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Сборка Next кладёт копию package.json в .next/standalone, и Jest считает её
  // вторым пакетом с тем же именем.
  modulePathIgnorePatterns: ["<rootDir>/.next/"],

  // Задание путей, аналогично tsconfig paths
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // Папки, которые Jest будет искать при сканировании тестов
  testMatch: [
    "<rootDir>/src/**/*.test.(ts|tsx)",
    "<rootDir>/__tests__/**/*.test.(ts|tsx)",
  ],
};

export default createJestConfig(config);
