import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  // Check if we're in build phase (Next.js sets this during build)
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' || 
                       (typeof process !== 'undefined' && process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL)
  
  if (isBuildPhase) {
    // During build, return a minimal client that won't cause errors
    // The actual client will be created at runtime
    return new PrismaClient({
      datasources: {
        db: {
          url: 'file:./dev.db'
        }
      }
    })
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
    console.warn('Could not initialize Prisma with adapter, using default connection')
    return new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'file:./dev.db'
        }
      }
    })
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
