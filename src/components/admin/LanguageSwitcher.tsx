'use client';

import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminI18n, type AdminLocale } from '@/lib/adminI18n';

/**
 * Hebrew / English toggle for the admin panel. Language names are shown in
 * their own language on purpose (standard practice for language pickers).
 */
export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useAdminI18n();

  const options: { label: string; value: AdminLocale }[] = [
    { label: 'עברית', value: 'he' },
    { label: 'English', value: 'en' },
  ];

  const control = (
    <div
      role="group"
      aria-label={locale === 'he' ? 'שפת ממשק' : 'Interface language'}
      className="inline-flex items-center gap-0.5 rounded-lg bg-muted p-0.5"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => setLocale(o.value)}
          aria-pressed={locale === o.value}
          className={cn(
            'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
            locale === o.value
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );

  if (compact) return control;

  return (
    <span className="inline-flex items-center gap-2">
      <Globe className="size-3.5 text-muted-foreground" aria-hidden="true" />
      {control}
    </span>
  );
}
