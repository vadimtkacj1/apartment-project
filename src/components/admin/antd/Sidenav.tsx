'use client';

import { Button, Tooltip } from 'antd';
import { CloseOutlined, LogoutOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { sectionsForRole } from '@/config/adminSections';

interface SidenavProps {
  color: string;
  onClose: () => void;
}

export default function Sidenav({ onClose }: SidenavProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as
    | { name?: string; email?: string; username?: string; role?: string }
    | undefined;
  const role = user?.role;

  // Nav items derive from the single source of truth (src/config/adminSections.tsx),
  // filtered by the current user's role (admin-only sections hidden from agents).
  const navItems = sectionsForRole(role).map((s) => ({
    key: s.key,
    href: s.href,
    label: s.label,
    icon: s.icon,
    isActive: s.isActive(pathname),
  }));

  return (
    <nav className="estate-sidenav" aria-label="ניווט ניהול">
      {/* Brand */}
      <div className="estate-brand">
        <Link href="/admin" className="estate-brand-link" onClick={onClose}>
          <span className="estate-brand-logo" aria-hidden="true">
            <svg viewBox="0 0 112 112" fill="currentColor">
              <path d="M55.03 5.92L88.17 68.07L73.41 67.96L54.82 33.88L32.67 75.40L47.28 75.45L55.92 88.59L11.31 88.70Z" />
              <path d="M57.49 75.50L92.21 75.45L99.27 88.70L66.86 88.75Z" />
            </svg>
          </span>
          <span className="estate-brand-text">
            <span className="estate-brand-title">Aiterra</span>
            <span className="estate-brand-sub">לוח ניהול</span>
          </span>
        </Link>
        <Tooltip title="סגור תפריט" placement="left">
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={onClose}
            aria-label="סגור תפריט"
            className="estate-close-btn"
          />
        </Tooltip>
      </div>

      {/* Navigation */}
      <ul className="estate-nav">
        {navItems.map((item) => (
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

      {/* Sign out */}
      <div className="estate-user">
        <Button
          type="text"
          icon={<LogoutOutlined />}
          className="estate-logout"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
        >
          התנתק
        </Button>
      </div>

      <style jsx global>{`
        /* ===== Estate Console sidebar — single source of truth =====
           One flat, calm look: navy primary, gold used only as a hairline
           accent, slate neutrals. Icons inherit currentColor so icon + label
           always share one color (inactive slate · hover navy · active white). */
        .estate-sidenav {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #ffffff;
          font-family: var(--font-assistant), Arial, Helvetica, sans-serif;
        }

        /* --- Brand --- */
        .estate-brand {
          position: relative;
          display: flex;
          align-items: center;
          padding: 18px 18px 16px;
          border-bottom: 1px solid #e6e8ec;
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
          border-radius: 11px;
          background: rgba(28, 54, 100, 0.06);
          color: #1c3664;
          flex-shrink: 0;
          overflow: hidden;
        }
        .estate-brand-logo svg {
          width: 26px;
          height: 26px;
          fill: currentColor;
        }
        .estate-brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
        }
        .estate-brand-title {
          font-size: 16px;
          font-weight: 700;
          color: #1c3664;
          letter-spacing: -0.01em;
        }
        .estate-brand-sub {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          color: #94a3b8;
        }
        .estate-brand-sub::before {
          content: '';
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #c5a357; /* lone gold accent */
          flex-shrink: 0;
        }
        .estate-close-btn {
          position: absolute;
          left: 10px;
          top: 12px;
          color: #94a3b8 !important;
          border-radius: 8px;
        }
        .estate-close-btn:hover {
          background: #f1f3f5 !important;
          color: #1c3664 !important;
        }

        /* --- Navigation --- */
        .estate-nav {
          list-style: none;
          margin: 0;
          padding: 14px 12px;
          flex: 1 1 auto;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .estate-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          color: #64748b;
          font-size: 14.5px;
          font-weight: 500;
          text-decoration: none !important;
          transition: background-color 0.15s ease, color 0.15s ease;
        }
        .estate-nav-item:hover {
          background: rgba(28, 54, 100, 0.06);
          color: #1c3664;
        }
        .estate-nav-item.active {
          background: #1c3664;
          color: #ffffff;
          font-weight: 600;
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
          fill: currentColor;
        }
        .estate-nav-label {
          color: inherit;
        }

        /* --- Sign-out footer --- */
        .estate-user {
          flex: 0 0 auto;
          border-top: 1px solid #e6e8ec;
          padding: 12px 16px;
        }
        .estate-logout.ant-btn {
          width: 100%;
          height: 38px;
          justify-content: center;
          border-radius: 9px;
          font-weight: 600;
          color: #64748b;
        }
        .estate-logout.ant-btn:hover {
          background: rgba(28, 54, 100, 0.06) !important;
          color: #1c3664 !important;
        }

        /* The ✕ only makes sense for the mobile overlay. On desktop the
           sidebar is permanent and the header hamburger collapses/expands it,
           so a second close control here is redundant — hide it. */
        @media (min-width: 992px) {
          .estate-close-btn.ant-btn {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
