import cookieParser from 'cookie-parser'
import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'

import { CONFIG } from './config'
import {
	attachIdentity,
	stripForgedIdentity,
	USER_ID_HEADER,
	USER_ROLE_HEADER,
} from './identity.middleware'
import { authRateLimit, generalRateLimit } from './rateLimit'
import { connectRedis } from './redis'

const app = express()

app.disable('x-powered-by')

app.use(stripForgedIdentity)
app.use(cookieParser())
app.use(attachIdentity)

// Прокси монтируются в корень с фильтром по пути: app.use('/api/users', ...)
// срезал бы префикс, и до сервиса дошёл бы путь без него.
const proxyTo = (target: string, pathFilter?: string | string[]) =>
	createProxyMiddleware({
		target,
		pathFilter,
		changeOrigin: true,
		on: {
			proxyReq: (proxyReq, request) => {
				const userId = request.headers[USER_ID_HEADER]
				const role = request.headers[USER_ROLE_HEADER]

				if (typeof userId === 'string') proxyReq.setHeader(USER_ID_HEADER, userId)
				if (typeof role === 'string') proxyReq.setHeader(USER_ROLE_HEADER, role)
			},
		},
	})

app.get('/healthz', (_, response) => response.json({ ok: true }))

// Вход и регистрация - отдельный, более жёсткий лимит: это поверхность брутфорса.
app.use('/api/auth', authRateLimit)
app.use(['/api/users', '/api/boards', '/api/workspaces'], generalRateLimit)

app.use(proxyTo(CONFIG.AUTH_SERVICE_URL, '/api/auth/**'))
app.use(proxyTo(CONFIG.USERS_SERVICE_URL, '/api/users/**'))
app.use(proxyTo(CONFIG.BOARDS_SERVICE_URL, ['/api/boards/**', '/api/workspaces/**']))

// Совместное редактирование: апгрейд до WebSocket пропускается только с личностью,
// права на конкретный документ проверяет сам collab по заголовку.
const collabProxy = createProxyMiddleware({
	target: CONFIG.COLLAB_SERVICE_URL,
	pathFilter: '/collab/**',
	changeOrigin: true,
	ws: true,
	on: {
		proxyReqWs: (proxyReq, request) => {
			const userId = (request.headers as Record<string, string>)[USER_ID_HEADER]

			if (userId) proxyReq.setHeader(USER_ID_HEADER, userId)
		},
	},
})

app.use('/collab', (request, response, next) => {
	if (!request.identity)
		return response.status(401).json({ message: 'Unauthorized' })

	return next()
})

app.use(collabProxy)

// Всё остальное - фронтенду. Он получает ту же личность, чтобы не разбирать куку
// самому при серверном рендеринге.
app.use(proxyTo(CONFIG.WEB_SERVICE_URL))

const server = app.listen(CONFIG.PORT, () => {
	console.log(`Gateway listening on ${CONFIG.PORT}`)
})

server.on('upgrade', collabProxy.upgrade)

void connectRedis()
