'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Layout, Affix } from 'antd';
import Sidenav from './Sidenav';
import Header from './Header';
import Footer from './Footer';

const { Header: AntHeader, Content, Sider } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [sidenavColor, setSidenavColor] = useState('#1890ff');
  const [sidenavType, setSidenavType] = useState('transparent');
  const [fixed, setFixed] = useState(false);

  const pathname = usePathname();
  const page = pathname.replace('/admin/', '').replace('/admin', '');

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <Layout
      className={`layout-dashboard ${page === 'rtl' ? 'layout-dashboard-rtl' : ''}`}
      dir="rtl"
    >
      {/* Backdrop for mobile */}
      {!collapsed && (
        <div
          className="sidebar-backdrop"
          onClick={() => setCollapsed(true)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 999,
          }}
        />
      )}
      <Sider
        breakpoint="lg"
        collapsed={collapsed}
        onCollapse={(collapsed) => setCollapsed(collapsed)}
        collapsedWidth="0"
        trigger={null}
        width={250}
        theme="light"
        className={`sider-primary ant-layout-sider-primary ${
          sidenavType === '#fff' ? 'active-route' : ''
        }`}
        style={{ background: sidenavType }}
      >
        <Sidenav color={sidenavColor} onClose={() => setCollapsed(true)} />
      </Sider>
      <Layout>
        {fixed ? (
          <Affix>
            <AntHeader className={`${fixed ? 'ant-header-fixed' : ''}`}>
              <Header
                onPress={toggleSidebar}
                name={page}
              />
            </AntHeader>
          </Affix>
        ) : (
          <AntHeader className={`${fixed ? 'ant-header-fixed' : ''}`}>
            <Header
              onPress={toggleSidebar}
              name={page}
            />
          </AntHeader>
        )}
        <Content className="content-ant">{children}</Content>
      </Layout>
    </Layout>
  );
}

