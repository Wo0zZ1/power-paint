import test, { expect, Page } from '@playwright/test'
import { describe } from 'node:test'
import { getVerificationCode } from '../email/mailhog'

async function login(page: Page, email = 'Mper06@mail.ru', password = 'qweqwe') {
	await page.goto('/signin')

	await page.getByRole('textbox', { name: 'Email' }).click()
	await page.getByRole('textbox', { name: 'Email' }).fill(email)

	await page.getByRole('textbox', { name: 'Password' }).click()
	await page.getByRole('textbox', { name: 'Password' }).fill(password)

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

	test('Неверный код подтверждения при регистрации', async ({ page }) => {
		await page.goto('signup')

		await expect(page.getByRole('heading')).toContainText(/Create an account/i)

		await page.getByRole('textbox', { name: 'Enter your first name' }).click()
		await page.getByRole('textbox', { name: 'Enter your first name' }).fill('John')

		await page.getByRole('textbox', { name: 'Enter your last name' }).click()
		await page.getByRole('textbox', { name: 'Enter your last name' }).fill('Doe')

		await page.getByRole('textbox', { name: 'Enter your email' }).click()
		await page
			.getByRole('textbox', { name: 'Enter your email' })
			.fill('user1@example.com')

		await page.getByRole('textbox', { name: 'Enter your password', exact: true }).click()
		await page
			.getByRole('textbox', { name: 'Enter your password', exact: true })
			.fill('password')

		await page.getByRole('textbox', { name: 'Re-enter your password' }).click()
		await page.getByRole('textbox', { name: 'Re-enter your password' }).fill('password')

		await page.getByRole('checkbox', { name: 'I accept terms and conditions' }).click()

		await page.getByRole('button', { name: 'Continue' }).click()

		await page.getByRole('button', { name: 'Continue' }).click()
		await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled()

		for (let i = 1; i <= 4; i++) {
			await page.getByRole('textbox', { name: 'Verification Code' }).fill('111111')
			await page.waitForTimeout(100)
			await expect(page.getByRole('button', { name: /Sign Up/i })).not.toBeDisabled()
			await expect(page.getByText(/Invalid verification code/i)).toBeVisible()
		}
		await page.getByRole('textbox', { name: 'Verification Code' }).fill('111111')
		await page.waitForTimeout(100)
		await expect(page.getByRole('button', { name: /Sign Up/i })).not.toBeDisabled()
		await expect(page.getByText(/Too many attempts/i)).toBeVisible()

		await page.waitForTimeout(3000)
		const verificationCode = await getVerificationCode('Verify your email')

		await page.getByRole('textbox', { name: 'Verification Code' }).click()
		await page.getByRole('textbox', { name: 'Verification Code' }).fill(verificationCode)

		await expect(page.getByRole('button', { name: /Sign Up/i })).not.toBeDisabled()
		await expect(page.getByText(/Too many attempts/i)).toBeVisible()
	})

	test('Успешная регистрация с переотправкой кода', async ({ page }) => {
		await page.goto('signup')

		await expect(page.getByRole('heading')).toContainText(/Create an account/i)

		await page.getByRole('textbox', { name: 'Enter your first name' }).click()
		await page.getByRole('textbox', { name: 'Enter your first name' }).fill('John')

		await page.getByRole('textbox', { name: 'Enter your last name' }).click()
		await page.getByRole('textbox', { name: 'Enter your last name' }).fill('Doe')

		await page.getByRole('textbox', { name: 'Enter your email' }).click()
		await page
			.getByRole('textbox', { name: 'Enter your email' })
			.fill('user2@example.com')

		await page.getByRole('textbox', { name: 'Enter your password', exact: true }).click()
		await page
			.getByRole('textbox', { name: 'Enter your password', exact: true })
			.fill('password')

		await page.getByRole('textbox', { name: 'Re-enter your password' }).click()
		await page.getByRole('textbox', { name: 'Re-enter your password' }).fill('password')

		await page.getByRole('checkbox', { name: 'I accept terms and conditions' }).click()

		await page.getByRole('button', { name: 'Continue' }).click()

		await page.getByRole('button', { name: 'Continue' }).click()
		await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled()

		await page.getByRole('textbox', { name: 'Verification Code' }).click()
		await page.getByRole('textbox', { name: 'Verification Code' }).fill('111111')

		await expect(page.getByRole('button', { name: /Sign Up/i })).toBeDisabled()

		await expect(page.getByText(/Invalid verification code./i)).toBeVisible()

		await page.getByRole('button', { name: 'Resend Code' }).click()

		await expect(page.getByText(/Invalid verification code./i)).not.toBeVisible()

		await page.waitForTimeout(3000)
		const verificationCode = await getVerificationCode('Verify your email')

		await page.getByRole('textbox', { name: 'Verification Code' }).click()
		await page.getByRole('textbox', { name: 'Verification Code' }).fill(verificationCode)

		await expect(page).toHaveURL(/dashboard/)
	})

	test('Успешная регистрация', async ({ page }) => {
		await page.goto('signup')

		await expect(page.getByRole('heading')).toContainText(/Create an account/i)

		await page.getByRole('textbox', { name: 'Enter your first name' }).click()
		await page.getByRole('textbox', { name: 'Enter your first name' }).fill('John')

		await page.getByRole('textbox', { name: 'Enter your last name' }).click()
		await page.getByRole('textbox', { name: 'Enter your last name' }).fill('Doe')

		await page.getByRole('textbox', { name: 'Enter your email' }).click()
		await page
			.getByRole('textbox', { name: 'Enter your email' })
			.fill('user3@example.com')

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

		await expect(page.getByRole('heading')).toContainText(/Создайте аккаунт/i)

		await page.getByRole('button').nth(6).click() // TODO: find better selector for this button

		await page.getByRole('button', { name: 'Продолжить' }).click()
		await expect(page.getByRole('button', { name: 'Продолжить' })).toBeDisabled()

		await page.waitForTimeout(3000)
		const verificationCode = await getVerificationCode('Verify your email')

		await page.getByRole('textbox', { name: 'Код подтверждения' }).click()
		await page.getByRole('textbox', { name: 'Код подтверждения' }).fill(verificationCode)

		await expect(page.getByRole('button', { name: /Зарегистрироваться/i })).toBeDisabled()

		await expect(page).toHaveURL(/dashboard/)
	})

	test('Успешное восстановление пароля', async ({ page }) => {
		await page.goto('/reset-password')

		await page.getByRole('textbox', { name: 'Email' }).click()
		await page.getByRole('textbox', { name: 'Email' }).fill('alexey@example.com')

		await page.getByRole('button', { name: 'Send code' }).click()

		await page.waitForTimeout(3000)
		const verificationCode = await getVerificationCode('Reset your password')

		await page.getByRole('textbox', { name: 'Verification Code' }).click()
		await page.getByRole('textbox', { name: 'Verification Code' }).fill(verificationCode)

		await page.getByRole('textbox', { name: 'Password', exact: true }).click()
		await page.getByRole('textbox', { name: 'Password', exact: true }).fill('password')

		await page.getByRole('textbox', { name: 'Confirm Password' }).click()
		await page
			.getByRole('textbox', { name: 'Confirm Password' })
			.fill('password_not_match')

		await page.getByRole('button', { name: 'Save new password' }).click()

		await expect(page.getByText('Passwords do not match.')).toBeVisible()

		await page.getByRole('textbox', { name: 'Confirm Password' }).click()
		await page.getByRole('textbox', { name: 'Confirm Password' }).fill('password')

		await page.getByRole('button', { name: 'Save new password' }).click()

		await expect(page).toHaveURL('/signin')

		await login(page, 'alexey@example.com', 'password')

		await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible()

		await page.getByRole('button', { name: 'User avatar' }).click()

		const userMenu = page.getByRole('menu', { name: 'User avatar' })

		await expect(userMenu).toBeVisible()

		await expect(userMenu.getByText('alexey@example.com')).toBeVisible()
	})
})
