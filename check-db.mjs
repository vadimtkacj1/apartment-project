import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db'
const adapter = new PrismaBetterSqlite3({ url: databaseUrl })
const prisma = new PrismaClient({ adapter, errorFormat: 'minimal' })

async function main() {
  // Check properties 60, 61, 62, 63, 64
  const props = await prisma.property.findMany({
    where: {
      id: {
        in: [60, 61, 62, 63, 64]
      }
    },
    select: {
      id: true,
      isActive: true,
      title: true,
    }
  })

  console.log('Properties 60, 61, 62, 63, 64:')
  console.log(JSON.stringify(props, null, 2))

  // Check all active properties
  const activeProps = await prisma.property.findMany({
    where: { isActive: true },
    select: { id: true, title: true },
    orderBy: { id: 'desc' },
    take: 30
  })

  console.log(`\nAll active properties (showing first 30):`)
  console.log(activeProps.map(p => `ID ${p.id}: ${p.title}`).join('\n'))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
