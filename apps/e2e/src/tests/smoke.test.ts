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

	authedTest('Свой private board доступен', async ({ page }) => {
		await page.goto('/boards/00000000-0000-0000-0000-000000000001')

		await expect(page.getByRole('status', { name: 'Connection status' })).toHaveText(
			'Connected',
			{
				timeout: 8000,
			},
		)
	})

	authedTest('Свой public view board доступен', async ({ page }) => {
		await page.goto('/boards/00000000-0000-0000-0000-000000000002')

		await expect(page.getByRole('status', { name: 'Connection status' })).toHaveText(
			'Connected',
			{
				timeout: 8000,
			},
		)
	})

	authedTest('Свой public edit board доступен', async ({ page }) => {
		await page.goto('/boards/00000000-0000-0000-0000-000000000003')

		await expect(page.getByRole('status', { name: 'Connection status' })).toHaveText(
			'Connected',
			{
				timeout: 8000,
			},
		)
	})

	authedTest('Чужой private board недоступен', async ({ page }) => {
		await page.goto('/boards/00000000-0000-0000-0000-000000000004')

		await expect(page.getByText('Board not found')).toBeVisible()
	})

	authedTest('Чужой public view board доступен с ограничениями', async ({ page }) => {
		await page.goto('/boards/00000000-0000-0000-0000-000000000005')

		await expect(page.getByRole('status', { name: 'Connection status' })).toHaveText(
			'Connected',
			{
				timeout: 8000,
			},
		)

		const toolbar = page.getByRole('toolbar')
		const tools = toolbar.getByRole('listitem')

		expect(await tools.count()).toBe(2)
	})

	authedTest(
		'Чужой public edit board доступен с правами редактирования',
		async ({ page }) => {
			await page.goto('/boards/00000000-0000-0000-0000-000000000006')

			await expect(page.getByRole('status', { name: 'Connection status' })).toHaveText(
				'Connected',
				{
					timeout: 8000,
				},
			)

			const toolbar = page.getByRole('toolbar')
			const tools = toolbar.getByRole('listitem')

			expect(await tools.count()).toBeGreaterThan(2)
		},
	)

	authedTest('Чужой private board с view membership доступен', async ({ page }) => {
		await page.goto('/boards/00000000-0000-0000-0000-000000000007')

		await expect(page.getByRole('status', { name: 'Connection status' })).toHaveText(
			'Connected',
			{
				timeout: 8000,
			},
		)

		const toolbar = page.getByRole('toolbar')
		const tools = toolbar.getByRole('listitem')

		expect(await tools.count()).toBe(2)
	})

	authedTest(
		'Чужой private board с edit membership доступен с правами редактирования',
		async ({ page }) => {
			await page.goto('/boards/00000000-0000-0000-0000-000000000008')

			await expect(page.getByRole('status', { name: 'Connection status' })).toHaveText(
				'Connected',
				{
					timeout: 8000,
				},
			)

			const toolbar = page.getByRole('toolbar')
			const tools = toolbar.getByRole('listitem')

			expect(await tools.count()).toBeGreaterThan(2)
		},
	)

	authedTest(
		'Чужой private board с admin membership доступен с правами редактирования',
		async ({ page }) => {
			await page.goto('/boards/00000000-0000-0000-0000-000000000009')

			await expect(page.getByRole('status', { name: 'Connection status' })).toHaveText(
				'Connected',
				{
					timeout: 8000,
				},
			)

			const toolbar = page.getByRole('toolbar')
			const tools = toolbar.getByRole('listitem')

			expect(await tools.count()).toBeGreaterThan(2)
		},
	)
})
