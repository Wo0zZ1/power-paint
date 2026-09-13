import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

import { PrismaClient } from './generated'

export const createPrismaClient = (connectionString = process.env.DATABASE_URL) =>
	new PrismaClient({ adapter: new PrismaPg(new Pool({ connectionString })) })
