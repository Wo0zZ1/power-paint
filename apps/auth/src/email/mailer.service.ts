import { render } from '@react-email/components'
import { Injectable } from '@nestjs/common'
import nodemailer from 'nodemailer'
import type { ReactNode } from 'react'

import { CONFIG } from '../config'

interface SendEmailProps {
	to: string
	subject: string
	component: ReactNode | Promise<ReactNode>
}

@Injectable()
export class MailerService {
	private readonly transporter = nodemailer.createTransport({
		host: CONFIG.EMAIL_HOST,
		port: CONFIG.EMAIL_PORT,
		secure: CONFIG.EMAIL_PORT === 465,
		auth: { user: CONFIG.EMAIL_LOGIN, pass: CONFIG.EMAIL_PASSWORD },
		tls: { rejectUnauthorized: true },
	})

	async send({ to, subject, component }: SendEmailProps) {
		const html = await render(await component)

		await this.transporter.sendMail({
			from: CONFIG.EMAIL_LOGIN,
			to,
			subject,
			html,
		})
	}
}
