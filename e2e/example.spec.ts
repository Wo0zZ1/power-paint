// Это пример E2E теста с использованием Playwright.
// Запустить: yarn test:e2e или yarn test:e2e:ui

import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  // Открываем локальный сайт
  await page.goto("/");

  // Проверяем, что title содержит корректное значение
  await expect(page).toHaveTitle(/Power Paint/i);
});
