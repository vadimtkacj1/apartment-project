import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Get folder from query params (default to 'properties')
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'properties';

    // Validate folder (security: only allow specific folders)
    const allowedFolders = ['properties', 'owners', 'team'];
    if (!allowedFolders.includes(folder)) {
      return NextResponse.json(
        { error: 'Invalid folder specified' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Read file as buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${timestamp}-${randomString}.${extension}`;

    // Production: UPLOADS_DIR must match nginx alias (e.g. /opt/apartment-project/public/uploads)
    // Dev: use public/uploads
    const baseDir = process.env.UPLOADS_DIR
      ? process.env.UPLOADS_DIR
      : join(process.cwd(), 'public', 'uploads');

    const uploadDir = join(baseDir, folder);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Write file directly to folder (no cache)
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    console.log(`✅ File saved to: ${filepath}`);

    // Return public URL
    const url = `/uploads/${folder}/${filename}`;

    return NextResponse.json({ url }, { status: 200 });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}
