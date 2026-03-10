import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Prisma client with adapter
const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter, errorFormat: 'minimal' });

async function cleanMissingImages() {
  try {
    console.log('🔍 Проверка изображений свойств...\n');

    const properties = await prisma.property.findMany({
      select: {
        id: true,
        title: true,
        images: true,
      },
    });

    let totalFixed = 0;

    for (const property of properties) {
      if (!property.images) continue;

      let images;
      try {
        images = typeof property.images === 'string'
          ? JSON.parse(property.images)
          : property.images;
      } catch (e) {
        console.warn(`⚠️  Не удалось распарсить images для свойства ${property.id}`);
        continue;
      }

      if (!Array.isArray(images) || images.length === 0) continue;

      const validImages = [];
      const missingImages = [];

      for (const imagePath of images) {
        // Проверяем существует ли файл
        const fullPath = path.join(process.cwd(), 'public', imagePath);
        if (fs.existsSync(fullPath)) {
          validImages.push(imagePath);
        } else {
          missingImages.push(imagePath);
        }
      }

      if (missingImages.length > 0) {
        console.log(`🔧 Свойство #${property.id}: "${property.title}"`);
        console.log(`   ❌ Отсутствующие: ${missingImages.join(', ')}`);

        if (validImages.length > 0) {
          // Обновляем только валидные изображения
          await prisma.property.update({
            where: { id: property.id },
            data: {
              images: JSON.stringify(validImages),
            },
          });
          console.log(`   ✅ Обновлено: оставлено ${validImages.length} изображений\n`);
        } else {
          // Если нет валидных изображений, ставим заглушку
          await prisma.property.update({
            where: { id: property.id },
            data: {
              images: JSON.stringify(['/images/hero/main-hero.jpg']),
            },
          });
          console.log(`   ✅ Установлена заглушка\n`);
        }
        totalFixed++;
      }
    }

    if (totalFixed === 0) {
      console.log('✨ Все изображения в порядке!');
    } else {
      console.log(`\n✅ Исправлено ${totalFixed} свойств`);
    }

  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanMissingImages();
