import 'dotenv/config'
import { defineConfig } from '@playwright/test'

export default defineConfig({
	testDir: './tests',
	timeout: 30000,
	retries: 0,
	use: {
		baseURL: process.env.WEB_URL,
		trace: 'on-first-retry',
	},
	reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
})
