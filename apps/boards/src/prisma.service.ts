import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { createPrismaClient } from '@power-paint/db/client'

import { CONFIG } from './config'

type PrismaClient = ReturnType<typeof createPrismaClient>

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
	readonly client: PrismaClient = createPrismaClient(CONFIG.DATABASE_URL)

	onModuleInit() {
		return this.client.$connect()
	}

	onModuleDestroy() {
		return this.client.$disconnect()
	}
}
