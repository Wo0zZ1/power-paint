import type { IncomingMessage, Server } from 'node:http'
import type { Socket } from 'node:net'

import { createProxyMiddleware } from 'http-proxy-middleware'

import { USER_ID_HEADER } from './identity.middleware'

/**
 * Proxies collab traffic. Upgrades are routed only through `attachUpgrade`, so the
 * identity is set before the socket reaches collab.
 *
 * @param target collab service URL
 * @param identify sets the identity headers on the upgrade request
 * @returns the HTTP middleware and the hook that wires upgrades to the server
 */
export const createCollabProxy = ({
	target,
	identify,
}: {
	target: string
	identify: (request: IncomingMessage) => Promise<void>
}) => {
	// ws: true не ставится намеренно: с ним прокси после первого же HTTP-запроса
	// сам подписывается на upgrade и пропускает сокет в collab раньше, чем
	// проверка сессии успевает проставить личность.
	const proxy = createProxyMiddleware({
		target,
		pathFilter: '/collab/**',
		changeOrigin: true,
		on: {
			proxyReqWs: (proxyReq, request) => {
				const userId = (request.headers as Record<string, string>)[USER_ID_HEADER]

				if (userId) proxyReq.setHeader(USER_ID_HEADER, userId)
			},
		},
	})

	const attachUpgrade = (server: Server) =>
		server.on('upgrade', async (request, socket, head) => {
			await identify(request)

			// Node типизирует сокет апгрейда как Duplex, но у HTTP-сервера это всегда net.Socket.
			proxy.upgrade(request, socket as Socket, head)
		})

	return { middleware: proxy, attachUpgrade }
}
