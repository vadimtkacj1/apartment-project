import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter, errorFormat: 'minimal' });

async function checkNoCommission() {
  try {
    console.log('=== Properties with isNoCommission = true ===');
    const noCommProps = await prisma.property.findMany({
      where: {
        isNoCommission: true
      },
      select: {
        id: true,
        title: true,
        price: true,
        isNoCommission: true,
        dealType: true,
        isActive: true
      }
    });
    console.log(JSON.stringify(noCommProps, null, 2));
    console.log(`Total: ${noCommProps.length}\n`);

    console.log('=== Properties with dealType = "sale" ===');
    const saleProps = await prisma.property.findMany({
      where: {
        dealType: 'sale',
        isActive: true
      },
      select: {
        id: true,
        title: true,
        price: true,
        isNoCommission: true,
        dealType: true
      },
      take: 5
    });
    console.log(JSON.stringify(saleProps, null, 2));
    console.log(`Total: ${saleProps.length}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkNoCommission();
