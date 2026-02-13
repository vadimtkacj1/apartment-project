'use client';

import { Row, Col, Breadcrumb, Button } from 'antd';
import { signOut } from 'next-auth/react';
import { LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';

const pageNames: Record<string, string> = {
  '': 'לוח בקרה',
  'properties': 'נכסים',
  'properties/new': 'הוסף נכס חדש',
  'contact': 'פרטי התקשרות',
  'contact/contact-info': 'פרטי התקשרות',
};

interface HeaderProps {
  onPress: () => void;
  name: string;
}

export default function Header({ onPress, name }: HeaderProps) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  const pageName = pageNames[name] || name.replace('/', '');

  return (
    <Row 
      align="middle" 
      justify="space-between"
      style={{ padding: '16px 24px', width: '100%', margin: 0 }}
    >
      <Col>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            type="text"
            className="sidebar-toggler"
            onClick={onPress}
            icon={<MenuOutlined />}
            style={{ color: '#595959' }}
          />
          <Button
            type="text"
            onClick={handleLogout}
            icon={<LogoutOutlined />}
            style={{ color: '#595959'}}
          >
            התנתק
          </Button>
        </div>
      </Col>

      <Col style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Breadcrumb
          items={[
            { title: <Link href="/admin" style={{ color: '#8c8c8c' }}>ניהול</Link> },
            { title: <span style={{ color: '#141414', fontWeight: 600 }}>{pageName}</span> },
          ]}
        />
      </Col>
    </Row>
  );
}