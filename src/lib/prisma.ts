import 'dotenv/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '../generated/prisma/client'

const globalForPrisma = globalThis as unknown as { 
  prisma?: PrismaClient;
  adapter?: PrismaMariaDb;
}

const createAdapter = () => {
  return new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 5, // Reduzido drasticamente para garantir aceitação pelo servidor MySQL
    idleTimeout: 10, // Fecha conexões paradas em 10 segundos
    connectTimeout: 5, // Timeout de conexão inicial de 5 segundos
  })
}

// Em Next.js, módulos podem ser limpos. Usar globalThis garante uma instância única real.
if (!globalForPrisma.adapter) {
  globalForPrisma.adapter = createAdapter()
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: globalForPrisma.adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
// Manter no global em produção também ajuda em certos ambientes de deploy
globalForPrisma.prisma = prisma

