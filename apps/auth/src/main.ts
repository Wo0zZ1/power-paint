import 'reflect-metadata'

import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { CONFIG } from './config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const document = SwaggerModule.createDocument(
		app,
		new DocumentBuilder()
			.setTitle('Power Paint Auth')
			.setDescription('Выпуск и валидация сессий, OAuth, восстановление пароля')
			.setVersion('1.0')
			.build(),
	)

	SwaggerModule.setup('api/auth/docs', app, document)

	await app.listen(CONFIG.PORT)
}

bootstrap()
