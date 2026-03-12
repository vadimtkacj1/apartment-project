import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    console.log('📤 [UPLOAD] Starting file upload');

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log('❌ [UPLOAD] Error: No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log(`📄 [UPLOAD] Received file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);

    // Get folder from query params (default to 'properties')
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'properties';
    console.log(`📁 [UPLOAD] Target folder: ${folder}`);

    // Validate folder (security: only allow specific folders)
    const allowedFolders = ['properties', 'owners', 'team'];
    if (!allowedFolders.includes(folder)) {
      console.log(`❌ [UPLOAD] Error: Invalid folder "${folder}"`);
      return NextResponse.json(
        { error: 'Invalid folder specified' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log(`❌ [UPLOAD] Error: File is not an image (${file.type})`);
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }
    console.log('✅ [UPLOAD] File type validation passed');

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.log(`❌ [UPLOAD] Error: File too large (${file.size} bytes)`);
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }
    console.log('✅ [UPLOAD] File size validation passed');

    // Read file as buffer
    console.log('📖 [UPLOAD] Reading file to buffer...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log(`✅ [UPLOAD] File read: ${buffer.length} bytes`);

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${timestamp}-${randomString}.${extension}`;
    console.log(`🏷️  [UPLOAD] Generated filename: ${filename}`);

    // SIMPLIFIED: On production always use absolute path
    const baseDir = process.env.NODE_ENV === 'production'
      ? '/opt/apartment-project/public/uploads'
      : join(process.cwd(), 'public', 'uploads');

    console.log('🔍 [UPLOAD] Determining save path:');
    console.log(`   - NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`   - baseDir: ${baseDir}`);
    console.log(`   - folder: ${folder}`);

    const uploadDir = join(baseDir, folder);
    console.log(`   - uploadDir: ${uploadDir}`);

    if (!existsSync(uploadDir)) {
      console.log('📁 [UPLOAD] Directory does not exist, creating...');
      await mkdir(uploadDir, { recursive: true });
      console.log('✅ [UPLOAD] Directory created');
    } else {
      console.log('✅ [UPLOAD] Directory exists');
    }

    // Write file directly to folder (no cache)
    const filepath = join(uploadDir, filename);
    console.log(`💾 [UPLOAD] Saving file: ${filepath}`);
    await writeFile(filepath, buffer);
    console.log(`✅ [UPLOAD] File saved successfully!`);

    // Return public URL
    const url = `/uploads/${folder}/${filename}`;
    console.log(`🌐 [UPLOAD] Public URL: ${url}`);
    console.log(`✅ [UPLOAD] Upload completed successfully!\n`);

    return NextResponse.json({ url }, { status: 200 });
  } catch (error: any) {
    console.error('❌ [UPLOAD] CRITICAL ERROR:', error);
    console.error('   Stack trace:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}
