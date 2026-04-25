import { expect, Page } from '@playwright/test'
import { describe } from 'node:test'

import { authedTest } from './fixtures'

function generateRandomBoardName() {
	return `Board ${Math.random().toString(36).substring(2, 8)}`
}

async function createBoard(page: Page, name: string) {
	await page.goto('/dashboard')

	await page.getByRole('button', { name: 'Create' }).nth(1).click()

	await page.getByRole('textbox', { name: 'Board Name' }).click()
	await page.getByRole('textbox', { name: 'Board Name' }).fill(name)

	await page.getByRole('button', { name: 'Create' }).click()

	await expect(page).toHaveURL(/\/boards\/[a-f0-9-]+/)
}

async function getBoardCardByName(page: Page, name: string) {
	return page.getByRole('article').filter({ has: page.getByText(name, { exact: true }) })
}

describe('Board tests', () => {
	authedTest('Успешное создание доски', async ({ page }) => {
		const boardName = generateRandomBoardName()
		await createBoard(page, boardName)

		await page.goto('/dashboard')

		const boardCard = await getBoardCardByName(page, boardName)
		await expect(boardCard).toBeVisible()
	})

	authedTest('Успешное удаление доски', async ({ page }) => {
		const boardName = generateRandomBoardName()
		await createBoard(page, boardName)

		await page.goto('/dashboard')

		const boardCard = await getBoardCardByName(page, boardName)

		await boardCard.getByRole('button', { name: 'Board Settings' }).first().click()
		await expect(page.getByRole('menu', { name: 'Board Settings' })).toBeVisible()

		await page.getByRole('menuitem', { name: 'Delete' }).click()

		await expect(page.getByRole('dialog', { name: 'Delete Board' })).toBeVisible()
		await expect(page.locator('label')).toContainText(`To confirm, enter "${boardName}"`)

		await expect(page.getByRole('button', { name: 'Confirm' })).toBeDisabled()

		await page.getByRole('textbox', { name: 'To confirm, enter' }).click()
		await page.getByRole('textbox', { name: 'To confirm, enter' }).fill(boardName)

		await expect(page.getByRole('button', { name: 'Confirm' })).not.toBeDisabled()

		await page.getByRole('button', { name: 'Confirm' }).click()

		await expect(page.getByRole('dialog', { name: 'Delete Board' })).not.toBeVisible()
		await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible()
		await expect(boardCard).not.toBeVisible()
	})

	authedTest('Успешное изменение имени доски', async ({ page }) => {
		const boardName1 = generateRandomBoardName()
		const boardName2 = generateRandomBoardName()
		await createBoard(page, boardName1)

		await page.goto('/dashboard')

		const boardCard = await getBoardCardByName(page, boardName1)

		await boardCard.getByRole('button', { name: 'Board Settings' }).first().click()
		await expect(page.getByRole('menu', { name: 'Board Settings' })).toBeVisible()

		await page.getByRole('menuitem', { name: 'Rename' }).click()

		const dialog = page.getByRole('dialog', { name: 'Rename Board' })
		await expect(dialog).toBeVisible()

		await expect(page.getByRole('button', { name: 'Rename' })).toBeDisabled()

		await page.getByRole('textbox', { name: 'Board Name' }).click()
		await page.getByRole('textbox', { name: 'Board Name' }).fill(boardName2)

		await expect(page.getByRole('button', { name: 'Rename' })).not.toBeDisabled()

		await page.getByRole('button', { name: 'Rename' }).click()

		await expect(dialog).not.toBeVisible()
		await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible()
		await expect(boardCard).not.toBeVisible()

		const newBoardCard = await getBoardCardByName(page, boardName2)
		await expect(newBoardCard).toBeVisible()
	})

	authedTest('Успешное изменение доступа к доске', async ({ page }) => {
		const boardName = generateRandomBoardName()
		await createBoard(page, boardName)

		await page.goto('/dashboard')

		const boardCard = await getBoardCardByName(page, boardName)

		await boardCard.getByRole('button', { name: 'Board Settings' }).first().click()
		await expect(page.getByRole('menu', { name: 'Board Settings' })).toBeVisible()

		await page.getByRole('menuitem', { name: 'Share' }).click()

		const dialog = page.getByRole('dialog', { name: 'Share board' })
		await expect(dialog).toBeVisible()

		await expect(page.getByRole('button', { name: 'Save Changes' })).toBeDisabled()

		const url = await page.getByText('http://localhost/boards/').textContent()
		expect(url).toMatch(/http:\/\/localhost\/boards\/[a-f0-9-]+/)

		await page
			.getByRole('group')
			.filter({ hasText: 'http://localhost/boards/' })
			.getByRole('button')
			.click()

		const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
		expect(clipboardText).toBe(url)

		await page.getByRole('combobox').filter({ hasText: 'Private' }).click()
		await page.getByRole('option', { name: 'Viewing' }).click()

		await expect(page.getByRole('button', { name: 'Save Changes' })).not.toBeDisabled()

		await page.getByRole('combobox', { name: 'Add team members by username' }).click()

		const listbox = page.getByRole('listbox')
		await expect(listbox).toBeVisible()

		const user = await listbox.getByRole('option').nth(1)
		const userName = await user.textContent()
		expect(userName).not.toBeNull()
		await user.click()

		const selectedUsers = page.getByRole('list')
		await expect(selectedUsers).toBeVisible()

		const selectedUser = selectedUsers
			.getByRole('listitem')
			.filter({ hasText: userName! })
		await expect(selectedUser).toBeVisible()
		await expect(
			selectedUser.getByRole('combobox').filter({ hasText: 'Viewer' }),
		).toBeVisible()

		await page.getByRole('button', { name: 'Save Changes' }).click()

		await expect(dialog).not.toBeVisible()
	})
})
