import 'dotenv/config'
import { defineConfig } from '@playwright/test'

export default defineConfig({
	testDir: './src/tests',
	timeout: 30000,
	retries: 0,
	use: {
		baseURL: process.env.WEB_URL,
		trace: 'on-first-retry',
		permissions: ['clipboard-read', 'clipboard-write'],
	},
	reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
})
