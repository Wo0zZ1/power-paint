import { createHash, timingSafeEqual } from 'node:crypto'

export const hashValue = (value: string) =>
	createHash('sha256').update(value).digest('hex')

// Сравнение постоянного времени: обычное === на хешах даёт утечку по времени,
// пусть и слабую.
export const compareHash = (value: string, hash: string) => {
	const actual = Buffer.from(hashValue(value), 'hex')
	const expected = Buffer.from(hash, 'hex')

	if (actual.length !== expected.length) return false

	return timingSafeEqual(actual, expected)
}
