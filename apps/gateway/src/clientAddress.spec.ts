import type { Request } from 'express'

import { clientAddress } from './clientAddress'

const request = (remoteAddress: string, forwardedFor?: string) =>
	({
		socket: { remoteAddress },
		header: (name: string) =>
			name === 'x-forwarded-for' ? forwardedFor : undefined,
	}) as unknown as Request

describe('clientAddress', () => {
	test('Адрес недоверенного клиента берётся из сокета, X-Forwarded-For игнорируется', () => {
		expect(clientAddress(request('203.0.113.9', '1.1.1.1'))).toBe('203.0.113.9')
	})

	test('От доверенного прокси берётся первый адрес из X-Forwarded-For', () => {
		expect(clientAddress(request('10.0.0.1', '203.0.113.9, 10.0.0.1'))).toBe(
			'203.0.113.9',
		)
	})

	test('Доверенный прокси без X-Forwarded-For остаётся собой', () => {
		expect(clientAddress(request('10.0.0.1'))).toBe('10.0.0.1')
	})

	test('Адреса IPv4 в форме IPv6 приводятся к обычному виду', () => {
		expect(clientAddress(request('::ffff:203.0.113.9'))).toBe('203.0.113.9')
	})

	test('Подделка X-Forwarded-For напрямую не проходит - это и есть защита лимитов', () => {
		expect(clientAddress(request('198.51.100.7', '10.0.0.1'))).toBe('198.51.100.7')
	})

	test('Доверенная подсеть покрывает любой адрес внутри неё', () => {
		expect(clientAddress(request('172.18.0.7', '203.0.113.9'))).toBe('203.0.113.9')
	})

	test('Адрес вне доверенной подсети остаётся собой', () => {
		expect(clientAddress(request('172.19.0.7', '203.0.113.9'))).toBe('172.19.0.7')
	})
})
