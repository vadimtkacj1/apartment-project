'use client';

import React, { useEffect, useState } from 'react';
import { Check, ExternalLink, Loader2, Save } from 'lucide-react';

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import MoonlitContentEditor from '@/components/admin/MoonlitContentEditor';
import { toast } from '@/components/shadcn/sonner';
import { Button } from '@/components/shadcn/button';
import { Card, CardTitle } from '@/components/shadcn/card';
import { Skeleton } from '@/components/shadcn/skeleton';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';
import { useAdminI18n, useAdminMessages } from '@/lib/adminI18n';
import { designMessages } from '@/lib/adminI18n/messages/design';
import { DEFAULT_THEME_ID, THEMES, type ThemeDef, type ThemeId } from '@/themes/registry';

/** Four-chip palette preview, so a theme is recognisable without opening it. */
function Swatches({ theme, labels }: { theme: ThemeDef; labels: string[] }) {
  const t = theme.tokens;
  const chips = [t.bg, t.surface, t.accent, t.dark];
  return (
    <div className="flex items-center gap-2">
      {chips.map((color, i) => (
        <span
          key={`${theme.id}-${i}`}
          title={labels[i]}
          aria-label={labels[i]}
          className="inline-block size-6 rounded-md border border-border"
          style={{ background: color }}
        />
      ))}
    </div>
  );
}

/** Miniature of the theme's chrome + hero, drawn from its own tokens. */
function ThemeThumb({ theme }: { theme: ThemeDef }) {
  const t = theme.tokens;
  return (
    <div
      className="overflow-hidden rounded-lg border border-border"
      style={{ background: t.bg, height: 132 }}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between px-3" style={{ background: t.dark, height: 22 }}>
        <span className="inline-block h-1.5 w-10 rounded-full" style={{ background: t.onDark, opacity: 0.7 }} />
        <span className="inline-block h-1.5 w-6 rounded-full" style={{ background: t.accent }} />
      </div>
      <div className="px-4 py-3">
        <span className="inline-block h-1.5 w-12 rounded-full" style={{ background: t.accent }} />
        <span className="mt-2 block h-2.5 w-3/4 rounded" style={{ background: t.ink, opacity: 0.85 }} />
        <span className="mt-1.5 block h-2.5 w-1/2 rounded" style={{ background: t.ink, opacity: 0.55 }} />
        <div className="mt-3 flex gap-2">
          <span className="inline-block h-4 w-14 rounded" style={{ background: t.accent }} />
          <span className="inline-block h-4 w-14 rounded border" style={{ borderColor: t.line }} />
        </div>
      </div>
      <div className="flex gap-2 px-4">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="inline-block h-6 flex-1 rounded border"
            style={{ background: t.surface, borderColor: t.line }}
          />
        ))}
      </div>
    </div>
  );
}

export default function DesignPage() {
  const t = useAdminMessages(designMessages);
  const { locale } = useAdminI18n();

  const [activeTheme, setActiveTheme] = useState<ThemeId>(DEFAULT_THEME_ID);
  const [selected, setSelected] = useState<ThemeId>(DEFAULT_THEME_ID);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const dirty = selected !== activeTheme;
  useUnsavedChangesWarning(dirty);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/admin/site-settings');
        if (!res.ok) throw new Error('request failed');
        const data = await res.json();
        if (cancelled) return;
        const current = (data?.activeTheme ?? DEFAULT_THEME_ID) as ThemeId;
        setActiveTheme(current);
        setSelected(current);
      } catch {
        if (!cancelled) toast.error(t.loadFailed);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeTheme: selected }),
      });
      if (!res.ok) throw new Error('request failed');
      setActiveTheme(selected);
      toast.success(t.saved);
    } catch {
      toast.error(t.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  const swatchLabels = [t.swatchBg, t.swatchSurface, t.swatchAccent, t.swatchDark];

  return (
    <div>
      <AdminPageHeader
        title={t.pageTitle}
        subtitle={t.pageSubtitle}
        extra={
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{dirty ? t.unsaved : t.allSaved}</span>
            <Button onClick={save} disabled={!dirty || saving || loading}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              {saving ? t.saving : t.save}
            </Button>
          </div>
        }
      />

      <Card className="p-5">
        <div className="mb-4 border-b border-border pb-3">
          <CardTitle className="text-base font-semibold">{t.themesCard}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{t.themesHelper}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {THEMES.map((theme) => {
              const isSelected = selected === theme.id;
              const isLive = activeTheme === theme.id;
              const previewHref = theme.family === 'classic' ? '/' : `/theme-preview/${theme.id}`;

              return (
                <div
                  key={theme.id}
                  className={`rounded-xl border p-4 transition-colors ${
                    isSelected ? 'border-primary bg-primary/[0.04]' : 'border-border hover:border-primary/40'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelected(theme.id)}
                    aria-pressed={isSelected}
                    className="block w-full text-start"
                  >
                    <ThemeThumb theme={theme} />

                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-semibold text-foreground">{theme.name[locale]}</h3>
                        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                          {theme.description[locale]}
                        </p>
                      </div>
                      {isSelected && (
                        <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="size-3.5" />
                        </span>
                      )}
                    </div>
                  </button>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                    <Swatches theme={theme} labels={swatchLabels} />
                    <div className="flex items-center gap-3">
                      {isLive && (
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-[12px] font-medium text-secondary-foreground">
                          {t.active}
                        </span>
                      )}
                      <a
                        href={previewHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={t.previewHint}
                        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline"
                      >
                        <ExternalLink className="size-3.5" />
                        {theme.family === 'classic' ? t.liveSite : t.preview}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <MoonlitContentEditor />
    </div>
  );
}
