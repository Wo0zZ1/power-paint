import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import type { PublicUser } from '@power-paint/contracts'

import { CONFIG } from '../config'

@Injectable()
export class UsersClient {
	// Один запрос на весь список участников вместо запроса на каждого.
	// При недоступности users запрос падает, а не отдаёт список без имён:
	// придумывать данные или молча терять участников хуже, чем честная ошибка.
	async getMany(userIds: string[]): Promise<Map<string, PublicUser>> {
		if (userIds.length === 0) return new Map()

		const url = `${CONFIG.USERS_SERVICE_URL}/api/users?ids=${userIds.join(',')}`

		const response = await fetch(url).catch(() => null)

		if (!response?.ok)
			throw new ServiceUnavailableException('Failed to load user profiles')

		const profiles = (await response.json()) as PublicUser[]

		return new Map(profiles.map(profile => [profile.id, profile]))
	}
}
