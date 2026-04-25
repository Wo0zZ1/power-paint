import { expect, test as setup } from '@playwright/test'
import path from 'path'

const authFile = path.join(__dirname, '../../playwright/.auth/user1.json')

setup('authenticate', async ({ page }) => {
	await page.goto('/signin')

	await page.getByRole('textbox', { name: 'Email' }).click()
	await page.getByRole('textbox', { name: 'Email' }).fill('Mper06@mail.ru')

	await page.getByRole('textbox', { name: 'Password' }).click()
	await page.getByRole('textbox', { name: 'Password' }).fill('qweqwe')

	await page.locator('form').getByRole('button', { name: 'Sign In', exact: true }).click()

	await page.waitForURL(/dashboard/)

	await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible()

	await page.context().storageState({ path: authFile })
})
