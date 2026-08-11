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
    newInquiriesBadge: (count: number) => `${count} פניות חדשות`,
    signOut: 'התנתק',
    roleAdmin: 'מנהל',
    roleAgent: 'סוכן',
    add: 'הוספה',
    edit: 'עריכה',
    footerRights: (year: number) => `© ${year} Aiterra · כל הזכויות שמורות`,
    footerSystem: 'מערכת ניהול נכסים',
  },
  en: {
    adminRoot: 'Admin',
    adminPanel: 'Admin Panel',
    openMenu: 'Open menu',
    collapseMenu: 'Collapse menu',
    closeMenu: 'Close menu',
    adminNavAria: 'Admin navigation',
    newInquiriesBadge: (count: number) => `${count} new inquiries`,
    signOut: 'Sign out',
    roleAdmin: 'Admin',
    roleAgent: 'Agent',
    add: 'Add',
    edit: 'Edit',
    footerRights: (year: number) => `© ${year} Aiterra · All rights reserved`,
    footerSystem: 'Property Management System',
  },
});
