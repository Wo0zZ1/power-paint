import type { AddressInfo } from 'node:net'

import { Module } from '@nestjs/common'
import type { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { PreviewController } from './preview.controller'
import { PreviewService } from './preview.service'

const PNG_BYTES = Buffer.from([0x89, 0x50, 0x4e, 0x47])

describe('PreviewController', () => {
	let app: INestApplication
	let baseUrl: string

	beforeAll(async () => {
		@Module({
			controllers: [PreviewController],
			providers: [
				{
					provide: PreviewService,
					useValue: {
						get: async () => ({ contentType: 'image/png', body: PNG_BYTES }),
					},
				},
			],
		})
		class TestModule {}

		app = await NestFactory.create(TestModule, { logger: false })
		await app.listen(0)

		const { port } = app.getHttpServer().address() as AddressInfo
		baseUrl = `http://127.0.0.1:${port}`
	})

	afterAll(() => app.close())

	test('Снимок уходит байтами картинки, а не JSON - иначе браузер не покажет превью', async () => {
		const response = await fetch(`${baseUrl}/api/boards/b1/preview`)

		expect(response.headers.get('content-type')).toContain('image/png')
		expect(Buffer.from(await response.arrayBuffer())).toEqual(PNG_BYTES)
	})
})
