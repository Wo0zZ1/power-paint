import { BadRequestException, Injectable } from '@nestjs/common'
import type { PublicUser } from '@power-paint/contracts'

import { UsersClient } from './clients/users.client'

interface Member {
	userId: string
}

@Injectable()
export class MembersService {
	constructor(private readonly users: UsersClient) {}

	// Профили запрашиваются один раз на весь набор, даже если участники пришли
	// из разных досок одной области - иначе получился бы N+1 по сети.
	async enrich<T extends Member>(
		groups: T[][],
	): Promise<(T & { user: PublicUser })[][]> {
		const userIds = [
			...new Set(groups.flat().map(member => member.userId)),
		]

		const profiles = await this.users.getMany(userIds)

		return groups.map(members =>
			members.flatMap(member => {
				const user = profiles.get(member.userId)

				// Профиля нет - участник удалён в users, но связь в boards осталась.
				// Показывать нечего, поэтому пропускаем.
				if (!user) return []

				return [{ ...member, user }]
			}),
		)
	}

	// Связи между схемами нет, поэтому существование пользователя проверяется
	// здесь: иначе участник-призрак остался бы в boards, а передача владения
	// несуществующему пользователю навсегда закрыла бы доску.
	async assertExist(userIds: string[]): Promise<void> {
		const unique = [...new Set(userIds)]

		const profiles = await this.users.getMany(unique)

		if (unique.some(userId => !profiles.has(userId)))
			throw new BadRequestException('errors.unknown_user')
	}
}
