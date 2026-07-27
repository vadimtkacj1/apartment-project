import { prisma } from '@/lib/prisma';

import { mergeMoonlitContent, type MoonlitContentData } from './content';

/**
 * Server-only accessor. Kept apart from content.ts so the admin editor (a
 * client component) can import the defaults + types without dragging Prisma —
 * and with it `pg`/`dns`/`fs` — into the browser bundle.
 */
export async function getMoonlitContent(): Promise<MoonlitContentData> {
  const row = await prisma.moonlitContent.findFirst({ orderBy: { id: 'asc' } }).catch(() => null);
  return mergeMoonlitContent(row as Record<string, unknown> | null);
}
