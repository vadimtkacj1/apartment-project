'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import MainLayout from '@/components/admin/antd/MainLayout';
import { usePathname } from 'next/navigation';
import { ConfigProvider, App } from 'antd';
import { adminTheme } from '@/lib/adminTheme';
import '@/styles/antd-admin.css';
import '@/styles/admin-rtl-fix.css';
import '@/styles/admin-a11y.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return (
      <SessionProvider>
        <ConfigProvider direction="rtl" theme={adminTheme}>
          {/* antd v6 enables cssVar by default — App needs a real wrapper element
              to host the component CSS variables (message/modal/notification), so
              `component={false}` is invalid. Keep a div but take it out of the
              layout flow with display:contents to preserve the existing layout. */}
          <App style={{ display: 'contents' }}>{children}</App>
        </ConfigProvider>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      <ConfigProvider direction="rtl" theme={adminTheme}>
        <App style={{ display: 'contents' }}>
          <MainLayout>{children}</MainLayout>
        </App>
      </ConfigProvider>
    </SessionProvider>
  );
}
