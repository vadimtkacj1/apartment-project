import { NextRequest, NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/require-admin';
import { prisma } from '@/lib/prisma';
import { DEFAULT_THEME_ID, isThemeId } from '@/themes/registry';
import { setActiveTheme } from '@/themes/server';

/** Current public-site settings (theme id). */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const row = await prisma.siteSettings.findFirst({
      orderBy: { id: 'asc' },
      select: { activeTheme: true },
    });
    return NextResponse.json({ activeTheme: row?.activeTheme ?? DEFAULT_THEME_ID });
  } catch (error) {
    console.error('Error reading site settings:', error);
    return NextResponse.json({ activeTheme: DEFAULT_THEME_ID });
  }
}

/** Switch the public theme. Unknown ids are rejected rather than silently stored. */
export async function PUT(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const next = body?.activeTheme;

    if (!isThemeId(next)) {
      return NextResponse.json({ error: 'Unknown theme id' }, { status: 400 });
    }

    await setActiveTheme(next);
    return NextResponse.json({ success: true, activeTheme: next });
  } catch (error) {
    console.error('Error saving site settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
