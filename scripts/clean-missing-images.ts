import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { existsSync } from 'fs';
import { join } from 'path';
import * as readline from 'readline/promises';

// Initialize Prisma
const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function cleanMissingImages() {
  console.log('🔍 Checking for missing images in database...\n');

  try {
    // Get all properties
    const properties = await prisma.property.findMany();

    let totalChecked = 0;
    let totalCleaned = 0;
    let totalRemoved = 0;

    for (const property of properties) {
      const images = JSON.parse(property.images || '[]') as string[];

      if (images.length === 0) continue;

      totalChecked++;

      // Check which images exist
      const existingImages = images.filter((imagePath) => {
        // Remove leading slash if present
        const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
        const fullPath = join(process.cwd(), 'public', cleanPath);
        return existsSync(fullPath);
      });

      const missingCount = images.length - existingImages.length;

      if (missingCount > 0) {
        console.log(`📦 Property ID ${property.id}: "${property.title}"`);
        console.log(`   ❌ Missing ${missingCount} image(s)`);
        console.log(`   ✅ Keeping ${existingImages.length} image(s)`);

        images.forEach((img) => {
          const cleanPath = img.startsWith('/') ? img.slice(1) : img;
          const fullPath = join(process.cwd(), 'public', cleanPath);
          if (!existsSync(fullPath)) {
            console.log(`      - ${img}`);
            totalRemoved++;
          }
        });

        // Update property with only existing images
        await prisma.property.update({
          where: { id: property.id },
          data: {
            images: JSON.stringify(existingImages),
          },
        });

        totalCleaned++;
        console.log('');
      }
    }

    // Check owners
    const owners = await prisma.owner.findMany();
    for (const owner of owners) {
      if (!owner.image) continue;

      const cleanPath = owner.image.startsWith('/') ? owner.image.slice(1) : owner.image;
      const fullPath = join(process.cwd(), 'public', cleanPath);

      if (!existsSync(fullPath)) {
        console.log(`👤 Owner "${owner.name}": Missing image ${owner.image}`);
        await prisma.owner.update({
          where: { id: owner.id },
          data: { image: null },
        });
        totalRemoved++;
      }
    }

    console.log('\n✨ Cleanup complete!');
    console.log(`   Properties checked: ${totalChecked}`);
    console.log(`   Properties cleaned: ${totalCleaned}`);
    console.log(`   Total images removed: ${totalRemoved}`);

    if (totalRemoved > 0) {
      console.log('\n⚠️  ВНИМАНИЕ: Ссылки на несуществующие файлы были удалены из базы данных.');
      console.log('   Если у вас есть резервная копия этих файлов, восстановите их в папку public/uploads/');
      console.log('   и НЕ запускайте этот скрипт повторно.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

async function showMissingOnly() {
  console.log('🔍 Поиск отсутствующих изображений...\n');

  try {
    const properties = await prisma.property.findMany();
    const missingFiles: string[] = [];

    for (const property of properties) {
      const images = JSON.parse(property.images || '[]') as string[];

      images.forEach((img) => {
        const cleanPath = img.startsWith('/') ? img.slice(1) : img;
        const fullPath = join(process.cwd(), 'public', cleanPath);
        if (!existsSync(fullPath)) {
          missingFiles.push(img);
        }
      });
    }

    // Check owners
    const owners = await prisma.owner.findMany();
    for (const owner of owners) {
      if (!owner.image) continue;

      const cleanPath = owner.image.startsWith('/') ? owner.image.slice(1) : owner.image;
      const fullPath = join(process.cwd(), 'public', cleanPath);

      if (!existsSync(fullPath)) {
        missingFiles.push(owner.image);
      }
    }

    if (missingFiles.length === 0) {
      console.log('✅ Все изображения на месте!\n');
    } else {
      console.log(`❌ Найдено ${missingFiles.length} отсутствующих файлов:\n`);
      missingFiles.forEach((file) => {
        console.log(`   - ${file}`);
      });

      console.log('\n💡 Что делать:');
      console.log('   1. Если файлы есть в резервной копии - восстановите их в public/uploads/');
      console.log('   2. Если файлов нет - запустите скрипт с флагом --clean для очистки БД');
      console.log('      npm run clean:images -- --clean');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

// Check command line arguments
const args = process.argv.slice(2);
const shouldClean = args.includes('--clean') || args.includes('-c');

if (shouldClean) {
  cleanMissingImages();
} else {
  showMissingOnly();
}
