'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/shadcn/tabs';
import { useAdminI18n } from '@/lib/adminI18n';
import type { LocalizedText } from '@/config/adminSections';
import OwnersPage from '../owners/page';
import TeamPage from '../team/page';
import UsersPage from '../users/page';

/**
 * Unified "People" page: Owners / Team / Users as tabs of one route.
 * Each tab mounts the EXISTING page component (which keeps its own
 * AdminPageHeader + add button), so this page renders only the tab strip —
 * no second page header. Radix Tabs unmounts inactive panels by default,
 * so only the active tab's component mounts and fetches its data.
 */

type PeopleTab = 'owners' | 'team' | 'users';

// Tab labels follow the adminSections convention: inline {he,en} LocalizedText.
const TAB_LABELS: Record<PeopleTab, LocalizedText> = {
  owners: { he: 'בעלים', en: 'Owners' },
  team: { he: 'צוות', en: 'Team' },
  users: { he: 'משתמשים', en: 'Users' },
};
const TABS_ARIA: LocalizedText = { he: 'קטגוריות אנשים', en: 'People categories' };

function PeopleTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale, dir } = useAdminI18n();
  const { data: session } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  // Mirrors the old users section's role gate (roles: ['admin'] in adminSections)
  // and the in-page guard inside UsersPage itself.
  const canManageUsers = role === 'admin';

  const requested = searchParams.get('tab');
  const tab: PeopleTab =
    requested === 'team' ? 'team' : requested === 'users' && canManageUsers ? 'users' : 'owners';

  const setTab = (next: string) => {
    router.replace(`/admin/people?tab=${next}`, { scroll: false });
  };

  const visibleTabs: PeopleTab[] = canManageUsers ? ['owners', 'team', 'users'] : ['owners', 'team'];

  return (
    <Tabs dir={dir} value={tab} onValueChange={setTab}>
      <TabsList aria-label={TABS_ARIA[locale]}>
        {visibleTabs.map((k) => (
          <TabsTrigger key={k} value={k}>
            {TAB_LABELS[k][locale]}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="owners">
        <OwnersPage />
      </TabsContent>
      <TabsContent value="team">
        <TeamPage />
      </TabsContent>
      {canManageUsers && (
        <TabsContent value="users">
          <UsersPage />
        </TabsContent>
      )}
    </Tabs>
  );
}

export default function PeoplePage() {
  // useSearchParams requires a Suspense boundary in client pages.
  return (
    <Suspense fallback={null}>
      <PeopleTabs />
    </Suspense>
  );
}
