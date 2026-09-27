import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import { MAX_USERS_BATCH_SIZE } from '@power-paint/contracts'
import type { PublicUser } from '@power-paint/contracts'

import { CONFIG } from '../config'

@Injectable()
export class UsersClient {
	// Один запрос на весь список участников вместо запроса на каждого.
	// При недоступности users запрос падает, а не отдаёт список без имён:
	// придумывать данные или молча терять участников хуже, чем честная ошибка.
	async getMany(userIds: string[]): Promise<Map<string, PublicUser>> {
		if (userIds.length === 0) return new Map()

		const chunks = Array.from(
			{ length: Math.ceil(userIds.length / MAX_USERS_BATCH_SIZE) },
			(_, index) =>
				userIds.slice(
					index * MAX_USERS_BATCH_SIZE,
					(index + 1) * MAX_USERS_BATCH_SIZE,
				),
		)

		const profiles = await Promise.all(chunks.map(chunk => this.fetchChunk(chunk)))

		return new Map(profiles.flat().map(profile => [profile.id, profile]))
	}

	private async fetchChunk(userIds: string[]) {
		const url = `${CONFIG.USERS_SERVICE_URL}/api/users?ids=${userIds.join(',')}`

		const response = await fetch(url).catch(() => null)

		if (!response?.ok)
			throw new ServiceUnavailableException('Failed to load user profiles')

		return (await response.json()) as PublicUser[]
	}
}
