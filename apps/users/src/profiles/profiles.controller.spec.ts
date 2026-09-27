import { BadRequestException, UnauthorizedException } from '@nestjs/common'

import { ProfilesController } from './profiles.controller'

const build = () => {
	const profiles = {
		getMany: jest.fn().mockResolvedValue([]),
		search: jest.fn().mockResolvedValue([]),
	}

	return { controller: new ProfilesController(profiles as never), profiles }
}

describe('ProfilesController', () => {
	test('Поиск без входа должен отказывать - иначе любой выгрузит адреса пользователей', () => {
		const { controller, profiles } = build()

		expect(() => controller.list(undefined, 'a', 20)).toThrow(
			UnauthorizedException,
		)
		expect(profiles.search).not.toHaveBeenCalled()
	})

	test('Должен отклонять неположительный limit', () => {
		const { controller } = build()

		expect(() => controller.list(undefined, 'a', -5, 'user-1')).toThrow(
			BadRequestException,
		)
	})

	test('Пачка по ids остаётся доступной без входа - ей пользуется boards', () => {
		const { controller, profiles } = build()

		controller.list('user-1,user-2', undefined, 20)

		expect(profiles.getMany).toHaveBeenCalledWith(['user-1', 'user-2'])
	})
})
