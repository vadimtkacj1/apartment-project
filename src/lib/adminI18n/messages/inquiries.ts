import { defineMessages } from '@/lib/adminI18n';

/** Admin inquiries page: stats, filters, table, mobile cards, details modal. */
export const inquiriesMessages = defineMessages({
  he: {
    title: 'פניות לקוחות',

    // Toasts
    loadError: 'שגיאה בטעינת הפניות',
    statusUpdateError: 'שגיאה בעדכון הסטטוס',
    updated: 'הפנייה עודכנה',
    saveError: 'שגיאה בשמירה',
    deleted: 'הפנייה נמחקה',
    deleteError: 'שגיאה במחיקה',

    // Status labels
    statusNew: 'חדשה',
    statusInProgress: 'בטיפול',
    statusClosed: 'סגורה',

    // Stats cards
    statTotal: 'סה״כ',
    statNew: 'חדשות',
    statInProgress: 'בטיפול',
    statClosed: 'סגורות',

    // Segmented filter
    filterAll: (count: number) => `הכל (${count})`,
    filterNew: (count: number) => `חדשות (${count})`,
    filterInProgress: (count: number) => `בטיפול (${count})`,
    filterClosed: (count: number) => `סגורות (${count})`,

    // Table columns
    colStatus: 'סטטוס',
    colClient: 'לקוח',
    colMessage: 'הודעה',
    colProperty: 'נכס',
    colAgent: 'סוכן',
    colDate: 'תאריך',

    // Actions
    detailsTooltip: 'פרטים והערות',
    deleteConfirm: 'למחוק את הפנייה?',
    deleteOk: 'מחק',
    cancel: 'ביטול',
    detailsButton: 'פרטים',
    deleteButton: 'מחיקה',

    // Empty state
    empty: 'אין עדיין פניות',

    // Mobile card field labels
    fieldPhone: 'טלפון',
    fieldEmail: 'אימייל',
    fieldProperty: 'נכס',
    fieldAgent: 'סוכן',

    // Details modal
    modalTitle: (name: string) => `פנייה — ${name}`,
    save: 'שמירה',
    close: 'סגירה',
    messageLabel: 'הודעה',
    sourceLabel: (source: string) => `מקור: ${source}`,
    assignedAgent: 'סוכן מטפל',
    assignAgentPlaceholder: 'שייך סוכן',
    internalNotes: 'הערות פנימיות',
    notesPlaceholder: 'הערות לצוות...',
  },
  en: {
    title: 'Customer Inquiries',

    // Toasts
    loadError: 'Failed to load inquiries',
    statusUpdateError: 'Failed to update status',
    updated: 'Inquiry updated',
    saveError: 'Failed to save',
    deleted: 'Inquiry deleted',
    deleteError: 'Failed to delete',

    // Status labels
    statusNew: 'New',
    statusInProgress: 'In Progress',
    statusClosed: 'Closed',

    // Stats cards
    statTotal: 'Total',
    statNew: 'New',
    statInProgress: 'In Progress',
    statClosed: 'Closed',

    // Segmented filter
    filterAll: (count: number) => `All (${count})`,
    filterNew: (count: number) => `New (${count})`,
    filterInProgress: (count: number) => `In Progress (${count})`,
    filterClosed: (count: number) => `Closed (${count})`,

    // Table columns
    colStatus: 'Status',
    colClient: 'Client',
    colMessage: 'Message',
    colProperty: 'Property',
    colAgent: 'Agent',
    colDate: 'Date',

    // Actions
    detailsTooltip: 'Details & notes',
    deleteConfirm: 'Delete this inquiry?',
    deleteOk: 'Delete',
    cancel: 'Cancel',
    detailsButton: 'Details',
    deleteButton: 'Delete',

    // Empty state
    empty: 'No inquiries yet',

    // Mobile card field labels
    fieldPhone: 'Phone',
    fieldEmail: 'Email',
    fieldProperty: 'Property',
    fieldAgent: 'Agent',

    // Details modal
    modalTitle: (name: string) => `Inquiry — ${name}`,
    save: 'Save',
    close: 'Close',
    messageLabel: 'Message',
    sourceLabel: (source: string) => `Source: ${source}`,
    assignedAgent: 'Assigned Agent',
    assignAgentPlaceholder: 'Assign agent',
    internalNotes: 'Internal Notes',
    notesPlaceholder: 'Notes for the team...',
  },
});
