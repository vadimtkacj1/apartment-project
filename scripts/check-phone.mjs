import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  const member = await prisma.teamMember.findFirst({
    where: { name: 'ליאור גביש' }
  });

  if (member) {
    console.log('Found member:', member.name);
    console.log('Phone:', member.phone);
    console.log('Mobile:', member.mobile);
    console.log('Email:', member.email);
    console.log('\nRaw phone value:', JSON.stringify(member.phone));
    console.log('Phone length:', member.phone ? member.phone.length : 0);
  } else {
    console.log('Member not found');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
