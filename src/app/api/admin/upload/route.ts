import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { requireAdmin } from '@/lib/require-admin';

// Map of allowed image types -> canonical extension, keyed by magic-byte sniff.
// SVG is intentionally excluded: it can carry inline <script> and would be
// served from our own origin (stored XSS).
const ALLOWED_IMAGE_EXTENSIONS: Record<string, string> = {
  jpg: 'jpg',
  png: 'png',
  webp: 'webp',
  gif: 'gif',
};

// Same magic-byte policy for video: only containers browsers can play from a
// plain <video> tag, sniffed from the bytes rather than the supplied filename.
const ALLOWED_VIDEO_EXTENSIONS: Record<string, string> = {
  mp4: 'mp4',
  webm: 'webm',
  mov: 'mov',
};

const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

// Inspect the real file bytes instead of trusting the client-supplied MIME type
// or filename extension. Returns the canonical extension or null if unrecognised.
function sniffImageExtension(buffer: Buffer): string | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'jpg';
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47 &&
    buffer[4] === 0x0d && buffer[5] === 0x0a && buffer[6] === 0x1a && buffer[7] === 0x0a
  ) {
    return 'png';
  }
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'webp';
  }
  if (
    buffer.length >= 6 &&
    (buffer.toString('ascii', 0, 6) === 'GIF87a' || buffer.toString('ascii', 0, 6) === 'GIF89a')
  ) {
    return 'gif';
  }
  return null;
}

function sniffVideoExtension(buffer: Buffer): string | null {
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3
  ) {
    const header = buffer.toString('binary', 0, Math.min(buffer.length, 4096));
    return header.includes('webm') ? 'webm' : null;
  }

  if (buffer.length >= 12 && buffer.toString('ascii', 4, 8) === 'ftyp') {
    const brand = buffer.toString('ascii', 8, 12).trim().toLowerCase();
    if (brand === 'qt') return 'mov';
    const mp4Brands = ['isom', 'iso2', 'iso4', 'iso5', 'iso6', 'mp41', 'mp42', 'avc1', 'm4v', 'mmp4', 'dash'];
    if (mp4Brands.includes(brand) || brand.startsWith('mp4')) return 'mp4';
    return null;
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

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

    // Validate file size before reading it into memory. Video gets a larger
    // budget than photos, but is still capped so one clip can't exhaust RAM.
    const looksLikeVideo = file.type.startsWith('video/');
    const maxSize = looksLikeVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      console.log(`❌ [UPLOAD] Error: File too large (${file.size} bytes)`);
      return NextResponse.json(
        { error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB` },
        { status: 400 }
      );
    }
    console.log('✅ [UPLOAD] File size validation passed');

    // Read file as buffer
    console.log('📖 [UPLOAD] Reading file to buffer...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log(`✅ [UPLOAD] File read: ${buffer.length} bytes`);

    // Validate the actual file content (magic bytes), not the client-supplied
    // MIME type or extension. Rejects SVG, HTML, scripts and polyglot files.
    const sniffedImage = sniffImageExtension(buffer);
    const sniffedVideo = sniffedImage ? null : sniffVideoExtension(buffer);
    const extension = sniffedImage
      ? ALLOWED_IMAGE_EXTENSIONS[sniffedImage]
      : sniffedVideo
        ? ALLOWED_VIDEO_EXTENSIONS[sniffedVideo]
        : null;

    if (!extension) {
      console.log(`❌ [UPLOAD] Error: File content is not an allowed image or video type`);
      return NextResponse.json(
        { error: 'File must be a JPG, PNG, WebP or GIF image, or an MP4, WebM or MOV video' },
        { status: 400 }
      );
    }

    if (sniffedVideo && folder !== 'properties') {
      console.log(`❌ [UPLOAD] Error: Video upload not allowed in folder "${folder}"`);
      return NextResponse.json(
        { error: 'Video uploads are only allowed for properties' },
        { status: 400 }
      );
    }

    if (sniffedVideo && file.size > MAX_VIDEO_SIZE) {
      console.log(`❌ [UPLOAD] Error: Video too large (${file.size} bytes)`);
      return NextResponse.json(
        { error: `File size must be less than ${Math.round(MAX_VIDEO_SIZE / 1024 / 1024)}MB` },
        { status: 400 }
      );
    }

    if (sniffedImage && file.size > MAX_IMAGE_SIZE) {
      console.log(`❌ [UPLOAD] Error: Image too large (${file.size} bytes)`);
      return NextResponse.json(
        { error: `File size must be less than ${Math.round(MAX_IMAGE_SIZE / 1024 / 1024)}MB` },
        { status: 400 }
      );
    }

    console.log(`✅ [UPLOAD] File content validated as: ${sniffedImage || sniffedVideo}`);

    // Generate unique filename using the sniffed extension (never user input)
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const filename = `${timestamp}-${randomString}.${extension}`;
    console.log(`🏷️  [UPLOAD] Generated filename: ${filename}`);

    // One source of truth: only UPLOADS_DIR (or fixed absolute path on server)
    // Никаких временных/.next папок – всегда одна постоянная директория
    const baseDir = process.env.UPLOADS_DIR || '/opt/apartment-project/public/uploads';

    const uploadDir = join(baseDir, folder);
    console.log(`   - baseDir: ${baseDir}`);
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
