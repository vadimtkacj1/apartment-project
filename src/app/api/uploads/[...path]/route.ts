import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { createReadStream, existsSync } from 'fs';
import { join, resolve, sep } from 'path';
import { Readable } from 'stream';

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
    const baseDir = resolve(process.env.UPLOADS_DIR || '/opt/apartment-project/public/uploads');

    // Resolve the requested path and confirm it stays inside baseDir.
    // Blocks path traversal via '..' / encoded segments (e.g. reading /etc/passwd
    // or the app's .env from this public, unauthenticated endpoint).
    const candidatePath = resolve(join(baseDir, relativePath));
    if (candidatePath !== baseDir && !candidatePath.startsWith(baseDir + sep)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    const fullPath = existsSync(candidatePath) ? candidatePath : null;

    if (!fullPath) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Determine content type based on file extension
    const extension = relativePath.split('.').pop()?.toLowerCase();
    const contentType = getContentType(extension || '');

    // Для загруженных файлов отключаем агрессивный кеш – всегда можно получить свежую версию
    const stats = await stat(fullPath);
    const etag = `"${stats.size.toString(16)}-${Math.floor(stats.mtimeMs).toString(16)}"`;
    const baseHeaders: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Access-Control-Allow-Origin': '*',
      'ETag': etag,
      'Last-Modified': stats.mtime.toUTCString(),
    };

    if (request.headers.get('if-none-match') === etag && !request.headers.get('range')) {
      return new NextResponse(null, { status: 304, headers: baseHeaders });
    }

    if (contentType.startsWith('video/')) {
      const fileSize = stats.size;
      const range = parseRange(request.headers.get('range'), fileSize);

      if (range === 'invalid') {
        return new NextResponse(null, {
          status: 416,
          headers: { ...baseHeaders, 'Content-Range': `bytes */${fileSize}` },
        });
      }

      const start = range ? range.start : 0;
      const end = range ? range.end : fileSize - 1;
      const stream = Readable.toWeb(
        createReadStream(fullPath, { start, end })
      ) as unknown as ReadableStream;

      return new NextResponse(stream, {
        status: range ? 206 : 200,
        headers: {
          ...baseHeaders,
          'Accept-Ranges': 'bytes',
          'Content-Length': String(end - start + 1),
          ...(range ? { 'Content-Range': `bytes ${start}-${end}/${fileSize}` } : {}),
        },
      });
    }

    // Read file
    const fileBuffer = await readFile(fullPath);

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, { headers: baseHeaders });
  } catch (error: any) {
    console.error('Error serving file:', error);
    return NextResponse.json(
      { error: 'Failed to serve file' },
      { status: 500 }
    );
  }
}

function parseRange(
  header: string | null,
  fileSize: number
): { start: number; end: number } | 'invalid' | null {
  if (!header) return null;

  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match) return 'invalid';

  const [, rawStart, rawEnd] = match;
  if (!rawStart && !rawEnd) return 'invalid';

  let start: number;
  let end: number;

  if (!rawStart) {
    const suffixLength = Number(rawEnd);
    if (suffixLength <= 0) return 'invalid';
    start = Math.max(0, fileSize - suffixLength);
    end = fileSize - 1;
  } else {
    start = Number(rawStart);
    end = rawEnd ? Number(rawEnd) : fileSize - 1;
  }

  if (!Number.isFinite(start) || !Number.isFinite(end)) return 'invalid';
  if (start >= fileSize || start > end) return 'invalid';

  return { start, end: Math.min(end, fileSize - 1) };
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
    'mp4': 'video/mp4',
    'm4v': 'video/mp4',
    'webm': 'video/webm',
    'mov': 'video/quicktime',
    'ogv': 'video/ogg',
  };

  return contentTypes[extension] || 'application/octet-stream';
}
