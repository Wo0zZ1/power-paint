import { Injectable, InternalServerErrorException } from '@nestjs/common'
import type { Locale } from '@power-paint/db'

import { CONFIG } from '../config'

interface CreateProfilePayload {
	userId: string
	email: string
	name: string
	image?: string | null
	phone?: string | null
	locale?: Locale
	preferredColor?: string
}

@Injectable()
export class UsersClient {
	private url(path: string) {
		return `${CONFIG.USERS_SERVICE_URL}${path}`
	}

	async createProfile(payload: CreateProfilePayload) {
		const response = await fetch(this.url('/internal/profiles'), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		})

		if (!response.ok)
			throw new InternalServerErrorException('Failed to create profile')
	}

	// Компенсация при откате регистрации: ошибка намеренно проглатывается,
	// иначе сбой уборки перекроет исходную причину отказа.
	async deleteProfile(userId: string) {
		try {
			await fetch(this.url(`/internal/profiles/${userId}`), { method: 'DELETE' })
		} catch (error) {
			console.error('Failed to delete profile during rollback:', error)
		}
	}
}
