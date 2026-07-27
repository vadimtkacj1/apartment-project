import type { Metadata } from 'next';
import React from 'react';
import { notFound } from 'next/navigation';

import { getFullProperty } from '@/lib/property-detail';
import MoonlitCatalog from '@/themes/moonlit/MoonlitCatalog';
import { isThemeId, resolveTheme } from '@/themes/registry';
import MoonlitShell from '@/themes/moonlit/MoonlitShell';
import MoonlitHome from '@/themes/moonlit/MoonlitHome';
import MoonlitProperty from '@/themes/moonlit/MoonlitProperty';
import PreviewLinks from '@/themes/moonlit/PreviewLinks';
import { getMoonlitContact } from '@/themes/moonlit/data';
import { getMoonlitContent } from '@/themes/moonlit/content.server';

/**
 * Theme preview, walkable.
 *
 * `/theme-preview/<theme>` shows the themed homepage; `/theme-preview/<theme>/
 * apartments/<id>` the themed property page, and so on. PreviewLinks rewrites
 * clicks so a whole browsing session stays inside the preview — the live site
 * keeps whatever theme the admin chose.
 */
export const metadata: Metadata = {
  title: 'תצוגה מקדימה של ערכת עיצוב',
  robots: { index: false, follow: false },
};

export const revalidate = 60;

export default async function ThemePreviewPage({
  params,
}: {
  params: Promise<{ theme: string; rest?: string[] }>;
}) {
  const { theme: id, rest = [] } = await params;
  if (!isThemeId(id)) notFound();

  const theme = resolveTheme(id);
  if (theme.family !== 'moonlit') notFound();

  const [contact, content] = await Promise.all([getMoonlitContact(), getMoonlitContent()]);

  let body: React.ReactNode;

  if (rest.length === 0) {
    body = <MoonlitHome variant={theme.variant ?? 'luxe'} />;
  } else if (rest[0] === 'apartments' && rest.length === 1) {
    body = <MoonlitCatalog />;
  } else if (rest[0] === 'apartments' && rest.length === 2) {
    const property = await getFullProperty(parseInt(rest[1])).catch(() => null);
    if (!property) notFound();
    const serialized = JSON.parse(JSON.stringify(property));
    body = (
      <MoonlitProperty
        property={serialized}
        title={serialized.title}
        description={serialized.description?.trim() || ''}
      />
    );
  } else {
    notFound();
  }

  return (
    <MoonlitShell theme={theme} contact={contact} content={content}>
      <PreviewLinks theme={theme.id} />
      {body}
    </MoonlitShell>
  );
}
