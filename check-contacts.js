import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter, errorFormat: 'minimal' });

async function checkContacts() {
  try {
    const contactInfo = await prisma.contactInfo.findFirst();

    console.log('=== Contact Info ===');
    console.log(JSON.stringify(contactInfo, null, 2));

    console.log('\n=== Has Second Contacts? ===');
    console.log('Phone 2:', !!contactInfo?.phone2);
    console.log('WhatsApp 2:', !!contactInfo?.whatsapp2);
    console.log('Instagram 2:', !!contactInfo?.instagram2);
    console.log('Facebook 2:', !!contactInfo?.facebook2);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkContacts();
