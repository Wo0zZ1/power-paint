import { randomInt } from 'node:crypto'

import { generateCode } from './code'

jest.mock('node:crypto', () => ({
	...jest.requireActual('node:crypto'),
	randomInt: jest.fn(),
}))

describe('generateCode', () => {
	test('Должен брать код из криптографического генератора, а не из Math.random', () => {
		;(randomInt as unknown as jest.Mock).mockReturnValue(123456)

		expect(generateCode()).toBe('123456')
		expect(randomInt).toHaveBeenCalledWith(100000, 1000000)
	})
})
