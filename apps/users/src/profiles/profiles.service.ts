import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import type { PublicUser } from '@power-paint/contracts'
import type { Profile } from '@power-paint/db'

import { ProfileRepository } from './profile.repository'
import type { CreateProfileDto, UpdateProfileDto } from './profile.dto'

const toPublicUser = ({
	userId,
	name,
	image,
	email,
	created_at,
}: Profile): PublicUser => ({ id: userId, name, image, email, created_at })

@Injectable()
export class ProfilesService {
	constructor(private readonly profiles: ProfileRepository) {}

	async getOne(userId: string): Promise<PublicUser> {
		const profile = await this.profiles.findById(userId)
		if (!profile) throw new NotFoundException('Profile not found')

		return toPublicUser(profile)
	}

	// Пачкой, а не по одному: boards обогащает списки участников одним запросом.
	async getMany(userIds: string[]): Promise<PublicUser[]> {
		const profiles = await this.profiles.findManyByIds(userIds)

		return profiles.map(toPublicUser)
	}

	async search(query: string, limit: number): Promise<PublicUser[]> {
		const profiles = await this.profiles.search(query, limit)

		return profiles.map(toPublicUser)
	}

	async create(data: CreateProfileDto): Promise<PublicUser> {
		const profile = await this.profiles.create(data)

		return toPublicUser(profile)
	}

	async update(
		userId: string,
		actorId: string,
		data: UpdateProfileDto,
	): Promise<PublicUser> {
		if (userId !== actorId) throw new ForbiddenException()

		const profile = await this.profiles.update(userId, data)

		return toPublicUser(profile)
	}
}
