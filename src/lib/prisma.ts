import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function resolveConnectionString(): string {
  const url = process.env.DATABASE_URL
  if (url) return url
  // In production the connection string is mandatory — fail loudly rather than
  // silently pointing at a wrong database.
  if (process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL is not set — expected a postgresql:// connection string')
  }
  // Test/CI/local fallback. The pg Pool is lazy, so this is never actually
  // opened unless a query runs (route handlers wrap DB writes in try/catch),
  // which keeps the unit tests import-safe without a live database.
  return 'postgresql://localhost:5432/postgres'
}

function createPrismaClient(): PrismaClient {
  // Prisma v7 driver adapter for PostgreSQL (node-postgres).
  const adapter = new PrismaPg({ connectionString: resolveConnectionString() })

  return new PrismaClient({ adapter, errorFormat: 'minimal' })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
