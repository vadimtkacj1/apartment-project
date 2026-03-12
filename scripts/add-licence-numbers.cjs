const { PrismaClient } = require('@prisma/client');
const path = require('path');

// Load .env from project root
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Verify DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not found in environment variables!');
  console.error('Make sure .env file exists at:', path.join(__dirname, '..', '.env'));
  process.exit(1);
}

console.log('✓ Database URL loaded:', process.env.DATABASE_URL.substring(0, 20) + '...');

const prisma = new PrismaClient();

async function addLicenceNumbers() {
  try {
    console.log('Adding licence numbers...');

    // חיים עגני - 3164492
    const chaim = await prisma.teamMember.findFirst({
      where: { name: { contains: 'חיים' } }
    });
    if (chaim) {
      await prisma.teamMember.update({
        where: { id: chaim.id },
        data: { licenceNumber: '3164492' }
      });
      console.log('✓ Updated חיים עגני: 3164492');
    } else {
      console.log('⚠ חיים עגני not found in TeamMember, checking Owner...');
      const chaimOwner = await prisma.owner.findFirst({
        where: { name: { contains: 'חיים' } }
      });
      if (chaimOwner) {
        await prisma.owner.update({
          where: { id: chaimOwner.id },
          data: { licenceNumber: '3164492' }
        });
        console.log('✓ Updated חיים עגני (Owner): 3164492');
      } else {
        console.log('✗ חיים עגני not found');
      }
    }

    // רם מזרחי - 3019640
    const ram = await prisma.teamMember.findFirst({
      where: { name: { contains: 'רם' } }
    });
    if (ram) {
      await prisma.teamMember.update({
        where: { id: ram.id },
        data: { licenceNumber: '3019640' }
      });
      console.log('✓ Updated רם מזרחי: 3019640');
    } else {
      console.log('⚠ רם מזרחי not found in TeamMember, checking Owner...');
      const ramOwner = await prisma.owner.findFirst({
        where: { name: { contains: 'רם' } }
      });
      if (ramOwner) {
        await prisma.owner.update({
          where: { id: ramOwner.id },
          data: { licenceNumber: '3019640' }
        });
        console.log('✓ Updated רם מזרחי (Owner): 3019640');
      } else {
        console.log('✗ רם מזרחי not found');
      }
    }

    // תומר - 3082916
    const tomer = await prisma.teamMember.findFirst({
      where: { name: { contains: 'תומר' } }
    });
    if (tomer) {
      await prisma.teamMember.update({
        where: { id: tomer.id },
        data: { licenceNumber: '3082916' }
      });
      console.log('✓ Updated תומר: 3082916');
    } else {
      console.log('⚠ תומר not found in TeamMember, checking Owner...');
      const tomerOwner = await prisma.owner.findFirst({
        where: { name: { contains: 'תומר' } }
      });
      if (tomerOwner) {
        await prisma.owner.update({
          where: { id: tomerOwner.id },
          data: { licenceNumber: '3082916' }
        });
        console.log('✓ Updated תומר (Owner): 3082916');
      } else {
        console.log('✗ תומר not found');
      }
    }

    console.log('\n✓ Licence numbers added successfully!');
  } catch (error) {
    console.error('✗ Error adding licence numbers:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addLicenceNumbers();
