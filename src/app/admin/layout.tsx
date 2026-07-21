'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { DirectionProvider } from '@radix-ui/react-direction';
import { TooltipProvider } from '@/components/shadcn/tooltip';
import MainLayout from '@/components/admin/antd/MainLayout';
import { AdminI18nProvider, useAdminI18n } from '@/lib/adminI18n';
import { AdminToaster } from '@/components/shadcn/sonner';
import '@/styles/antd-admin.css';
import '@/styles/admin-design.css';
import '@/styles/admin-rtl-fix.css';
import '@/styles/admin-a11y.css';

/** Radix components read direction from <DirectionProvider>; the admin locale
 *  (Hebrew = RTL default, English = LTR) drives it. Toasts live here too. */
function AdminShell({ children }: { children: React.ReactNode }) {
  const { dir } = useAdminI18n();
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  return (
    <DirectionProvider dir={dir}>
      <TooltipProvider delayDuration={200}>
        {isLogin ? children : <MainLayout>{children}</MainLayout>}
        <AdminToaster />
      </TooltipProvider>
    </DirectionProvider>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminI18nProvider>
        <AdminShell>{children}</AdminShell>
      </AdminI18nProvider>
    </SessionProvider>
  );
}
