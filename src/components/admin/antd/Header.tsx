'use client';

import { Row, Col, Breadcrumb, Button, Tooltip } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Link from 'next/link';
// Breadcrumbs derive from the single source of truth (src/config/adminSections.tsx).
import { buildAdminCrumbs } from '@/config/adminSections';
import { useAdminI18n, useAdminMessages } from '@/lib/adminI18n';
import { navMessages } from '@/lib/adminI18n/messages/nav';
import LanguageSwitcher from '@/components/admin/LanguageSwitcher';

const FONT = "var(--font-assistant), Arial, Helvetica, sans-serif";

interface HeaderProps {
  onPress: () => void;
  name: string;
  collapsed?: boolean;
}

export default function Header({ onPress, name, collapsed = false }: HeaderProps) {
  const { locale } = useAdminI18n();
  const t = useAdminMessages(navMessages);
  const crumbs = buildAdminCrumbs(name, locale);

  return (
    <Row
      align="middle"
      justify="space-between"
      wrap={false}
      className="admin-header-row"
      style={{ width: '100%', margin: 0, gap: 12 }}
    >
      {/* Single, clear control: collapse / expand the sidebar.
          (User identity + logout live in the sidebar footer.) */}
      <Col flex="none" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Tooltip title={collapsed ? t.openMenu : t.collapseMenu} placement="bottom">
          <Button
            type="text"
            className="sidebar-toggler"
            onClick={onPress}
            aria-label={collapsed ? t.openMenu : t.collapseMenu}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            style={{ color: '#475569', fontSize: '18px', minWidth: 44, minHeight: 44 }}
          />
        </Tooltip>
        <LanguageSwitcher />
      </Col>

      {/* Breadcrumb: allowed to shrink/truncate so a deep Hebrew trail can't
          collide with the toggle on a 360px screen (minWidth:0 + flex). */}
      <Col
        flex="auto"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 0, overflow: 'hidden' }}
      >
        <Breadcrumb
          items={crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1;
            if (!isLast && c.href) {
              return {
                title: (
                  <Link href={c.href} style={{ color: '#64748B', fontFamily: FONT }}>
                    {c.title}
                  </Link>
                ),
              };
            }
            return {
              title: (
                <span
                  style={{
                    color: isLast ? '#051150' : '#64748B',
                    fontWeight: isLast ? 600 : 400,
                    fontFamily: FONT,
                  }}
                >
                  {c.title}
                </span>
              ),
            };
          })}
        />
      </Col>
    </Row>
  );
}
