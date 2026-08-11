'use client';

import React from 'react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/shadcn/tooltip';
// Breadcrumbs derive from the single source of truth (src/config/adminSections.tsx).
import { buildAdminCrumbs } from '@/config/adminSections';
import { useAdminI18n, useAdminMessages } from '@/lib/adminI18n';
import { navMessages } from '@/lib/adminI18n/messages/nav';
import LanguageSwitcher from '@/components/admin/LanguageSwitcher';

interface HeaderProps {
  onPress: () => void;
  name: string;
  collapsed?: boolean;
}

export default function Header({ onPress, name, collapsed = false }: HeaderProps) {
  const { locale, dir } = useAdminI18n();
  const t = useAdminMessages(navMessages);
  const crumbs = buildAdminCrumbs(name, locale);
  const Sep = dir === 'rtl' ? ChevronLeft : ChevronRight;
  // The sidebar sits at the inline-start edge — right in RTL — so the panel
  // icon must mirror with direction to point at the actual sidebar side.
  const PanelOpen = dir === 'rtl' ? PanelRightOpen : PanelLeftOpen;
  const PanelClose = dir === 'rtl' ? PanelRightClose : PanelLeftClose;

  return (
    <div className="admin-header-row flex w-full items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onPress}
              aria-label={collapsed ? t.openMenu : t.collapseMenu}
              className="text-slate-600"
            >
              {collapsed ? <PanelOpen className="!size-[18px]" /> : <PanelClose className="!size-[18px]" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">{collapsed ? t.openMenu : t.collapseMenu}</TooltipContent>
        </Tooltip>
        <LanguageSwitcher />
      </div>

      <nav
        aria-label="breadcrumb"
        className="flex min-w-0 items-center gap-1 overflow-hidden text-[13px]"
      >
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <React.Fragment key={i}>
              {i > 0 && <Sep className="size-3.5 shrink-0 text-slate-400" aria-hidden="true" />}
              {!isLast && c.href ? (
                <Link href={c.href} className="shrink-0 text-muted-foreground hover:text-primary">
                  {c.title}
                </Link>
              ) : (
                <span className={isLast ? 'truncate font-semibold text-[var(--text-ink)]' : 'shrink-0 text-muted-foreground'}>
                  {c.title}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
}
