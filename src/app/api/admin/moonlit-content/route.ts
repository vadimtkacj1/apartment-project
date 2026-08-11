import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/require-admin';
import { prisma } from '@/lib/prisma';
import { MOONLIT_DEFAULTS, mergeMoonlitContent } from '@/themes/moonlit/content';

/** Current Moonlit theme content, defaults filled in. */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const row = await prisma.moonlitContent.findFirst({ orderBy: { id: 'asc' } });
    return NextResponse.json(mergeMoonlitContent(row as Record<string, unknown> | null));
  } catch (error) {
    console.error('Error reading moonlit content:', error);
    return NextResponse.json(MOONLIT_DEFAULTS);
  }
}

/** Only the known keys are persisted; anything else in the body is ignored. */
export async function PUT(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const data = {
      bannerSlides: body.bannerSlides ?? undefined,
      facilities: body.facilities ?? undefined,
      testimonials: body.testimonials ?? undefined,
      aboutText: body.aboutText ?? undefined,
      aboutImageMain: body.aboutImageMain ?? undefined,
      aboutImageInset: body.aboutImageInset ?? undefined,
      aboutBadgeValue: body.aboutBadgeValue ?? undefined,
      aboutBadgeLabel: body.aboutBadgeLabel ?? undefined,
      aboutCtaLabel: body.aboutCtaLabel ?? undefined,
      bandImage: body.bandImage ?? undefined,
      navItems: body.navItems ?? undefined,
      searchCities: body.searchCities ?? undefined,
      searchRooms: body.searchRooms ?? undefined,
      searchBudgets: body.searchBudgets ?? undefined,
      newsletterTitle: body.newsletterTitle ?? undefined,
      footerAbout: body.footerAbout ?? undefined,
      footerColumns: body.footerColumns ?? undefined,
    };

    const existing = await prisma.moonlitContent.findFirst({ orderBy: { id: 'asc' }, select: { id: true } });
    if (existing) {
      await prisma.moonlitContent.update({ where: { id: existing.id }, data });
    } else {
      await prisma.moonlitContent.create({ data });
    }

    // The public pages are ISR-cached — purge them so edits show immediately.
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving moonlit content:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
