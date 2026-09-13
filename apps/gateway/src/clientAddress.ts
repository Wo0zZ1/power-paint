import type { Request } from 'express'

import { CONFIG } from './config'

const normalize = (address: string) => address.replace(/^::ffff:/, '')

const toInt = (address: string) =>
	address
		.split('.')
		.reduce((acc, part) => (acc << 8) + Number(part), 0) >>> 0

// Адреса контейнеров выдаёт Docker, и точный IP заранее неизвестен - поэтому
// доверенные записи допускают подсеть: и "10.0.0.5", и "172.18.0.0/16".
const matches = (address: string, trusted: string) => {
	if (!trusted.includes('/')) return address === trusted

	const [network, bits] = trusted.split('/')
	const mask = Number(bits) === 0 ? 0 : (-1 << (32 - Number(bits))) >>> 0

	return (toInt(address) & mask) === (toInt(network) & mask)
}

// X-Forwarded-For подделывается тривиально, поэтому он учитывается только когда
// запрос пришёл с доверенного адреса - от nginx или от контейнера Web,
// который ходит в API при серверном рендеринге.
export const clientAddress = (request: Request): string => {
	const direct = normalize(request.socket.remoteAddress ?? '')

	const isTrusted = CONFIG.TRUSTED_PROXIES.some(trusted =>
		matches(direct, trusted),
	)

	if (!isTrusted) return direct

	const forwarded = request.header('x-forwarded-for')

	if (!forwarded) return direct

	return normalize(forwarded.split(',')[0].trim())
}
