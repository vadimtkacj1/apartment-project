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
  // Mobile-first defaults: SSR / first paint render the CLOSED, mobile state so
  // a phone never flashes the open sidebar (and its 250px content margin) before
  // JS runs. The matchMedia effect promotes to the open desktop state on mount.
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  const sidenavColor = '#1C3664';

  const pathname = usePathname();
  const page = pathname.replace('/admin/', '').replace('/admin', '');

  // Single source of truth for "are we in overlay (mobile) mode": one matchMedia
  // query, which also fires reliably on orientationchange. Crossing the 992px
  // breakpoint re-syncs the default (desktop = open, mobile = closed); it does
  // not fire on every resize tick, so a manual toggle within a range is kept.
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

  // On phones, auto-close the overlay after a navigation so tapping a nav item
  // doesn't leave the menu + backdrop covering the new page. The permanent
  // desktop sider is untouched.
  //
  // Query matchMedia directly instead of reading `isMobile`: on mount this effect
  // runs with the FIRST render's closure, where isMobile is still its `true`
  // default — so it re-collapsed the sider on desktop right after the matchMedia
  // effect had opened it, and the sidebar never showed until you hit the burger.
  useEffect(() => {
    if (window.matchMedia('(max-width: 991px)').matches) setCollapsed(true);
  }, [pathname]);

  // Lock body scroll while the overlay sidebar is open on mobile, so the page
  // behind the dim backdrop can't scroll under the finger.
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
    <Layout
      className={`layout-dashboard ${collapsed ? 'sidebar-collapsed' : 'sidebar-open'}`}
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
        <AntHeader>
          <Header onPress={toggleSidebar} collapsed={collapsed} name={page} />
        </AntHeader>
        <Content className="content-ant">{children}</Content>
        <Footer />
      </Layout>
    </Layout>
  );
}
