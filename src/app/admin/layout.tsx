'use client';

import React from 'react';
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

  // Login page should not show the admin chrome (sidebar/header)
  if (pathname === '/admin/login') {
    return (
      <ConfigProvider direction="rtl">
        {children}
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider direction="rtl">
      <MainLayout>{children}</MainLayout>
    </ConfigProvider>
  );
}
