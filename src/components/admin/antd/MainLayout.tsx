'use client';

import { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);
  const [fixed] = useState(false);
  const sidenavColor = '#1C3664';

  const pathname = usePathname();
  const page = pathname.replace('/admin/', '').replace('/admin', '');

  // Track viewport: collapse by default on mobile, and only re-sync the
  // open/closed state when actually crossing the breakpoint (so a manual
  // collapse isn't undone by every little resize).
  useEffect(() => {
    let mobile = window.innerWidth < 992;
    setIsMobile(mobile);
    setCollapsed(mobile);

    const onResize = () => {
      const next = window.innerWidth < 992;
      setIsMobile(next);
      if (next !== mobile) {
        mobile = next;
        setCollapsed(next);
      }
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggleSidebar = () => setCollapsed((c) => !c);
  const closeSidebar = () => setCollapsed(true);

  return (
    <Layout
      className={`layout-dashboard ${collapsed ? 'sidebar-collapsed' : 'sidebar-open'} ${
        page === 'rtl' ? 'layout-dashboard-rtl' : ''
      }`}
      dir="rtl"
    >
      {/* Dim backdrop — only on mobile, where the sidebar overlays content */}
      {!collapsed && isMobile && (
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
        {fixed ? (
          <Affix>
            <AntHeader className="ant-header-fixed">
              <Header onPress={toggleSidebar} collapsed={collapsed} name={page} />
            </AntHeader>
          </Affix>
        ) : (
          <AntHeader>
            <Header onPress={toggleSidebar} collapsed={collapsed} name={page} />
          </AntHeader>
        )}
        <Content className="content-ant">{children}</Content>
        <Footer />
      </Layout>
    </Layout>
  );
}
