'use client';

import { Row, Col, Breadcrumb, Button, Tooltip } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Link from 'next/link';
// Breadcrumbs derive from the single source of truth (src/config/adminSections.tsx).
import { buildAdminCrumbs } from '@/config/adminSections';

const FONT = "var(--font-assistant), Arial, Helvetica, sans-serif";

interface HeaderProps {
  onPress: () => void;
  name: string;
  collapsed?: boolean;
}

export default function Header({ onPress, name, collapsed = false }: HeaderProps) {
  const crumbs = buildAdminCrumbs(name);

  return (
    <Row
      align="middle"
      justify="space-between"
      style={{ padding: '16px 24px', width: '100%', margin: 0 }}
    >
      {/* Single, clear control: collapse / expand the sidebar.
          (User identity + logout live in the sidebar footer.) */}
      <Col>
        <Tooltip title={collapsed ? 'פתח תפריט' : 'כווץ תפריט'} placement="bottom">
          <Button
            type="text"
            className="sidebar-toggler"
            onClick={onPress}
            aria-label={collapsed ? 'פתח תפריט' : 'כווץ תפריט'}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            style={{ color: '#595959', fontSize: '18px' }}
          />
        </Tooltip>
      </Col>

      <Col style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Breadcrumb
          items={crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1;
            if (!isLast && c.href) {
              return {
                title: (
                  <Link href={c.href} style={{ color: '#8c8c8c', fontFamily: FONT }}>
                    {c.title}
                  </Link>
                ),
              };
            }
            return {
              title: (
                <span
                  style={{
                    color: isLast ? '#1C3664' : '#8c8c8c',
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
