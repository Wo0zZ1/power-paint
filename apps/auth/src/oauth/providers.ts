import { CONFIG } from '../config'

export interface OAuthProfile {
	providerAccountId: string
	email: string
	name: string
	image?: string
}

export interface OAuthProvider {
	id: string
	authorizationUrl: string
	tokenUrl: string
	scope: string
	clientId: string
	clientSecret: string
	fetchProfile: (accessToken: string) => Promise<OAuthProfile>
}

const authorizedFetch = async <T>(url: string, accessToken: string) => {
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/json',
			'User-Agent': 'power-paint',
		},
	})

	if (!response.ok) throw new Error(`Failed to fetch ${url}`)

	return response.json() as Promise<T>
}

interface GoogleUserInfo {
	sub: string
	email: string
	email_verified?: boolean
	name?: string
	picture?: string
}

interface GithubUserInfo {
	id: number
	login: string
	name?: string
	avatar_url?: string
}

interface GithubEmail {
	email: string
	primary: boolean
	verified: boolean
}

const google: OAuthProvider = {
	id: 'google',
	authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
	tokenUrl: 'https://oauth2.googleapis.com/token',
	scope: 'openid email profile',
	clientId: CONFIG.AUTH_GOOGLE_ID,
	clientSecret: CONFIG.AUTH_GOOGLE_SECRET,
	async fetchProfile(accessToken) {
		const info = await authorizedFetch<GoogleUserInfo>(
			'https://openidconnect.googleapis.com/v1/userinfo',
			accessToken,
		)

		// Вход привязывается к учётной записи с тем же email, и неподтверждённый
		// адрес открыл бы чужую учётную запись.
		if (!info.email_verified) throw new Error('Google email is not verified')

		return {
			providerAccountId: info.sub,
			email: info.email.toLowerCase(),
			name: info.name ?? info.email,
			image: info.picture,
		}
	},
}

const github: OAuthProvider = {
	id: 'github',
	authorizationUrl: 'https://github.com/login/oauth/authorize',
	tokenUrl: 'https://github.com/login/oauth/access_token',
	scope: 'read:user user:email',
	clientId: CONFIG.AUTH_GITHUB_ID,
	clientSecret: CONFIG.AUTH_GITHUB_SECRET,
	async fetchProfile(accessToken) {
		const info = await authorizedFetch<GithubUserInfo>(
			'https://api.github.com/user',
			accessToken,
		)

		// GitHub не отдаёт email в профиле, если он скрыт в настройках -
		// приходится брать основной подтверждённый адрес отдельным запросом.
		const emails = await authorizedFetch<GithubEmail[]>(
			'https://api.github.com/user/emails',
			accessToken,
		)

		const primary = emails.find(item => item.primary && item.verified)

		if (!primary) throw new Error('No verified primary email on GitHub account')

		return {
			providerAccountId: String(info.id),
			email: primary.email.toLowerCase(),
			name: info.name ?? info.login,
			image: info.avatar_url,
		}
	},
}

export const PROVIDERS: Record<string, OAuthProvider> = { google, github }
