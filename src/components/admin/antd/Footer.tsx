'use client';

import { useAdminMessages } from '@/lib/adminI18n';
import { navMessages } from '@/lib/adminI18n/messages/nav';

export default function Footer() {
  const t = useAdminMessages(navMessages);
  const year = new Date().getFullYear();

  return (
    // .ant-layout-footer is the load-bearing shell class (see antd-admin.css:
    // transparent bg, 12px/24px padding, flush margins on phones).
    <footer className="ant-layout-footer">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>{t.footerRights(year)}</span>
        <span className="font-semibold">{t.footerSystem}</span>
      </div>
    </footer>
  );
}
