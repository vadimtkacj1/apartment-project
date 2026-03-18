import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔄 Migrating agentIds format...');

  // Get all properties
  const properties = await prisma.property.findMany({
    select: { id: true, agentIds: true }
  });

  let updated = 0;
  let skipped = 0;

  for (const property of properties) {
    try {
      const agentIds = JSON.parse(property.agentIds || '[]');

      // Check if already in new format
      if (agentIds.length > 0 && typeof agentIds[0] === 'string') {
        console.log(`  ⏭️  Property ${property.id}: already in new format`);
        skipped++;
        continue;
      }

      // Convert old format (numbers) to new format (team-X)
      const newAgentIds = agentIds.map((id) => `team-${id}`);

      await prisma.property.update({
        where: { id: property.id },
        data: { agentIds: JSON.stringify(newAgentIds) }
      });

      console.log(`  ✅ Property ${property.id}: ${agentIds.length} agents converted`);
      updated++;
    } catch (error) {
      console.error(`  ❌ Property ${property.id}: Error -`, error.message);
    }
  }

  console.log(`\n✨ Migration complete!`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total: ${properties.length}`);
}

main()
  .catch(e => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
