import type { ReactNode } from 'react';
import type { AdminLocale } from '@/lib/adminI18n';

/**
 * SINGLE SOURCE OF TRUTH for admin sections.
 * Drives BOTH the sidebar (Sidenav) and the breadcrumb trail (Header).
 *
 *   ➕ To ADD a feature:    add one entry below + create src/app/admin/<segment>/page.tsx
 *   ➖ To REMOVE a feature:  delete its entry below + delete the route folder
 *
 * Nav, active-state and breadcrumbs all follow automatically — nothing else to touch.
 */

/** A label in both admin languages; resolve with `label[locale]`. */
export type LocalizedText = Record<AdminLocale, string>;

export interface AdminSection {
  /** Stable key (antd Menu key / React key). */
  key: string;
  /** First path segment after /admin/ ('' = dashboard). Used for breadcrumbs. */
  segment: string;
  /** Label shown in the sidebar and breadcrumb (Hebrew base + English). */
  label: LocalizedText;
  /** Canonical route for this section's main page. */
  href: string;
  /** Sidebar icon (20×20, fill=currentColor). */
  icon: ReactNode;
  /** Active-state matcher against the current pathname. */
  isActive: (pathname: string) => boolean;
  /** If set, only these user roles may see/access this section (default: everyone). */
  roles?: string[];
  /** Route + label for the "add new" page (sections with a create/edit form). */
  addHref?: string;
  addLabel?: LocalizedText;
}

/** Sections the given role is allowed to see (sections without `roles` are public to all). */
export function sectionsForRole(role?: string): AdminSection[] {
  return ADMIN_SECTIONS.filter((s) => !s.roles || (role ? s.roles.includes(role) : false));
}

export const ADMIN_SECTIONS: AdminSection[] = [
  {
    key: 'dashboard',
    segment: '',
    label: { he: 'לוח בקרה', en: 'Dashboard' },
    href: '/admin',
    isActive: (p) => p === '/admin' || p === '/admin/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z" />
        <path d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z" />
        <path d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z" />
      </svg>
    ),
  },
  {
    key: 'inquiries',
    segment: 'inquiries',
    label: { he: 'פניות', en: 'Inquiries' },
    href: '/admin/inquiries',
    isActive: (p) => p.includes('/inquiries'),
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M18 5a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5zm-2 0l-6 3.75L4 5h12zM4 7.25l6 3.75 6-3.75V15H4V7.25z" />
      </svg>
    ),
  },
  {
    key: 'properties',
    segment: 'properties',
    label: { he: 'נכסים', en: 'Properties' },
    href: '/admin/properties',
    isActive: (p) => p.includes('/properties'),
    addHref: '/admin/properties/new',
    addLabel: { he: 'הוספת נכס', en: 'Add Property' },
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3 4H11V9H17V18H3V4ZM5 6H7V8H5V6ZM8 6H10V8H8V6ZM5 9.5H7V11.5H5V9.5ZM8 9.5H10V11.5H8V9.5ZM5.5 14H8.5V18H5.5V14ZM13 11H15V13H13V11ZM13 14.5H15V16.5H13V14.5Z"
        />
      </svg>
    ),
  },
  {
    // Owners / Team / Users merged into one tabbed page (/admin/people?tab=…).
    // The Users tab is gated to admins inside the page itself, so the section
    // is visible to everyone. Old routes stay live for deep links (see
    // LEGACY_CRUMB_SECTIONS below) and keep this section highlighted.
    key: 'people',
    segment: 'people',
    label: { he: 'אנשים', en: 'People' },
    href: '/admin/people',
    isActive: (p) =>
      p.includes('/people') || p.includes('/owners') || p.includes('/team') || p.includes('/users'),
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13 6C13 7.65685 11.6569 9 10 9C8.34315 9 7 7.65685 7 6C7 4.34315 8.34315 3 10 3C11.6569 3 13 4.34315 13 6Z" />
        <path d="M18 8C18 9.10457 17.1046 10 16 10C14.8954 10 14 9.10457 14 8C14 6.89543 14.8954 6 16 6C17.1046 6 18 6.89543 18 8Z" />
        <path d="M6 8C6 9.10457 5.10457 10 4 10C2.89543 10 2 9.10457 2 8C2 6.89543 2.89543 6 4 6C5.10457 6 6 6.89543 6 8Z" />
        <path d="M10 11C7.79086 11 6 12.7909 6 15V17H14V15C14 12.7909 12.2091 11 10 11Z" />
        <path d="M16 11C15.7348 11 15.4759 11.0314 15.2278 11.0914C15.7123 11.9121 16 12.8752 16 13.9V17H18V15C18 12.7909 17.2091 11 16 11Z" />
        <path d="M4 11C3.73481 11 3.47586 11.0314 3.22784 11.0914C2.74331 11.9121 2 12.8752 2 13.9V17H4V15C4 12.7909 2.79086 11 4 11Z" />
      </svg>
    ),
  },
  {
    key: 'homepage',
    segment: 'homepage',
    label: { he: 'עמוד הבית', en: 'Homepage' },
    href: '/admin/homepage',
    isActive: (p) => p.includes('/homepage'),
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
  },
  {
    key: 'design',
    segment: 'design',
    label: { he: 'עיצוב האתר', en: 'Site design' },
    href: '/admin/design',
    isActive: (p) => p.includes('/design'),
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H14c2.21 0 4-1.79 4-4 0-3.87-3.58-7-8-7ZM5.5 10a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm2.5-3.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm4 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm2.5 3.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" />
      </svg>
    ),
  },
  {
    key: 'analytics',
    segment: 'analytics',
    label: { he: 'אנליטיקה', en: 'Analytics' },
    href: '/admin/analytics',
    isActive: (p) => p.includes('/analytics'),
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 2C2 1.44772 2.44772 1 3 1H17C17.5523 1 18 1.44772 18 2V18C18 18.5523 17.5523 19 17 19H3C2.44772 19 2 18.5523 2 18V2ZM4 3V17H16V3H4ZM6 5H8V15H6V5ZM10 7H12V15H10V7ZM14 9H16V15H14V9Z" />
      </svg>
    ),
  },
  {
    key: 'contact',
    segment: 'contact',
    label: { he: 'פרטי התקשרות', en: 'Contact Info' },
    href: '/admin/contact/contact-info',
    isActive: (p) => p.includes('/contact'),
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
      </svg>
    ),
  },
];

/**
 * Sections that used to live in the sidebar but were merged into /admin/people.
 * Their routes remain live for deep links / bookmarks; these entries exist ONLY
 * so buildAdminCrumbs still resolves them (list, /new and edit pages) properly.
 */
type LegacyCrumbSection = Pick<AdminSection, 'segment' | 'label' | 'href' | 'addLabel'>;
const LEGACY_CRUMB_SECTIONS: LegacyCrumbSection[] = [
  {
    segment: 'owners',
    label: { he: 'בעלים', en: 'Owners' },
    href: '/admin/owners',
    addLabel: { he: 'הוספת בעלים', en: 'Add Owner' },
  },
  {
    segment: 'team',
    label: { he: 'צוות', en: 'Team' },
    href: '/admin/team',
    addLabel: { he: 'הוספת חבר צוות', en: 'Add Team Member' },
  },
  {
    segment: 'users',
    label: { he: 'משתמשים', en: 'Users' },
    href: '/admin/users',
  },
];

/** Build a breadcrumb trail from the current page path (never leaks raw slugs). */
export interface Crumb {
  title: string;
  href?: string;
}

const CRUMB_FALLBACKS: Record<AdminLocale, { root: string; add: string; edit: string }> = {
  he: { root: 'ניהול', add: 'הוספה', edit: 'עריכה' },
  en: { root: 'Admin', add: 'Add', edit: 'Edit' },
};

export function buildAdminCrumbs(name: string, locale: AdminLocale = 'he'): Crumb[] {
  const f = CRUMB_FALLBACKS[locale];
  const root: Crumb = { title: f.root, href: '/admin' };
  const base = name.split('/')[0]; // '' for the dashboard root
  const section =
    ADMIN_SECTIONS.find((s) => s.segment === base) ??
    LEGACY_CRUMB_SECTIONS.find((s) => s.segment === base);

  if (!section) return [root, { title: name }];

  // The section's own main page (dashboard, a list, or contact-info).
  const fullPath = name ? `/admin/${name}` : '/admin';
  if (fullPath === section.href) {
    return [root, { title: section.label[locale] }];
  }

  // Detail / new page, e.g. "properties/123" or "team/new".
  const sub = name.split('/').slice(1).join('/');
  const lastLabel = sub === 'new' ? section.addLabel?.[locale] || f.add : f.edit;
  return [root, { title: section.label[locale], href: section.href }, { title: lastLabel }];
}
