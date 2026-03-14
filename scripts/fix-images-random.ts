import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

// Initialize Prisma
const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

// Shuffle array randomly
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function fixImagesRandom() {
  console.log('🔧 Fixing images by random assignment...\n');

  try {
    // Get orphaned files from disk
    const propertiesDir = join(process.cwd(), 'public', 'uploads', 'properties');
    const orphanedFiles = existsSync(propertiesDir)
      ? readdirSync(propertiesDir).filter(f => f !== '.gitkeep')
      : [];

    console.log(`📁 Found ${orphanedFiles.length} orphaned files on disk\n`);

    // Get properties that need images
    const properties = await prisma.property.findMany();

    // Find properties with broken/missing images
    const propertiesNeedingImages: any[] = [];

    for (const property of properties) {
      const images = JSON.parse(property.images || '[]') as string[];

      // Check if property has no valid images
      let hasValidImages = false;
      for (const imgPath of images) {
        const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
        const fullPath = join(process.cwd(), 'public', cleanPath);
        if (existsSync(fullPath)) {
          hasValidImages = true;
          break;
        }
      }

      // If no valid images and not in /images/ folder (those are OK)
      if (!hasValidImages && images.length > 0 && !images[0].includes('/images/')) {
        propertiesNeedingImages.push(property);
      }
    }

    console.log(`🏠 Found ${propertiesNeedingImages.length} properties needing images\n`);

    if (propertiesNeedingImages.length === 0) {
      console.log('✅ No properties need fixing!\n');
      return;
    }

    if (orphanedFiles.length === 0) {
      console.log('❌ No orphaned files to assign!\n');
      return;
    }

    // Shuffle files randomly
    const shuffledFiles = shuffle(orphanedFiles);

    console.log('═══════════════════════════════════════════════════════\n');
    console.log('🎲 Random assignment:\n');

    // Assign files to properties
    let assignedCount = 0;
    for (let i = 0; i < Math.min(propertiesNeedingImages.length, shuffledFiles.length); i++) {
      const property = propertiesNeedingImages[i];
      const filename = shuffledFiles[i];
      const newImagePath = `/uploads/properties/${filename}`;

      console.log(`Property #${property.id}: "${property.title}"`);
      console.log(`   Assigned: ${newImagePath}`);

      // Update property
      await prisma.property.update({
        where: { id: property.id },
        data: {
          images: JSON.stringify([newImagePath])
        }
      });

      assignedCount++;
    }

    console.log('\n═══════════════════════════════════════════════════════\n');
    console.log('✨ Assignment complete!\n');
    console.log(`   Properties updated: ${assignedCount}`);
    console.log(`   Files assigned: ${assignedCount}`);
    console.log(`   Remaining orphaned files: ${orphanedFiles.length - assignedCount}\n`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixImagesRandom();
