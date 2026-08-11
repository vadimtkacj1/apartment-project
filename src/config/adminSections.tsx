import type { ReactNode } from 'react';

/**
 * SINGLE SOURCE OF TRUTH for admin sections.
 * Drives BOTH the sidebar (Sidenav) and the breadcrumb trail (Header).
 *
 *   ➕ To ADD a feature:    add one entry below + create src/app/admin/<segment>/page.tsx
 *   ➖ To REMOVE a feature:  delete its entry below + delete the route folder
 *
 * Nav, active-state and breadcrumbs all follow automatically — nothing else to touch.
 */
export interface AdminSection {
  /** Stable key (antd Menu key / React key). */
  key: string;
  /** First path segment after /admin/ ('' = dashboard). Used for breadcrumbs. */
  segment: string;
  /** Hebrew label shown in the sidebar and breadcrumb. */
  label: string;
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
  addLabel?: string;
}

/** Sections the given role is allowed to see (sections without `roles` are public to all). */
export function sectionsForRole(role?: string): AdminSection[] {
  return ADMIN_SECTIONS.filter((s) => !s.roles || (role ? s.roles.includes(role) : false));
}

export const ADMIN_SECTIONS: AdminSection[] = [
  {
    key: 'dashboard',
    segment: '',
    label: 'לוח בקרה',
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
    label: 'פניות',
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
    label: 'נכסים',
    href: '/admin/properties',
    isActive: (p) => p.includes('/properties'),
    addHref: '/admin/properties/new',
    addLabel: 'הוספת נכס',
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
    key: 'owners',
    segment: 'owners',
    label: 'בעלים',
    href: '/admin/owners',
    isActive: (p) => p.includes('/owners'),
    addHref: '/admin/owners/new',
    addLabel: 'הוספת בעלים',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 9C11.6569 9 13 7.65685 13 6C13 4.34315 11.6569 3 10 3C8.34315 3 7 4.34315 7 6C7 7.65685 8.34315 9 10 9Z" />
        <path d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18H3Z" />
      </svg>
    ),
  },
  {
    key: 'team',
    segment: 'team',
    label: 'צוות',
    href: '/admin/team',
    isActive: (p) => p.includes('/team'),
    addHref: '/admin/team/new',
    addLabel: 'הוספת חבר צוות',
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
    label: 'עמוד הבית',
    href: '/admin/homepage',
    isActive: (p) => p.includes('/homepage'),
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
  },
  {
    key: 'analytics',
    segment: 'analytics',
    label: 'אנליטיקה',
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
    label: 'פרטי התקשרות',
    href: '/admin/contact/contact-info',
    isActive: (p) => p.includes('/contact'),
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
      </svg>
    ),
  },
  {
    key: 'users',
    segment: 'users',
    label: 'משתמשים',
    href: '/admin/users',
    isActive: (p) => p.includes('/users'),
    roles: ['admin'], // only admins manage system users
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.53 1.53 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.53 1.53 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.53 1.53 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.53 1.53 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.53 1.53 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.53 1.53 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
        />
      </svg>
    ),
  },
];

/** Build a Hebrew breadcrumb trail from the current page path (never leaks raw slugs). */
export interface Crumb {
  title: string;
  href?: string;
}

export function buildAdminCrumbs(name: string): Crumb[] {
  const root: Crumb = { title: 'ניהול', href: '/admin' };
  const base = name.split('/')[0]; // '' for the dashboard root
  const section = ADMIN_SECTIONS.find((s) => s.segment === base);

  if (!section) return [root, { title: name }];

  // The section's own main page (dashboard, a list, or contact-info).
  const fullPath = name ? `/admin/${name}` : '/admin';
  if (fullPath === section.href) {
    return [root, { title: section.label }];
  }

  // Detail / new page, e.g. "properties/123" or "team/new".
  const sub = name.split('/').slice(1).join('/');
  const lastLabel = sub === 'new' ? section.addLabel || 'הוספה' : 'עריכה';
  return [root, { title: section.label, href: section.href }, { title: lastLabel }];
}
