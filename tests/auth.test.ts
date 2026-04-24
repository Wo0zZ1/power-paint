import test, { expect } from '@playwright/test'
import { describe } from 'node:test'

describe('Authentication tests', () => {
	test('Успешный вход', async ({ page }) => {
		await page.goto('/signin')

		await page.getByRole('textbox', { name: 'Email' }).click()
		await page.getByRole('textbox', { name: 'Email' }).fill('Mper06@mail.ru')

		await page.getByRole('textbox', { name: 'Password' }).click()
		await page.getByRole('textbox', { name: 'Password' }).fill('qweqwe')

		await page
			.locator('form')
			.getByRole('button', { name: 'Sign In', exact: true })
			.click()

		await expect(page).toHaveURL(/dashboard/)

		await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible()

		await page.getByRole('button', { name: 'User avatar' }).click()

		const userMenu = page.getByRole('menu', { name: 'User avatar' })

		await expect(userMenu).toBeVisible()

		await expect(userMenu.getByText('mper06@mail.ru')).toBeVisible()
	})

	test('Неверные учетные данные', async ({ page }) => {
		await page.goto('/signin')

		await page.getByRole('textbox', { name: 'Email' }).click()
		await page.getByRole('textbox', { name: 'Email' }).fill('Mper06@mail.ru')

		await page.getByRole('textbox', { name: 'Password' }).click()
		await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword')

		await page
			.locator('form')
			.getByRole('button', { name: 'Sign In', exact: true })
			.click()

		await expect(page).toHaveURL(/signin/)

		await expect(page.getByText('Invalid email or password.')).toHaveText(
			/Invalid email or password/i,
		)
	})
})
