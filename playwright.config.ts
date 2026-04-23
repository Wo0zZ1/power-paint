import 'dotenv/config'
import { defineConfig } from '@playwright/test'

export default defineConfig({
	testDir: './tests',
	timeout: 30000,
	retries: 0,
	use: {
		baseURL:
			`http://${process.env.WEB_HOST}:${process.env.WEB_PORT}` || 'http://web:3000',
		trace: 'on-first-retry',
	},
	reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
})
