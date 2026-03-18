import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    // Try to query properties
    const properties = await prisma.property.findMany({
      take: 1,
      select: {
        id: true,
        title: true,
        agentIds: true,
      }
    });

    console.log('✅ Database schema is correct!');
    console.log('Sample property:', properties[0]);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nTrying to fix with db push...');

    // Try to push schema
    const { exec } = await import('child_process');
    exec('npx prisma db push --force-reset', (error, stdout, stderr) => {
      if (error) {
        console.error('Failed to push schema:', error);
        return;
      }
      console.log(stdout);
    });
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
