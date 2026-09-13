import { createHash, scrypt } from 'node:crypto'
import type { ScryptOptions } from 'node:crypto'
import { promisify } from 'node:util'

import { hashPassword, hashValue, verifyPassword } from './hash'

const derive = promisify(scrypt) as (
	password: string,
	salt: Buffer,
	keylen: number,
	options: ScryptOptions,
) => Promise<Buffer>

const legacyHash = (value: string) =>
	createHash('sha256').update(value).digest('hex')

describe('password hashing', () => {
	test('Должен принимать пароль, захешированный этой же функцией', async () => {
		const stored = await hashPassword('correct horse battery staple')

		await expect(
			verifyPassword('correct horse battery staple', stored),
		).resolves.toEqual({ ok: true, needsRehash: false })
	})

	test('Должен отвергать неверный пароль', async () => {
		const stored = await hashPassword('correct horse battery staple')

		await expect(verifyPassword('wrong password', stored)).resolves.toEqual({
			ok: false,
			needsRehash: false,
		})
	})

	test('Должен давать разные хеши одному паролю - соль случайная', async () => {
		const first = await hashPassword('same password')
		const second = await hashPassword('same password')

		expect(first).not.toBe(second)
	})

	test('Должен хранить параметры в самом хеше', async () => {
		const stored = await hashPassword('any')

		expect(stored.startsWith('scrypt$65536$8$2$')).toBe(true)
		expect(stored.split('$')).toHaveLength(6)
	})

	test('Должен принимать старый sha256-хеш и требовать перехеширования', async () => {
		await expect(
			verifyPassword('old password', legacyHash('old password')),
		).resolves.toEqual({ ok: true, needsRehash: true })
	})

	test('Не должен требовать перехеширования при неверном старом пароле', async () => {
		await expect(
			verifyPassword('wrong', legacyHash('old password')),
		).resolves.toEqual({ ok: false, needsRehash: false })
	})

	test('Должен требовать перехеширования при устаревших параметрах', async () => {
		const salt = Buffer.from('0123456789abcdef')
		const key = await derive('weak params', salt, 64, { N: 16384, r: 8, p: 1 })

		const stored = [
			'scrypt',
			16384,
			8,
			1,
			salt.toString('base64'),
			key.toString('base64'),
		].join('$')

		await expect(verifyPassword('weak params', stored)).resolves.toEqual({
			ok: true,
			needsRehash: true,
		})
	})

	test('Должен отвергать хеш с неизвестным алгоритмом', async () => {
		await expect(verifyPassword('any', 'bcrypt$10$salt$hash')).resolves.toEqual({
			ok: false,
			needsRehash: false,
		})
	})
})

describe('one-time code hashing', () => {
	// Коды остаются на быстром хеше намеренно: они живут 15 минут,
	// одноразовые и ограничены числом попыток.
	test('Должен давать один и тот же хеш одному коду', () => {
		expect(hashValue('123456')).toBe(hashValue('123456'))
	})
})
