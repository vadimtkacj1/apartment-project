import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    // Count all properties
    const totalCount = await prisma.property.count();
    console.log(`\n📊 Total properties in database: ${totalCount}`);

    // Count active properties
    const activeCount = await prisma.property.count({
      where: { isActive: true }
    });
    console.log(`✅ Active properties: ${activeCount}`);

    // Get first 3 properties
    const properties = await prisma.property.findMany({
      take: 5,
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        city: true,
        dealType: true,
        price: true,
        isActive: true
      }
    });

    console.log('\n🏠 Sample properties:');
    properties.forEach(prop => {
      console.log(`  - [${prop.id}] ${prop.title} | ${prop.city} | ${prop.dealType} | ${prop.price}`);
    });

    // Check center area properties
    const centerProps = await prisma.property.count({
      where: {
        isActive: true,
        city: {
          in: ['telaviv', 'holon', 'batyam', 'rishon']
        }
      }
    });
    console.log(`\n📍 Properties in center area (Tel Aviv, Holon, Bat Yam, Rishon): ${centerProps}`);

    // Show all unique cities
    const allProperties = await prisma.property.findMany({
      where: { isActive: true },
      select: { city: true }
    });
    const uniqueCities = [...new Set(allProperties.map(p => p.city))];
    console.log(`\n🏙️ All cities in database: ${uniqueCities.join(', ')}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
