import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    const totalProperties = await prisma.property.count();
    const activeProperties = await prisma.property.count({ where: { isActive: true } });
    const saleProperties = await prisma.property.count({ where: { dealType: 'sale', isActive: true } });

    console.log('=== Database Check ===');
    console.log('Total properties:', totalProperties);
    console.log('Active properties:', activeProperties);
    console.log('Active sale properties:', saleProperties);

    if (saleProperties > 0) {
      const samples = await prisma.property.findMany({
        where: { dealType: 'sale', isActive: true },
        take: 3,
        select: {
          id: true,
          title: true,
          price: true,
          location: true,
          city: true,
          dealType: true,
        }
      });

      console.log('\nSample properties:');
      samples.forEach(prop => {
        console.log(`- ID ${prop.id}: ${prop.title} - ${prop.price} in ${prop.city}`);
      });
    }
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
