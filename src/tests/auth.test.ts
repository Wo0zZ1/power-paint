import test, { expect, Page } from '@playwright/test'
import { describe } from 'node:test'
import { getVerificationCode } from '../email/mailhog'

async function login(page: Page) {
	await page.goto('/signin')

	await page.getByRole('textbox', { name: 'Email' }).click()
	await page.getByRole('textbox', { name: 'Email' }).fill('Mper06@mail.ru')

	await page.getByRole('textbox', { name: 'Password' }).click()
	await page.getByRole('textbox', { name: 'Password' }).fill('qweqwe')

	await page.locator('form').getByRole('button', { name: 'Sign In', exact: true }).click()

	await expect(page).toHaveURL(/dashboard/)
}

describe('Authentication tests', () => {
	test('Успешный вход', async ({ page }) => {
		await login(page)

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

	test('Успешный выход', async ({ page }) => {
		await login(page)

		await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible()

		await page.getByRole('button', { name: 'User avatar' }).click()

		await page.getByRole('menuitem', { name: 'Sign Out' }).click()

		await expect(page).toHaveURL(/signin/)

		await page.goto('/dashboard')

		await expect(page).toHaveURL(/signin/)
	})

	test('Успешная регистрация', async ({ page }) => {
		await page.goto('signup')

		await page.getByRole('textbox', { name: 'Enter your first name' }).click()
		await page.getByRole('textbox', { name: 'Enter your first name' }).fill('John')

		await page.getByRole('textbox', { name: 'Enter your last name' }).click()
		await page.getByRole('textbox', { name: 'Enter your last name' }).fill('Doe')

		await page.getByRole('textbox', { name: 'Enter your email' }).click()
		await page.getByRole('textbox', { name: 'Enter your email' }).fill('user@example.com')

		await page.getByRole('textbox', { name: 'Enter your password', exact: true }).click()
		await page
			.getByRole('textbox', { name: 'Enter your password', exact: true })
			.fill('password')

		await page.getByRole('textbox', { name: 'Re-enter your password' }).click()
		await page.getByRole('textbox', { name: 'Re-enter your password' }).fill('password')

		await page.getByRole('checkbox', { name: 'I accept terms and conditions' }).click()

		await page.getByRole('button', { name: 'Continue' }).click()

		await page.getByRole('textbox', { name: 'Enter your phone number' }).click()
		await page
			.getByRole('textbox', { name: 'Enter your phone number' })
			.fill('81234567890')

		await page.getByRole('combobox').click()
		await page.getByRole('option', { name: 'Русский' }).click()

		await page.getByRole('button').filter({ hasText: /^$/ }).nth(5).click() // TODO: find better selector for this button

		await page.getByRole('button', { name: 'Продолжить' }).click()

		await page.waitForTimeout(3000)
		const verificationCode = await getVerificationCode()

		await page.getByRole('textbox', { name: 'Код подтверждения' }).click()
		await page.getByRole('textbox', { name: 'Код подтверждения' }).fill(verificationCode)

		await expect(page).toHaveURL(/dashboard/)
	})
})
