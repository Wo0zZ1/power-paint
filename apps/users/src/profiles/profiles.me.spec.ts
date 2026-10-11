import type { AddressInfo } from 'node:net'

import { Module } from '@nestjs/common'
import type { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { ProfilesController } from './profiles.controller'
import { ProfilesService } from './profiles.service'

const OWN_PROFILE = { id: 'user-1', name: 'Анна', phone: '+70000000000', locale: 'ru' }

describe('ProfilesController: свой профиль', () => {
	let app: INestApplication
	let baseUrl: string
	const profiles = {
		getOwn: jest.fn().mockResolvedValue(OWN_PROFILE),
		getOne: jest.fn().mockResolvedValue({ id: 'me' }),
	}

	beforeAll(async () => {
		@Module({
			controllers: [ProfilesController],
			providers: [{ provide: ProfilesService, useValue: profiles }],
		})
		class TestModule {}

		app = await NestFactory.create(TestModule, { logger: false })
		await app.listen(0)

		const { port } = app.getHttpServer().address() as AddressInfo
		baseUrl = `http://127.0.0.1:${port}`
	})

	afterAll(() => app.close())

	test('Должен отдавать профиль вошедшего с телефоном и языком, а не искать пользователя с id «me»', async () => {
		const response = await fetch(`${baseUrl}/api/users/me`, {
			headers: { 'x-user-id': 'user-1' },
		})

		expect(await response.json()).toEqual(OWN_PROFILE)
		expect(profiles.getOwn).toHaveBeenCalledWith('user-1')
		expect(profiles.getOne).not.toHaveBeenCalled()
	})

	test('Без входа должен отвечать 401', async () => {
		const response = await fetch(`${baseUrl}/api/users/me`)

		expect(response.status).toBe(401)
	})
})
