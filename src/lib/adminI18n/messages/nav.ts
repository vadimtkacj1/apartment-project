import { defineMessages } from '@/lib/adminI18n';

/** Admin shell: sidebar, header, breadcrumbs, footer. */
export const navMessages = defineMessages({
  he: {
    adminRoot: 'ניהול',
    adminPanel: 'לוח ניהול',
    openMenu: 'פתח תפריט',
    collapseMenu: 'כווץ תפריט',
    closeMenu: 'סגור תפריט',
    adminNavAria: 'ניווט ניהול',
    signOut: 'התנתק',
    add: 'הוספה',
    edit: 'עריכה',
    footerRights: (year: number) => `© ${year} רם נכסים · כל הזכויות שמורות`,
    footerSystem: 'מערכת ניהול נכסים',
  },
  en: {
    adminRoot: 'Admin',
    adminPanel: 'Admin Panel',
    openMenu: 'Open menu',
    collapseMenu: 'Collapse menu',
    closeMenu: 'Close menu',
    adminNavAria: 'Admin navigation',
    signOut: 'Sign out',
    add: 'Add',
    edit: 'Edit',
    footerRights: (year: number) => `© ${year} Ram Nechasim · All rights reserved`,
    footerSystem: 'Property Management System',
  },
});
