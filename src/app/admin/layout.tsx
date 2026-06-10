'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import MainLayout from '@/components/admin/antd/MainLayout';
import { usePathname } from 'next/navigation';
import { ConfigProvider } from 'antd';
import '@/styles/antd-admin.css';
import '@/styles/admin-rtl-fix.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return (
      <SessionProvider>
        <ConfigProvider direction="rtl">
          {children}
        </ConfigProvider>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      <ConfigProvider direction="rtl">
        <MainLayout>{children}</MainLayout>
      </ConfigProvider>
    </SessionProvider>
  );
}
