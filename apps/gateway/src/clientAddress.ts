import type { Request } from 'express'

import { CONFIG } from './config'

const normalize = (address: string) => address.replace(/^::ffff:/, '')

// X-Forwarded-For подделывается тривиально, поэтому он учитывается только когда
// запрос пришёл с доверенного адреса - от nginx или от контейнера Web,
// который ходит в API при серверном рендеринге.
export const clientAddress = (request: Request): string => {
	const direct = normalize(request.socket.remoteAddress ?? '')

	if (!CONFIG.TRUSTED_PROXIES.includes(direct)) return direct

	const forwarded = request.header('x-forwarded-for')

	if (!forwarded) return direct

	return normalize(forwarded.split(',')[0].trim())
}
