import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

// Initialize Prisma
const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function diagnoseImages() {
  console.log('🔍 Diagnosing image path mismatches...\n');

  try {
    // Get all files from disk
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const propertiesDir = join(uploadsDir, 'properties');
    const ownersDir = join(uploadsDir, 'owners');

    const filesOnDisk = {
      properties: existsSync(propertiesDir) ? readdirSync(propertiesDir).filter(f => f !== '.gitkeep') : [],
      owners: existsSync(ownersDir) ? readdirSync(ownersDir).filter(f => f !== '.gitkeep') : [],
    };

    console.log('📁 Files on disk:');
    console.log(`   Properties: ${filesOnDisk.properties.length} files`);
    console.log(`   Owners: ${filesOnDisk.owners.length} files\n`);

    // Get all image references from database
    const properties = await prisma.property.findMany();
    const owners = await prisma.owner.findMany();

    const referencedImages = {
      properties: new Set<string>(),
      owners: new Set<string>(),
    };

    const allReferencedPaths = new Set<string>();

    // Collect all referenced images with full paths
    properties.forEach(prop => {
      const images = JSON.parse(prop.images || '[]') as string[];
      images.forEach(img => {
        allReferencedPaths.add(img);
        // Also track uploads folder specifically
        if (img.includes('/uploads/properties/')) {
          const filename = img.split('/').pop();
          if (filename) referencedImages.properties.add(filename);
        }
      });
    });

    owners.forEach(owner => {
      if (owner.image) {
        allReferencedPaths.add(owner.image);
        if (owner.image.includes('/uploads/owners/')) {
          const filename = owner.image.split('/').pop();
          if (filename) referencedImages.owners.add(filename);
        }
      }
    });

    console.log('💾 References in database:');
    console.log(`   Total unique paths: ${allReferencedPaths.size}`);
    console.log(`   In /uploads/properties/: ${referencedImages.properties.size}`);
    console.log(`   In /uploads/owners/: ${referencedImages.owners.size}\n`);

    // Find mismatches
    console.log('═══════════════════════════════════════════════════════\n');

    // Files on disk but NOT in database
    console.log('📦 FILES ON DISK (not referenced in DB):\n');
    let orphanedCount = 0;

    filesOnDisk.properties.forEach(file => {
      if (!referencedImages.properties.has(file)) {
        console.log(`   properties/${file}`);
        orphanedCount++;
      }
    });

    filesOnDisk.owners.forEach(file => {
      if (!referencedImages.owners.has(file)) {
        console.log(`   owners/${file}`);
        orphanedCount++;
      }
    });

    if (orphanedCount === 0) {
      console.log('   ✅ None - all files are referenced');
    }
    console.log('');

    // References in database but NOT on disk
    console.log('💾 REFERENCES IN DB (files missing on disk):\n');
    let missingCount = 0;

    allReferencedPaths.forEach(imgPath => {
      const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
      const fullPath = join(process.cwd(), 'public', cleanPath);

      if (!existsSync(fullPath)) {
        console.log(`   ${imgPath}`);
        missingCount++;
      }
    });

    if (missingCount === 0) {
      console.log('   ✅ None - all references point to existing files');
    }
    console.log('');

    // Show detailed property-by-property analysis
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('📋 PROPERTY-BY-PROPERTY ANALYSIS:\n');

    let issueCount = 0;
    for (const property of properties) {
      const images = JSON.parse(property.images || '[]') as string[];
      const missingImages: string[] = [];
      const existingImages: string[] = [];

      images.forEach(imgPath => {
        const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
        const fullPath = join(process.cwd(), 'public', cleanPath);

        if (existsSync(fullPath)) {
          existingImages.push(imgPath);
        } else {
          missingImages.push(imgPath);
        }
      });

      if (missingImages.length > 0) {
        issueCount++;
        console.log(`Property #${property.id}: "${property.title}"`);
        console.log(`   Total images: ${images.length}`);
        console.log(`   ✅ Existing: ${existingImages.length}`);
        console.log(`   ❌ Missing: ${missingImages.length}`);

        missingImages.forEach(img => {
          console.log(`      - ${img}`);
        });
        console.log('');
      }
    }

    if (issueCount === 0) {
      console.log('   ✅ All properties have valid image references!\n');
    }

    // Summary
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('📊 SUMMARY:\n');
    console.log(`   Orphaned files (on disk, not in DB): ${orphanedCount}`);
    console.log(`   Missing files (in DB, not on disk): ${missingCount}`);
    console.log(`   Properties with issues: ${issueCount}`);
    console.log('');

    if (orphanedCount > 0) {
      console.log('💡 Orphaned files can be safely deleted with:');
      console.log('   (Manual cleanup required - review files first)\n');
    }

    if (missingCount > 0) {
      console.log('💡 Missing files can be fixed by:');
      console.log('   1. Restore files from backup to public/uploads/');
      console.log('   2. OR run: npm run clean:images');
      console.log('      (removes DB references to missing files)\n');
    }

    if (orphanedCount === 0 && missingCount === 0) {
      console.log('✨ Everything is in sync! No action needed.\n');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

diagnoseImages();
