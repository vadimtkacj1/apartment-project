import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db'
  // Adapter internally strips the optional `file:` prefix and opens the DB via better-sqlite3.
  const adapter = new PrismaBetterSqlite3({ url: databaseUrl })

  // Prisma v7 expects adapter/accelerateUrl; adapter is the correct path for SQLite here.
  return new PrismaClient({ adapter, errorFormat: 'minimal' })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
