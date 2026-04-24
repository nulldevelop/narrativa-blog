import 'dotenv/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '../generated/prisma/client'

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
  connectTimeout: 10000,
  acquireTimeout: 10000,
})
const prisma = new PrismaClient({ adapter, log: ['error', 'warn'] })

prisma.$connect().catch((err) => {
  console.error('Failed to connect to database:', err)
})

export { prisma }
