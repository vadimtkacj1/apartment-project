import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prismaClientInstance: PrismaClient | undefined

function createPrismaClient(): PrismaClient {
  // Runtime initialization with adapter
  try {
    // Dynamic import to avoid issues during build
    const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
    const Database = require('better-sqlite3')
    const path = require('path')
    
    // Use DATABASE_URL from env if available, otherwise use default path
    const databaseUrl = process.env.DATABASE_URL || `file:${path.join(process.cwd(), 'dev.db')}`
    
    // Extract file path from DATABASE_URL (remove 'file:' prefix if present)
    const dbPath = databaseUrl.replace(/^file:/, '')
    
    // Create SQLite database connection
    const sqlite = new Database(dbPath)
    
    // Create adapter
    const adapter = new PrismaBetterSqlite3(sqlite)
    
    // Create Prisma client with adapter
    return new PrismaClient({ 
      adapter,
      log: [],
      errorFormat: 'minimal',
    })
  } catch (error) {
    // Fallback: use PrismaClient without adapter
    // This will use the DATABASE_URL from environment or schema.prisma
    console.warn('Could not initialize Prisma with adapter, using default connection')
    return new PrismaClient({
      log: [],
      errorFormat: 'minimal',
    })
  }
}

// Lazy initialization - only create client when actually needed (not during build)
function getPrismaClient(): PrismaClient {
  // During build phase, return a proxy that will initialize on first use
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    if (!prismaClientInstance) {
      // Create a minimal client for build time that won't try to connect
      prismaClientInstance = new PrismaClient({
        log: [],
        errorFormat: 'minimal',
      }) as PrismaClient
    }
    return prismaClientInstance
  }

  // Runtime: use global instance or create new one
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }
  
  if (prismaClientInstance) {
    return prismaClientInstance
  }
  
  const client = createPrismaClient()
  prismaClientInstance = client
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }
  
  return client
}

export const prisma = getPrismaClient()
