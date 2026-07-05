'use client';

import { Segmented, Tooltip } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useAdminI18n, type AdminLocale } from '@/lib/adminI18n';

/**
 * Hebrew / English toggle for the admin panel. Language names are shown in
 * their own language on purpose (standard practice for language pickers).
 */
export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useAdminI18n();

  const control = (
    <Segmented<AdminLocale>
      size="small"
      value={locale}
      onChange={(v) => setLocale(v)}
      options={[
        { label: 'עברית', value: 'he' },
        { label: 'English', value: 'en' },
      ]}
      aria-label={locale === 'he' ? 'שפת ממשק' : 'Interface language'}
    />
  );

  if (compact) return control;

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <GlobalOutlined style={{ color: '#8c8c8c', fontSize: 14 }} aria-hidden="true" />
      {control}
    </span>
  );
}
