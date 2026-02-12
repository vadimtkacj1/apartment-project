import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const contactInfo = await prisma.contactInfo.findFirst();
    console.log('Contact Info in database:');
    console.log(JSON.stringify(contactInfo, null, 2));

    if (!contactInfo) {
      console.log('\nNo contact info found in database!');
      console.log('You need to add it via admin panel: /admin/contact/contact-info');
    }
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
