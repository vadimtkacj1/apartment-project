import { cache } from 'react';
import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';
import { DEFAULT_THEME_ID, isThemeId, resolveTheme, type ThemeDef, type ThemeId } from './registry';

/**
 * Resolved theme for the public site. Safe to call from any server component —
 * `cache()` dedupes the lookup so the layout and the page share one query, and
 * rendered pages are themselves cached (ISR), so this is not a per-visitor hit.
 *
 * A DB hiccup falls back to the default theme rather than blanking the site.
 */
export const getActiveTheme = cache(async (): Promise<ThemeDef> => {
  // Env override — lets a second instance serve a fixed theme on its own port
  //   SITE_THEME=moonlit-dark PORT=3002 npm run start
  // without touching what the main instance (and the DB) serve.
  const forced = process.env.SITE_THEME;
  if (isThemeId(forced)) return resolveTheme(forced);

  try {
    const row = await prisma.siteSettings.findFirst({
      orderBy: { id: 'asc' },
      select: { activeTheme: true },
    });
    return resolveTheme(row?.activeTheme ?? DEFAULT_THEME_ID);
  } catch (error) {
    console.error('[theme] falling back to default — DB read failed:', error);
    return resolveTheme(DEFAULT_THEME_ID);
  }
});

/**
 * Persist the chosen theme (singleton row) and purge every cached public page
 * so the new skin shows up immediately instead of after the ISR window.
 */
export async function setActiveTheme(id: ThemeId): Promise<void> {
  const existing = await prisma.siteSettings.findFirst({ orderBy: { id: 'asc' }, select: { id: true } });

  if (existing) {
    await prisma.siteSettings.update({ where: { id: existing.id }, data: { activeTheme: id } });
  } else {
    await prisma.siteSettings.create({ data: { activeTheme: id } });
  }

  revalidatePath('/', 'layout');
}
