import { defineConfig, devices } from "@playwright/test";

/**
 * Читайте больше обо всех опциях конфига тут:
 * https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e",
  /* Запускать тесты в параллельном режиме */
  fullyParallel: true,
  /* Строго падать на test.only() в CI */
  forbidOnly: !!process.env.CI,
  /* Количество повторных попыток для упавшего теста на CI */
  retries: process.env.CI ? 2 : 0,
  /* Количество воркеров (на CI обычно меньше) */
  workers: process.env.CI ? 1 : undefined,
  /* HTML-репортер для отчётов о тестах */
  reporter: "html",

  use: {
    /* Базовый URL, к которому делаются отностельные E2E вызовы */
    baseURL: "http://localhost:3000",

    /* Записывать трассировку (дебаггер) при первой перезапуске */
    trace: "on-first-retry",
  },

  /* Какие браузеры будут тестироваться проектами: */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Автоматический запуск локального дев-сервера перед тестами (при желании) */
  webServer: {
    command: "yarn dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
