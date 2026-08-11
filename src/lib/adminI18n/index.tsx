'use client';

/**
 * Lightweight i18n for the ADMIN PANEL only (the public site stays Hebrew-only).
 *
 * - Base language: Hebrew (RTL). Second language: English (LTR).
 * - The chosen locale persists in localStorage ('admin-locale') and drives
 *   antd's ConfigProvider `direction` + `locale` from the admin layout.
 *
 * Message files live in src/lib/adminI18n/messages/<namespace>.ts and export
 * `defineMessages({ he: {...}, en: {...} })`. Values are strings or template
 * functions; the `en` side is type-checked against the `he` shape so the two
 * languages can never drift apart.
 *
 * Component usage:
 *   const t = useAdminMessages(propertiesMessages);
 *   <h1>{t.title}</h1>            // plain string
 *   message.success(t.saved(name)) // parameterized string
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type AdminLocale = 'he' | 'en';
export type AdminDir = 'rtl' | 'ltr';

export const DEFAULT_ADMIN_LOCALE: AdminLocale = 'he';
export const ADMIN_LOCALES: readonly AdminLocale[] = ['he', 'en'] as const;

const STORAGE_KEY = 'admin-locale';

export function dirOf(locale: AdminLocale): AdminDir {
  return locale === 'he' ? 'rtl' : 'ltr';
}

/**
 * Mirrors the Hebrew message shape onto another locale: every key must exist,
 * strings stay strings and template functions keep their exact signature.
 * Nested groups are allowed.
 */
export type MessagesShape<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => string
    ? (...args: A) => string
    : T[K] extends string
      ? string
      : MessagesShape<T[K]>;
};

export interface AdminMessages<T> {
  he: T;
  en: MessagesShape<T>;
}

/** Identity helper that enforces he/en key parity at the definition site. */
export function defineMessages<T>(messages: AdminMessages<T>): AdminMessages<T> {
  return messages;
}

/** Non-hook accessor for the rare non-component call site. */
export function getMessages<T>(
  messages: AdminMessages<T>,
  locale: AdminLocale
): MessagesShape<T> {
  return (locale === 'he' ? messages.he : messages.en) as MessagesShape<T>;
}

interface AdminI18nContextValue {
  locale: AdminLocale;
  dir: AdminDir;
  setLocale: (locale: AdminLocale) => void;
}

const AdminI18nContext = createContext<AdminI18nContextValue | null>(null);

export function AdminI18nProvider({ children }: { children: React.ReactNode }) {
  // SSR/first paint always renders the Hebrew default (matches the server
  // markup); the saved preference is promoted right after mount.
  const [locale, setLocaleState] = useState<AdminLocale>(DEFAULT_ADMIN_LOCALE);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'he' || saved === 'en') setLocaleState(saved);
    } catch {
      /* storage unavailable (private mode etc.) — keep the default */
    }
  }, []);

  const setLocale = useCallback((next: AdminLocale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* non-fatal */
    }
  }, []);

  const dir = dirOf(locale);

  // Keep <html> lang/dir in sync while inside the admin so scrollbars, text
  // flow and assistive tech follow the chosen language; restore the public
  // site's Hebrew RTL defaults when the admin tree unmounts.
  useEffect(() => {
    const el = document.documentElement;
    el.lang = locale;
    el.dir = dir;
    return () => {
      el.lang = 'he';
      el.dir = 'rtl';
    };
  }, [locale, dir]);

  const value = useMemo(() => ({ locale, dir, setLocale }), [locale, dir, setLocale]);

  return <AdminI18nContext.Provider value={value}>{children}</AdminI18nContext.Provider>;
}

export function useAdminI18n(): AdminI18nContextValue {
  const ctx = useContext(AdminI18nContext);
  if (!ctx) {
    throw new Error('useAdminI18n must be used inside <AdminI18nProvider> (admin layout)');
  }
  return ctx;
}

/** Returns the message record for the active locale, fully typed. */
export function useAdminMessages<T>(messages: AdminMessages<T>): MessagesShape<T> {
  const { locale } = useAdminI18n();
  return getMessages(messages, locale);
}
