import 'dotenv/config'
import { defineConfig } from '@playwright/test'

export default defineConfig({
	testDir: './src/tests',
	timeout: 20000,
	retries: 2,
	workers: 1,
	use: {
		navigationTimeout: 5000,
		baseURL: process.env.WEB_URL,
		trace: 'on-all-retries',
		permissions: ['clipboard-read', 'clipboard-write'],
	},
	reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
})
