import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import type { ScryptOptions } from 'node:crypto'
import { promisify } from 'node:util'

// promisify выбирает перегрузку без options, поэтому тип задаётся явно.
const derive = promisify(scrypt) as (
	password: string,
	salt: Buffer,
	keylen: number,
	options: ScryptOptions,
) => Promise<Buffer>

// Параметры по рекомендации OWASP. Память считается как 128 * N * r байт,
// то есть 64 МБ - поэтому maxmem задаётся явно: по умолчанию Node разрешает
// 32 МБ и падает с ошибкой.
const PARAMS = { N: 65536, r: 8, p: 2 } as const
const MAX_MEM = 256 * 1024 * 1024
const KEY_LENGTH = 64
const SALT_LENGTH = 16
const PREFIX = 'scrypt'

// Хеши, созданные до перехода на scrypt: голый sha256 в hex.
const LEGACY_PATTERN = /^[0-9a-f]{64}$/

// Пароль и одноразовый код защищаются по-разному, и это намеренно.
// Пароль живёт годами и обычно повторяется на других сайтах - ему нужны соль
// и медленная функция. Код из письма живёт 15 минут, одноразовый и ограничен
// пятью попытками, так что стоимость перебора там задаёт не хеш.
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

export const hashPassword = async (password: string): Promise<string> => {
	const salt = randomBytes(SALT_LENGTH)

	const key = await derive(password, salt, KEY_LENGTH, {
		...PARAMS,
		maxmem: MAX_MEM,
	})

	return [
		PREFIX,
		PARAMS.N,
		PARAMS.r,
		PARAMS.p,
		salt.toString('base64'),
		key.toString('base64'),
	].join('$')
}

export interface PasswordCheck {
	ok: boolean
	// Пароль верен, но лежит под устаревшими параметрами - вызывающий
	// перезаписывает его свежим хешем.
	needsRehash: boolean
}

export const verifyPassword = async (
	password: string,
	stored: string,
): Promise<PasswordCheck> => {
	if (LEGACY_PATTERN.test(stored)) {
		const ok = compareHash(password, stored)

		return { ok, needsRehash: ok }
	}

	const [prefix, n, r, p, salt, key] = stored.split('$')

	if (prefix !== PREFIX) return { ok: false, needsRehash: false }

	const expected = Buffer.from(key, 'base64')

	const actual = await derive(
		password,
		Buffer.from(salt, 'base64'),
		expected.length,
		{ N: Number(n), r: Number(r), p: Number(p), maxmem: MAX_MEM },
	)

	const ok =
		actual.length === expected.length && timingSafeEqual(actual, expected)

	const outdated =
		Number(n) !== PARAMS.N || Number(r) !== PARAMS.r || Number(p) !== PARAMS.p

	return { ok, needsRehash: ok && outdated }
}
