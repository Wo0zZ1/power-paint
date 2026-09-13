import { test } from '@playwright/test'
import path from 'node:path'

const authFile = path.join(__dirname, '../../playwright/.auth/user1.json')

export const authedTest = test.extend({
	page: async ({ browser }, use) => {
		const context = await browser.newContext({ storageState: authFile })
		const page = await context.newPage()

		await use(page)

		await page.close()
		await context.close()
	},
})
