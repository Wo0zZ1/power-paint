function getBaseUrl() {
	return process.env.MAILHOG_URL + '/api/v2'
}

/**
 * Убирает переносы строк, которые разбивают строку, и декодирует кодированные символы в формате quoted-printable
 * @param str Строка в формате quoted-printable
 * @returns Декодированная строка
 */
function decodeQuotedPrintable(str: string) {
	return str
		.replace(/=\r\n/g, '')
		.replace(/=([A-Fa-f0-9]{2})/g, (m, hex) => String.fromCharCode(parseInt(hex, 16)))
}

export async function getVerificationCode(query: string): Promise<string> {
	const url = getBaseUrl()
	const res = await fetch(
		`${url}/search?kind=containing&query=${encodeURIComponent(query)}&start=0&limit=1`,
	)
	if (!res.ok) throw new Error(`Failed to fetch emails: ${res.status} ${res.statusText}`)

	const data = await res.json()
	if (data.total === 0) throw new Error('No emails found')

	const html = decodeQuotedPrintable(data.items[0].Content.Body)

	const match = html.match(/<p[^>]*>(\d{6})<\/p>/) // 6-значный код

	if (!match) throw new Error('Код не найден')
	return match[1]
}
