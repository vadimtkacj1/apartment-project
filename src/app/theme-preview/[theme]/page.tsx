import type { Metadata } from 'next';
import React from 'react';
import { notFound } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import { isThemeId, resolveTheme } from '@/themes/registry';
import MoonlitShell from '@/themes/moonlit/MoonlitShell';
import { getMoonlitContact } from '@/themes/moonlit/data';
import { getMoonlitContent } from '@/themes/moonlit/content.server';
import MoonlitHome from '@/themes/moonlit/MoonlitHome';

/**
 * Admin-only theme preview: renders a theme's homepage + chrome without
 * switching the live site. Linked from /admin/design.
 *
 * Deliberately outside the (public) route group so it doesn't inherit the
 * active theme's shell — the preview brings its own.
 */
export const metadata: Metadata = {
  title: 'תצוגה מקדימה של ערכת עיצוב',
  robots: { index: false, follow: false },
};

export const revalidate = 60;

async function getOfficeContact() {
  try {
    const owners = await prisma.owner.findMany({
      where: { isActive: true },
      select: { phone: true, email: true },
      orderBy: { order: 'asc' },
    });
    return {
      phone: owners.find((o) => o.phone)?.phone ?? null,
      email: owners.find((o) => o.email)?.email ?? null,
    };
  } catch {
    return { phone: null, email: null };
  }
}

export default async function ThemePreviewPage({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme: id } = await params;
  if (!isThemeId(id)) notFound();

  const theme = resolveTheme(id);
  // The classic theme has no separate preview — that's just the live site.
  if (theme.family !== 'moonlit') notFound();

  const contact = await getMoonlitContact();
  const moonlitContent = await getMoonlitContent();

  return (
    <MoonlitShell
      theme={theme}
      contact={contact}
      content={moonlitContent}
    >
      <MoonlitHome variant={theme.variant ?? 'luxe'} />
    </MoonlitShell>
  );
}
