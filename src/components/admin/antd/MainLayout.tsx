'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidenav from './Sidenav';
import Header from './Header';
import Footer from './Footer';
import { useAdminI18n } from '@/lib/adminI18n';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Admin shell. Renders plain semantic elements but KEEPS the antd-era
 * structural class names (`ant-layout`, `sider-primary`, `content-ant`, …) so
 * the existing layout/sidebar/header CSS in antd-admin.css keeps applying
 * unchanged after the antd → shadcn swap.
 */
export default function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  const { dir } = useAdminI18n();

  const pathname = usePathname();
  const page = pathname.replace('/admin/', '').replace('/admin', '');

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 991px)');
    const apply = (matches: boolean) => {
      setIsMobile(matches);
      setCollapsed(matches);
    };
    apply(mq.matches);
    const onChange = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (isMobile) setCollapsed(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const lock = !collapsed && isMobile;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [collapsed, isMobile]);

  const toggleSidebar = () => setCollapsed((c) => !c);
  const closeSidebar = () => setCollapsed(true);

  return (
    <div
      className={`layout-dashboard ${collapsed ? 'sidebar-collapsed' : 'sidebar-open'}`}
      dir={dir}
    >
      {!collapsed && isMobile && (
        <div className="sidebar-backdrop" onClick={closeSidebar} aria-hidden="true" />
      )}

      <aside className="ant-layout-sider sider-primary">
        <div className="ant-layout-sider-children">
          <Sidenav onClose={closeSidebar} />
        </div>
      </aside>

      <div className="ant-layout">
        <header className="ant-layout-header">
          <Header onPress={toggleSidebar} collapsed={collapsed} name={page} />
        </header>
        <main className="content-ant">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
