import { test, expect } from '@playwright/test';

test('Главная страница открывается', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Power Paint/i);
});
