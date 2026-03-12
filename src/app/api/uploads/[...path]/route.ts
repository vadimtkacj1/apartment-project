import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    // Join path segments (e.g., ['properties', 'file.webp'] -> 'properties/file.webp')
    // The rewrite already strips '/uploads' prefix, so path is relative to uploads directory
    const relativePath = path.join('/');

    // Only look in UPLOADS_DIR (or fixed absolute path on server).
    // Без fallback-ов на cwd/.next – все файлы хранятся в одной постоянной папке.
    const baseDir = process.env.UPLOADS_DIR || '/opt/apartment-project/public/uploads';
    const candidates = [baseDir];

    let fullPath: string | null = null;
    for (const baseDir of candidates) {
      const candidatePath = join(baseDir, relativePath);
      if (existsSync(candidatePath)) {
        fullPath = candidatePath;
        break;
      }
    }

    if (!fullPath) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = await readFile(fullPath);
    
    // Determine content type based on file extension
    const extension = relativePath.split('.').pop()?.toLowerCase();
    const contentType = getContentType(extension || '');

    // Return file with appropriate headers
    // Для загруженных файлов отключаем агрессивный кеш – всегда можно получить свежую версию
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('Error serving file:', error);
    return NextResponse.json(
      { error: 'Failed to serve file' },
      { status: 500 }
    );
  }
}

function getContentType(extension: string): string {
  const contentTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
  };
  
  return contentTypes[extension] || 'application/octet-stream';
}

