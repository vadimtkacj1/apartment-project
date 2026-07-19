const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function addLicenceNumbers() {
  try {
    console.log('Adding licence numbers...');

    // חיים עגני - 3184627
    const chaim = await prisma.teamMember.findFirst({
      where: { name: { contains: 'חיים' } }
    });
    if (chaim) {
      await prisma.teamMember.update({
        where: { id: chaim.id },
        data: { licenceNumber: '3184627' }
      });
      console.log('✓ Updated חיים עגני: 3184627');
    } else {
      console.log('⚠ חיים עגני not found in TeamMember, checking Owner...');
      const chaimOwner = await prisma.owner.findFirst({
        where: { name: { contains: 'חיים' } }
      });
      if (chaimOwner) {
        await prisma.owner.update({
          where: { id: chaimOwner.id },
          data: { licenceNumber: '3184627' }
        });
        console.log('✓ Updated חיים עגני (Owner): 3184627');
      } else {
        console.log('✗ חיים עגני not found');
      }
    }

    // דניאל שרון - 3072851
    const ram = await prisma.teamMember.findFirst({
      where: { name: { contains: 'רם' } }
    });
    if (ram) {
      await prisma.teamMember.update({
        where: { id: ram.id },
        data: { licenceNumber: '3072851' }
      });
      console.log('✓ Updated דניאל שרון: 3072851');
    } else {
      console.log('⚠ דניאל שרון not found in TeamMember, checking Owner...');
      const ramOwner = await prisma.owner.findFirst({
        where: { name: { contains: 'רם' } }
      });
      if (ramOwner) {
        await prisma.owner.update({
          where: { id: ramOwner.id },
          data: { licenceNumber: '3072851' }
        });
        console.log('✓ Updated דניאל שרון (Owner): 3072851');
      } else {
        console.log('✗ דניאל שרון not found');
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
