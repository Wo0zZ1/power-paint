import { expect, Page } from '@playwright/test'
import { describe } from 'node:test'

import { authedTest } from './fixtures'

describe('Board tests', () => {
	authedTest('Успешное взаимодействие с доской', async ({ page }) => {
		await page.goto('/boards/00000000-0000-0000-0000-000000000006')

		await expect(page.getByRole('status', { name: 'Connection status' })).toHaveText(
			'Connected',
			{
				timeout: 8000,
			},
		)

		const selectTool = page.getByLabel('Select')
		const handTool = page.getByLabel('Hand')
		const rectTool = page.getByLabel('Rectangle')
		const circleTool = page.getByLabel('Circle')
		const drawTool = page.getByLabel('Draw')
		const eraserTool = page.getByLabel('Eraser')
		const textTool = page.getByLabel('Text')

		const canvas = page.locator('canvas').first()
		await expect(canvas).toBeVisible()

		await page.mouse.move(400, 150)
		await expect(page.getByRole('button', { name: 'User avatar' }).nth(1)).toBeVisible()

		await page.waitForTimeout(500)
		await expect(canvas).toHaveScreenshot('empty-board.png')

		await rectTool.click()
		await page.mouse.move(400, 150)
		await page.mouse.down()
		await page.mouse.move(500, 250)
		await page.mouse.up()

		await page.waitForTimeout(500)
		await expect(canvas).toHaveScreenshot('board-with-rectangle.png')

		await circleTool.click()
		await page.mouse.move(550, 150)
		await page.mouse.down()
		await page.mouse.move(600, 250)
		await page.mouse.up()

		await page.waitForTimeout(500)
		await expect(canvas).toHaveScreenshot('board-with-circle.png')

		await drawTool.click()
		await page.mouse.move(400, 400)
		await page.mouse.down()
		await page.mouse.move(500, 300, { steps: 25 })
		await page.mouse.move(600, 400, { steps: 25 })
		await page.mouse.move(400, 400, { steps: 25 })
		await page.mouse.up()

		await page.waitForTimeout(500)
		await expect(canvas).toHaveScreenshot('board-with-draw.png')

		await textTool.click()
		await page.mouse.move(700, 150)
		await page.mouse.down()
		await page.mouse.move(900, 250)
		await page.mouse.up()
		await page.mouse.dblclick(800, 200)
		await page.locator('textarea').fill('Hello, Power Paint!')

		await page.waitForTimeout(500)
		await expect(canvas).toHaveScreenshot('board-with-text.png')

		await handTool.click()
		await page.mouse.move(500, 500)
		await page.mouse.down()
		await page.mouse.move(600, 600)
		await page.mouse.up()

		await page.waitForTimeout(500)
		await expect(canvas).toHaveScreenshot('board-with-hand.png')

		await selectTool.click()
		await page.mouse.move(350, 100)
		await page.mouse.down()
		await page.mouse.move(1100, 700)
		await page.mouse.up()

		await page.waitForTimeout(500)
		await expect(canvas).toHaveScreenshot('board-with-select.png')

		await page.keyboard.press('Backspace')

		await page.waitForTimeout(500)
		await expect(canvas).toHaveScreenshot('empty-board.png')

		await rectTool.click()
		await page.mouse.move(400, 150)
		await page.mouse.down()
		await page.mouse.move(500, 250)
		await page.mouse.up()

		await page.waitForTimeout(500)
		await expect(canvas).toHaveScreenshot('board-with-rectangle.png')

		await eraserTool.click()
		await page.mouse.move(350, 100)
		await page.mouse.down()
		await page.mouse.move(450, 200, { steps: 25 })
		await page.mouse.up()

		await page.waitForTimeout(500)
		await expect(canvas).toHaveScreenshot('empty-board.png')
	})
})
