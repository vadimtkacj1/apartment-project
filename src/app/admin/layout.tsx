'use client';

import React, { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import MainLayout from '@/components/admin/antd/MainLayout';
import { usePathname } from 'next/navigation';
import { ConfigProvider, App } from 'antd';
import heIL from 'antd/locale/he_IL';
import enUS from 'antd/locale/en_US';
import dayjs from 'dayjs';
import 'dayjs/locale/he';
import { adminTheme } from '@/lib/adminTheme';
import { AdminI18nProvider, useAdminI18n } from '@/lib/adminI18n';
import '@/styles/antd-admin.css';
import '@/styles/admin-rtl-fix.css';
import '@/styles/admin-a11y.css';

/** antd + dayjs follow the admin locale: Hebrew = RTL (default), English = LTR. */
function AdminAntdProvider({ children }: { children: React.ReactNode }) {
  const { locale, dir } = useAdminI18n();

  useEffect(() => {
    dayjs.locale(locale === 'he' ? 'he' : 'en');
  }, [locale]);

  return (
    <ConfigProvider direction={dir} locale={locale === 'he' ? heIL : enUS} theme={adminTheme}>
      {/* antd v6 enables cssVar by default — App needs a real wrapper element
          to host the component CSS variables (message/modal/notification), so
          `component={false}` is invalid. Keep a div but take it out of the
          layout flow with display:contents to preserve the existing layout. */}
      <App style={{ display: 'contents' }}>{children}</App>
    </ConfigProvider>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  return (
    <SessionProvider>
      <AdminI18nProvider>
        <AdminAntdProvider>
          {isLogin ? children : <MainLayout>{children}</MainLayout>}
        </AdminAntdProvider>
      </AdminI18nProvider>
    </SessionProvider>
  );
}
