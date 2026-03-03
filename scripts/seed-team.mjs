import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

const owners = [
  {
    name: 'רם מזרחי',
    title: 'מייסד ומתווך נדל"ן',
    image: '/images/owner1.jpg',
    phone: '050-549-6626',
    email: 'rammiz800@gmail.com',
    whatsapp: '050-549-6626',
    description: 'רם הוא מתווך נדל"ן מנוסה המתמחה בשיווק דירות למכירה בחולון. הוא ידוע בגישה הישירה, ביכולת להבין במהירות את צרכי הלקוח ובניהול משא ומתן מדויק שמוביל לתוצאות.',
    order: 0,
    isActive: true,
  },
  {
    name: 'חיים ענבי',
    title: 'מייסד ומתווך נדל"ן',
    image: '/images/owner2.jpg',
    phone: '050-675-9999',
    email: 'hd.nadlan@gmail.com',
    whatsapp: '050-675-9999',
    description: 'חיים מביא ניסיון רב בתחום התיווך והשיווק, עם הכרות מעמיקה של שכונות חולון והסביבה. חיים מתמקד בליווי אישי, זמינות גבוהה ושירות מקצועי לכל לקוח.',
    order: 1,
    isActive: true,
  }
];

const team = [
  {
    name: 'תומר גל',
    role: 'סוכן נדל״ן',
    image: '/agent-second.jpg',
    phone: '050-901-7800',
    mobile: '050-901-7800',
    fax: '',
    email: 'twmr0560@gmail.com',
    description: "סוכן נדל״ן מנוסה המתמחה בחולון ובת-ים, עם היכרות עמוקה של השכונות והקונים המקומיים. משלב תמחור מדויק, שיווק חכם וניהול מו״מ חד כדי להביא לעסקה מהירה ובתנאים הטובים ביותר",
    order: 0,
    isActive: true,
  },
  {
    name: 'ליאור גמיש',
    role: 'סוכנת נדל״ן',
    image: '/agent-fisrt.jpg',
    phone: '',
    mobile: '',
    fax: '',
    email: '',
    description: "סוכנת נדל״ן מנוסה הפועלת מזה מספר שנים באזור חולון ובת-ים, עם היכרות מעמיקה של השכונות, מחירי השוק וקהל הקונים המקומי. מתמחה בליווי מוכרים ורוכשים משלב התמחור והבדיקות ועד סגירת העסקה, תוך התאמה אישית לצרכים ולמטרות הלקוח. משלבת שיווק מדויק, ניהול משא ומתן מקצועי וזמינות מלאה כדי להגיע לתוצאה בטוחה ובתנאים הטובים ביותר",
    order: 1,
    isActive: true,
  }
];

async function main() {
  console.log('🌱 Starting team seed...');

  // Seed Owners
  console.log('\n👥 Seeding owners...');
  for (const owner of owners) {
    // Check if owner with this email exists
    const existing = await prisma.owner.findFirst({
      where: { email: owner.email }
    });

    if (existing) {
      await prisma.owner.update({
        where: { id: existing.id },
        data: owner,
      });
      console.log(`  ✓ Updated owner: ${owner.name}`);
    } else {
      await prisma.owner.create({
        data: owner,
      });
      console.log(`  ✓ Created owner: ${owner.name}`);
    }
  }

  // Seed Team Members
  console.log('\n👥 Seeding team members...');
  for (const member of team) {
    // For team members without email, use name as unique identifier
    const existing = await prisma.teamMember.findFirst({
      where: { name: member.name }
    });

    if (existing) {
      await prisma.teamMember.update({
        where: { id: existing.id },
        data: member,
      });
      console.log(`  ✓ Updated team member: ${member.name}`);
    } else {
      await prisma.teamMember.create({
        data: member,
      });
      console.log(`  ✓ Created team member: ${member.name}`);
    }
  }

  console.log('\n✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
