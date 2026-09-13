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
			.setTitle('Power Paint Boards')
			.setDescription('Рабочие области, доски и права участников')
			.setVersion('1.0')
			.build(),
	)

	SwaggerModule.setup('api/boards/docs', app, document)

	await app.listen(CONFIG.PORT)
}

bootstrap()
