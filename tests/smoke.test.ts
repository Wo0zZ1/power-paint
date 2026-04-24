import { test, expect } from '@playwright/test'
import { describe } from 'node:test'
import { authedTest } from './fixtures'

describe('Smoke tests', () => {
	test('Главная страница открывается', async ({ page }) => {
		await page.goto('/')
		await expect(page).toHaveTitle(/Power Paint/i)
		await expect(page).toHaveURL(/\//)
	})

	test('Страница входа открывается', async ({ page }) => {
		await page.goto('/signin')
		await expect(page).toHaveTitle(/Sign In/i)
		await expect(page).toHaveURL(/\/signin/)
	})

	test('Страница регистрации открывается', async ({ page }) => {
		await page.goto('/signup')
		await expect(page).toHaveTitle(/Sign Up/i)
		await expect(page).toHaveURL(/\/signup/)
	})

	test('Страница восстановления пароля открывается', async ({ page }) => {
		await page.goto('/reset-password')
		await expect(page).toHaveTitle(/Reset Password/i)
		await expect(page).toHaveURL(/\/reset-password/)
	})

	test('Dashboard недоступен без авторизации', async ({ page }) => {
		await page.goto('/dashboard')
		await expect(page).toHaveTitle(/Sign In/i)
		await expect(page).toHaveURL(/\/signin/)
	})

	authedTest('Dashboard доступен с авторизацией', async ({ page }) => {
		await page.goto('/dashboard')
		await expect(page).toHaveTitle(/Dashboard/i)
		await expect(page).toHaveURL(/\/dashboard/)
	})
})
