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

    // Production: UPLOADS_DIR must match nginx (e.g. /opt/apartment-project/public/uploads)
    // Fallbacks for different deployment layouts
    const candidates = [
      process.env.UPLOADS_DIR,
      join(process.cwd(), 'public', 'uploads'),
      join(process.cwd(), 'uploads'),
      join(process.cwd(), '..', '..', 'public', 'uploads'), // when cwd is .next/standalone
    ].filter(Boolean) as string[];

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
    // Use shorter cache for fresh uploads to avoid serving stale cached images
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, must-revalidate', // 1 hour cache, must revalidate
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

