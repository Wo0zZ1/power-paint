import { BadRequestException, Injectable } from '@nestjs/common'

import { UsersClient } from '../clients/users.client'
import { CONFIG } from '../config'
import { EventsService } from '../events.service'
import { SessionService } from '../session/session.service'

import { OauthRepository } from './oauth.repository'
import { PROVIDERS } from './providers'
import type { OAuthProfile, OAuthProvider } from './providers'

interface TokenResponse {
	access_token?: string
}

@Injectable()
export class OauthService {
	constructor(
		private readonly accounts: OauthRepository,
		private readonly users: UsersClient,
		private readonly sessions: SessionService,
		private readonly events: EventsService,
	) {}

	getProvider(id: string): OAuthProvider {
		const provider = PROVIDERS[id]
		if (!provider) throw new BadRequestException('Unknown provider')

		return provider
	}

	buildAuthorizationUrl(provider: OAuthProvider, state: string) {
		const url = new URL(provider.authorizationUrl)

		url.searchParams.set('client_id', provider.clientId)
		url.searchParams.set('redirect_uri', this.callbackUrl(provider.id))
		url.searchParams.set('response_type', 'code')
		url.searchParams.set('scope', provider.scope)
		url.searchParams.set('state', state)

		return url.toString()
	}

	async signIn(provider: OAuthProvider, code: string) {
		const accessToken = await this.exchangeCode(provider, code)
		const profile = await provider.fetchProfile(accessToken)

		const userId = await this.resolveUser(provider.id, profile)

		return this.sessions.create(userId)
	}

	private async exchangeCode(provider: OAuthProvider, code: string) {
		const response = await fetch(provider.tokenUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json',
			},
			body: new URLSearchParams({
				client_id: provider.clientId,
				client_secret: provider.clientSecret,
				code,
				grant_type: 'authorization_code',
				redirect_uri: this.callbackUrl(provider.id),
			}),
		})

		if (!response.ok) throw new BadRequestException('Failed to exchange code')

		const { access_token: accessToken } = (await response.json()) as TokenResponse

		if (!accessToken) throw new BadRequestException('Provider returned no token')

		return accessToken
	}

	// Три случая: аккаунт уже привязан; есть пользователь с таким email, но без
	// привязки; пользователя нет вовсе. Привязка по совпадающему email допустима,
	// потому что оба провайдера отдают только подтверждённые адреса.
	private async resolveUser(providerId: string, profile: OAuthProfile) {
		const linked = await this.accounts.findAccount(
			providerId,
			profile.providerAccountId,
		)

		if (linked) return linked.userId

		const existing = await this.accounts.findUserByEmail(profile.email)

		if (existing) {
			await this.accounts.linkAccount(
				existing.id,
				providerId,
				profile.providerAccountId,
			)

			return existing.id
		}

		return this.createUser(providerId, profile)
	}

	private async createUser(providerId: string, profile: OAuthProfile) {
		const user = await this.accounts.createUser(profile.email)

		// Та же компенсация, что и при обычной регистрации: профиль в другом
		// сервисе, общей транзакции нет.
		try {
			await this.accounts.linkAccount(
				user.id,
				providerId,
				profile.providerAccountId,
			)

			await this.users.createProfile({
				userId: user.id,
				email: profile.email,
				name: profile.name,
				image: profile.image,
			})
		} catch (error) {
			await this.accounts.deleteUser(user.id)
			throw error
		}

		await this.events.userCreated({ userId: user.id, name: profile.name })

		return user.id
	}

	private callbackUrl(providerId: string) {
		return `${CONFIG.PUBLIC_BASE_URL}/api/auth/oauth/${providerId}/callback`
	}
}
