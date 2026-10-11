import { createServer, request as httpRequest } from 'node:http'
import type { IncomingMessage, Server } from 'node:http'
import type { AddressInfo } from 'node:net'

import express from 'express'

import { createCollabProxy } from './collabProxy'
import { USER_ID_HEADER } from './identity.middleware'

const listen = async (server: Server) => {
	server.listen(0)
	await new Promise(resolve => server.once('listening', resolve))

	return (server.address() as AddressInfo).port
}

// collab в миниатюре: запоминает, с какой личностью к нему пришёл апгрейд.
const startCollab = async () => {
	const identities: (string | undefined)[] = []
	const server = createServer()

	server.on('upgrade', (request: IncomingMessage, socket) => {
		identities.push(request.headers[USER_ID_HEADER] as string | undefined)
		socket.end('HTTP/1.1 101 Switching Protocols\r\n\r\n')
	})

	return { identities, port: await listen(server), server }
}

const startGateway = async (collabPort: number) => {
	const collab = createCollabProxy({
		target: `http://127.0.0.1:${collabPort}`,
		// Настоящая проверка сессии - сетевой запрос, и личность появляется не сразу.
		identify: async request => {
			await new Promise(resolve => setTimeout(resolve, INTROSPECT_DELAY_MS))
			request.headers[USER_ID_HEADER] = 'user-1'
		},
	})

	const app = express()
	app.use(collab.middleware)
	app.use((_, response) => {
		response.send('web')
	})

	const server = createServer(app)
	collab.attachUpgrade(server)

	return { port: await listen(server), server }
}

const UPGRADE_WAIT_MS = 1000
const INTROSPECT_DELAY_MS = 20

// Ответа на апгрейд может не быть вовсе - тогда ждём недолго и смотрим, что дошло до collab.
const upgrade = (port: number) =>
	new Promise<void>(resolve => {
		const request = httpRequest({
			port,
			path: '/collab',
			headers: { Connection: 'Upgrade', Upgrade: 'websocket' },
		})
		const done = () => {
			request.destroy()
			resolve()
		}

		request.on('upgrade', (_, socket) => {
			socket.destroy()
			done()
		})
		request.on('error', done)
		setTimeout(done, UPGRADE_WAIT_MS)
		request.end()
	})

const stop = (server: Server) => {
	server.closeAllConnections()
	server.close()
}

describe('collabProxy', () => {
	test('Апгрейд несёт личность и после обычных запросов через шлюз - иначе вошедший пользователь не откроет свою приватную доску', async () => {
		const collab = await startCollab()
		const gateway = await startGateway(collab.port)

		await fetch(`http://127.0.0.1:${gateway.port}/dashboard`)
		await upgrade(gateway.port)

		stop(gateway.server)
		stop(collab.server)

		expect(collab.identities).toEqual(['user-1'])
	})
})
