import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';

import { THEMES } from '@/themes/registry';
import { getActiveTheme } from '@/themes/server';

/**
 * Standalone theme gallery — the same cards as /admin/design, but viewable
 * without logging in: pick a theme and browse it live.
 *
 * Read-only on purpose: making a theme live for real visitors still happens in
 * the admin panel, so nobody can repaint the site from a public URL.
 */
export const metadata: Metadata = {
  title: 'ערכות עיצוב',
  robots: { index: false, follow: false },
};

export const revalidate = 60;

export default async function ThemesPage() {
  const active = await getActiveTheme();

  return (
    <div style={{ minHeight: '100vh', background: '#14161a', color: '#e7e9ee', padding: '40px 20px' }} dir="rtl">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>ערכות עיצוב</h1>
        <p style={{ color: '#9aa3b2', marginTop: 8, fontSize: 14 }}>
          לחצו על ערכה כדי לראות אותה חיה. הערכה שהמבקרים רואים נבחרת בפאנל הניהול.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 18,
            marginTop: 28,
          }}
        >
          {THEMES.map((theme) => {
            const t = theme.tokens;
            const href = theme.family === 'classic' ? '/' : `/theme-preview/${theme.id}`;
            const isLive = theme.id === active.id;

            return (
              <Link
                key={theme.id}
                href={href}
                style={{
                  display: 'block',
                  border: `1px solid ${isLive ? '#AB8A62' : '#2a2f39'}`,
                  borderRadius: 10,
                  overflow: 'hidden',
                  background: '#1c1f26',
                  color: 'inherit',
                }}
              >
                {/* palette-driven miniature */}
                <div style={{ background: t.bg, height: 128 }} aria-hidden="true">
                  <div style={{ background: t.dark, height: 20 }} />
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ background: t.accent, height: 5, width: 48, borderRadius: 3 }} />
                    <div
                      style={{ background: t.ink, height: 9, width: '72%', borderRadius: 3, marginTop: 8, opacity: 0.85 }}
                    />
                    <div
                      style={{ background: t.ink, height: 9, width: '46%', borderRadius: 3, marginTop: 5, opacity: 0.5 }}
                    />
                    <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                      <div style={{ background: t.accent, height: 16, width: 54, borderRadius: 3 }} />
                      <div style={{ border: `1px solid ${t.line}`, height: 16, width: 54, borderRadius: 3 }} />
                    </div>
                  </div>
                </div>

                <div style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <strong style={{ fontSize: 15 }}>{theme.name.he}</strong>
                    {isLive && (
                      <span
                        style={{
                          background: '#AB8A62',
                          color: '#1b1b1b',
                          borderRadius: 999,
                          padding: '2px 10px',
                          fontSize: 12,
                        }}
                      >
                        פעילה
                      </span>
                    )}
                  </div>
                  <p style={{ color: '#9aa3b2', fontSize: 13, lineHeight: 1.7, marginTop: 8 }}>{theme.description.he}</p>
                  <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                    {[t.bg, t.surface, t.accent, t.dark].map((c, i) => (
                      <span
                        key={i}
                        style={{ width: 22, height: 22, borderRadius: 5, background: c, border: '1px solid #2a2f39' }}
                      />
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <p style={{ marginTop: 28, fontSize: 13, color: '#838c9b' }}>
          <Link href="/admin/design" style={{ color: '#AB8A62' }}>
            לפאנל הניהול
          </Link>{' '}
          — שם בוחרים מה רואים המבקרים ושם נערך תוכן הערכה.{' '}
          <a href="/moonlit-ref/compare.html" style={{ color: '#AB8A62' }}>
            השוואה מול התבנית המקורית
          </a>
        </p>
      </div>
    </div>
  );
}
