'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Layout } from 'antd';
import Sidenav from './Sidenav';
import Header from './Header';
import Footer from './Footer';

const { Header: AntHeader, Content, Sider } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(true);
  const sidenavColor = '#1C3664';

  const pathname = usePathname();
  const page = pathname.replace('/admin/', '').replace('/admin', '');

  useEffect(() => {
    setCollapsed(true);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = collapsed ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [collapsed]);

  useEffect(() => {
    if (collapsed) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCollapsed(true);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [collapsed]);

  const toggleSidebar = () => setCollapsed((c) => !c);
  const closeSidebar = () => setCollapsed(true);

  return (
    <Layout
      className={`layout-dashboard ${collapsed ? 'sidebar-collapsed' : 'sidebar-open'}`}
      dir="rtl"
    >
      {!collapsed && (
        <div className="sidebar-backdrop" onClick={closeSidebar} aria-hidden="true" />
      )}

      <Sider
        trigger={null}
        width={250}
        theme="light"
        className="sider-primary ant-layout-sider-primary"
      >
        <Sidenav color={sidenavColor} onClose={closeSidebar} />
      </Sider>

      <Layout>
        <AntHeader>
          <Header onPress={toggleSidebar} collapsed={collapsed} name={page} />
        </AntHeader>
        <Content className="content-ant">{children}</Content>
        <Footer />
      </Layout>
    </Layout>
  );
}
