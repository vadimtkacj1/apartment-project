import { defineMessages } from '@/lib/adminI18n';

/** Admin users management page: roles, table, create/edit modal, confirms. */
export const usersMessages = defineMessages({
  he: {
    title: 'משתמשי מערכת',
    addUser: 'הוספת משתמש',
    editUser: 'עריכת משתמש',

    roleAdmin: 'מנהל',
    roleAgent: 'סוכן',
    roleAdminOption: 'מנהל (גישה מלאה)',
    roleAgentOption: 'סוכן (גישה מוגבלת)',

    loadError: 'שגיאה בטעינת המשתמשים',
    userCreated: 'המשתמש נוצר',
    userUpdated: 'המשתמש עודכן',
    userDeleted: 'המשתמש נמחק',
    saveError: 'שגיאה בשמירה',
    updateError: 'שגיאה בעדכון',
    deleteError: 'שגיאה במחיקה',

    username: 'שם משתמש',
    name: 'שם',
    email: 'אימייל',
    role: 'תפקיד',
    active: 'פעיל',
    fullName: 'שם מלא',

    deleteConfirm: 'למחוק את המשתמש?',
    deleteConfirmBody: (username: string) =>
      `המשתמש "${username}" יימחק לצמיתות. לא ניתן לבטל פעולה זו.`,
    deleteOk: 'מחק',
    cancel: 'ביטול',
    save: 'שמירה',
    edit: 'עריכה',
    deleteAction: 'מחיקה',
    noUsers: 'אין משתמשים',

    password: 'סיסמה',
    newPasswordLabel: 'סיסמה חדשה (להשארת ריק — ללא שינוי)',
    showPassword: 'הצגת סיסמה',
    hidePassword: 'הסתרת סיסמה',
    invalidEmail: 'אימייל לא תקין',
    minChars: (n: number) => `לפחות ${n} תווים`,
  },
  en: {
    title: 'System Users',
    addUser: 'Add User',
    editUser: 'Edit User',

    roleAdmin: 'Admin',
    roleAgent: 'Agent',
    roleAdminOption: 'Admin (full access)',
    roleAgentOption: 'Agent (limited access)',

    loadError: 'Failed to load users',
    userCreated: 'User created',
    userUpdated: 'User updated',
    userDeleted: 'User deleted',
    saveError: 'Failed to save',
    updateError: 'Failed to update',
    deleteError: 'Failed to delete',

    username: 'Username',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    active: 'Active',
    fullName: 'Full Name',

    deleteConfirm: 'Delete this user?',
    deleteConfirmBody: (username: string) =>
      `The user "${username}" will be permanently deleted. This action cannot be undone.`,
    deleteOk: 'Delete',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    deleteAction: 'Delete',
    noUsers: 'No users',

    password: 'Password',
    newPasswordLabel: 'New password (leave blank to keep unchanged)',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    invalidEmail: 'Invalid email address',
    minChars: (n: number) => `At least ${n} characters`,
  },
});
