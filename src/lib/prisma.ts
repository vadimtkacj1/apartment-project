import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  // Check if we're in build phase (Next.js sets this during build)
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'
  
  if (isBuildPhase) {
    // During build, return a minimal client without adapter
    // This prevents connection attempts during build
    return new PrismaClient()
  }

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
    return new PrismaClient({ adapter })
  } catch (error) {
    // Fallback: use PrismaClient without adapter
    // This will use the DATABASE_URL from environment or schema.prisma
    console.warn('Could not initialize Prisma with adapter, using default connection')
    return new PrismaClient()
  }
}

// Lazy initialization to avoid connection during build
function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }
  
  const client = createPrismaClient()
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }
  
  return client
}

export const prisma = getPrismaClient()
