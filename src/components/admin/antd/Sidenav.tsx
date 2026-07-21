'use client';

import { X, LogOut } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/shadcn/tooltip';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { sectionsForRole } from '@/config/adminSections';
import { useAdminI18n, useAdminMessages } from '@/lib/adminI18n';
import { navMessages } from '@/lib/adminI18n/messages/nav';

// Sidebar nav grouped into small labelled sections (Polar/Exa/Stripe) instead of
// a flat 9-item list — easier to scan. New sections default to the first group.
const NAV_GROUPS: { id: string; label: Record<'he' | 'en', string> }[] = [
  { id: 'main', label: { he: 'ניהול', en: 'Management' } },
  { id: 'settings', label: { he: 'הגדרות ומידע', en: 'Settings & info' } },
];
const SECTION_GROUP: Record<string, string> = {
  dashboard: 'main', inquiries: 'main', properties: 'main', owners: 'main', team: 'main', analytics: 'main',
  homepage: 'settings', contact: 'settings', users: 'settings',
};

interface SidenavProps {
  onClose: () => void;
}

export default function Sidenav({ onClose }: SidenavProps) {
  const pathname = usePathname();
  const { locale } = useAdminI18n();
  const t = useAdminMessages(navMessages);
  const { data: session } = useSession();
  const user = session?.user as
    | { name?: string; email?: string; username?: string; role?: string }
    | undefined;
  const role = user?.role;
  const displayName = user?.name || user?.username || 'Admin';
  const initials = (displayName.trim().charAt(0) || 'A').toUpperCase();
  const roleLabel =
    role === 'admin' ? (locale === 'he' ? 'מנהל מערכת' : 'Administrator') : locale === 'he' ? 'סוכן' : 'Agent';
  const showRole = roleLabel.toLowerCase() !== displayName.toLowerCase();

  // Nav items derive from the single source of truth (src/config/adminSections.tsx),
  // filtered by the current user's role (admin-only sections hidden from agents).
  const navItems = sectionsForRole(role).map((s) => ({
    key: s.key,
    href: s.href,
    label: s.label[locale],
    icon: s.icon,
    isActive: s.isActive(pathname),
  }));

  // Bucket the (role-filtered) items into their labelled groups, in group order.
  const groupedNav = NAV_GROUPS.map((g) => ({
    label: g.label[locale],
    items: navItems.filter((i) => (SECTION_GROUP[i.key] ?? 'main') === g.id),
  })).filter((g) => g.items.length > 0);

  return (
    <nav className="estate-sidenav" aria-label={t.adminNavAria}>
      {/* Brand */}
      <div className="estate-brand">
        <Link href="/admin" className="estate-brand-link" onClick={onClose}>
          <span className="estate-brand-logo" aria-hidden="true">
            <img src="/aiterra-logo.png" alt="" />
          </span>
          <span className="estate-brand-text">
            <span className="estate-brand-title">Aiterra</span>
            <span className="estate-brand-sub">{t.adminPanel}</span>
          </span>
        </Link>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.closeMenu}
              className="estate-close-btn"
            >
              <X className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side={locale === 'he' ? 'left' : 'right'}>{t.closeMenu}</TooltipContent>
        </Tooltip>
      </div>

      {/* Navigation — grouped into labelled sections */}
      <div className="estate-nav">
        {groupedNav.map((group) => (
          <div className="estate-nav-group" key={group.label}>
            <div className="estate-nav-group-label">{group.label}</div>
            <ul className="estate-nav-list">
              {group.items.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={`estate-nav-item ${item.isActive ? 'active' : ''}`}
                    aria-current={item.isActive ? 'page' : undefined}
                  >
                    <span className="estate-nav-icon">{item.icon}</span>
                    <span className="estate-nav-label">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* User chip + sign out */}
      <div className="estate-user">
        <div className="estate-userchip">
          <span className="estate-avatar" aria-hidden="true">{initials}</span>
          <span className="estate-usermeta">
            <span className="estate-username" title={displayName}>{displayName}</span>
            {showRole && <span className="estate-userrole">{roleLabel}</span>}
          </span>
          <button
            type="button"
            className="estate-logout"
            aria-label={t.signOut}
            title={t.signOut}
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
          >
            <LogOut className="size-[18px]" />
          </button>
        </div>
      </div>

      <style jsx global>{`
        /* ===== Estate Console sidebar — dark "premium rail" =====
           Deep-navy rail against the light content canvas (Linear/Vercel/Retool
           pattern). Light text, sky accent on the active item; icons inherit
           currentColor so icon + label always share one color. */
        .estate-sidenav {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #0b1030;
          font-family: var(--font-assistant), Arial, Helvetica, sans-serif;
        }

        /* --- Brand --- */
        .estate-brand {
          position: relative;
          display: flex;
          align-items: center;
          padding: 18px 18px 16px;
          flex: 0 0 auto;
        }
        .estate-brand-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none !important;
        }
        .estate-brand-logo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.06);
        }
        .estate-brand-logo img {
          width: 30px;
          height: auto;
          display: block;
        }
        .estate-brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
        }
        .estate-brand-title {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
        }
        .estate-brand-sub {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.5);
        }
        .estate-brand-sub::before {
          content: '';
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #5594f1; /* sky accent pops on dark */
          flex-shrink: 0;
        }
        .estate-close-btn {
          position: absolute;
          inset-inline-end: 10px;
          top: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          padding: 0;
          background: transparent;
          border: 0;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.55);
          border-radius: 8px;
          transition: background-color 0.15s ease, color 0.15s ease;
        }
        .estate-close-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        /* --- Navigation --- */
        .estate-nav {
          margin: 0;
          padding: 8px 12px 14px;
          flex: 1 1 auto;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .estate-nav-group-label {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          padding: 12px 14px 6px;
        }
        .estate-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .estate-nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          min-height: 44px;
          box-sizing: border-box;
          padding: 0 14px;
          border-radius: 11px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 14.5px;
          font-weight: 500;
          text-decoration: none !important;
          transition: background-color 0.15s ease, color 0.15s ease;
        }
        .estate-nav-item:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #ffffff;
        }
        /* Active: soft sky wash + white text + a leading sky accent bar. */
        .estate-nav-item.active {
          background: rgba(85, 148, 241, 0.15);
          color: #ffffff;
          font-weight: 600;
        }
        .estate-nav-item.active::before {
          content: '';
          position: absolute;
          inset-inline-start: 5px;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 18px;
          border-radius: 3px;
          background: #5594f1;
        }
        .estate-nav-item.active .estate-nav-icon {
          color: #78a9f5;
        }
        .estate-nav-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }
        .estate-nav-icon svg {
          width: 20px;
          height: 20px;
        }
        .estate-nav-label {
          flex: 1 1 auto;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: inherit;
        }

        /* --- User chip footer --- */
        .estate-user {
          flex: 0 0 auto;
          padding: 10px 12px 14px;
          border-block-start: 1px solid rgba(255, 255, 255, 0.08);
        }
        .estate-userchip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 12px;
          transition: background-color 0.15s ease;
        }
        .estate-userchip:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .estate-avatar {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          flex-shrink: 0;
          background: rgba(85, 148, 241, 0.22);
          color: #b9d3fb;
          font-size: 14px;
          font-weight: 700;
        }
        .estate-usermeta {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1 1 auto;
          line-height: 1.25;
        }
        .estate-username {
          font-size: 13.5px;
          font-weight: 600;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .estate-userrole {
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.5);
        }
        .estate-logout {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          padding: 0;
          flex-shrink: 0;
          border: 0;
          background: transparent;
          cursor: pointer;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.55);
          transition: background-color 0.15s ease, color 0.15s ease;
        }
        .estate-logout:hover {
          background: rgba(239, 68, 68, 0.16);
          color: #fca5a5;
        }

        /* The ✕ only makes sense for the mobile overlay. On desktop the
           sidebar is permanent and the header hamburger collapses/expands it,
           so a second close control here is redundant — hide it. */
        @media (min-width: 992px) {
          .estate-close-btn {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
