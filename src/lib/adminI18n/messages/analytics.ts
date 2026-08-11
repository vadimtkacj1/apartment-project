import { defineMessages } from '@/lib/adminI18n';

/** Admin analytics dashboard: KPIs, charts, tables, filters. */
export const analyticsMessages = defineMessages({
  he: {
    // Page header
    title: 'דשבורד אנליטיקה',
    subtitle: 'צפה בביצועי האתר והנכסים שלך בזמן אמת',
    refresh: 'רענן',
    resetData: 'איפוס נתונים',
    deleteConfirmTitle: 'מחיקת נתונים',
    deleteConfirmDescription: 'האם אתה בטוח שברצונך למחוק את כל ההיסטוריה? פעולה זו אינה הפיכה.',
    deleteAll: 'מחק הכל',
    cancel: 'ביטול',

    // Feedback messages
    loadError: 'שגיאה בטעינת הנתונים',
    deleteSuccess: 'האנליטיקה נמחקה בהצלחה',
    deleteError: 'שגיאה במחיקת האנליטיקה',
    loadingData: 'טוען נתונים...',
    noDataInRange: 'אין נתונים בטווח',

    // Filters bar
    dateRangeLabel: 'טווח תאריכים:',
    fromDate: 'מתאריך',
    toDate: 'עד תאריך',
    filterByProperty: 'סינון לפי נכס:',
    selectProperty: 'בחר נכס',
    filterByVisitor: 'סינון לפי מבקר:',
    selectVisitor: 'בחר מבקר',
    showAll: 'הצג הכל',
    propertyOption: (id: number, views: number) => `נכס #${id} (${views} צפיות)`,
    clicksCount: (n: number) => `${n} לחיצות`,

    // Selected visitor card
    userActivity: 'פעילות משתמש:',
    totalClicksOf: (n: number) => `${n} לחיצות סה״כ`,
    clearFilter: 'נקה סינון',
    visitor: (num: number | string) => `מבקר #${num}`,

    // KPI cards
    trafficKpis: 'מדדי תנועה',
    totalViews: 'סה״כ צפיות',
    totalClicks: 'סה״כ לחיצות (פעולות)',
    engagement: 'מעורבות',
    uniqueUsers: 'משתמשים ייחודיים',

    // Inquiries (leads) section
    inquiriesSection: 'פניות (לידים)',
    totalInquiries: 'סה״כ פניות',
    newInquiries: 'פניות חדשות',
    inquiriesToday: 'פניות היום',
    inquiriesLast7Days: 'פניות ב-7 ימים',
    trafficSources: 'מקורות תנועה',
    inquiriesBySource: 'פניות לפי מקור',
    inquiriesByStatus: 'פניות לפי סטטוס',

    // Charts
    trendsOverTime: 'מגמות לאורך זמן',
    actionsDistribution: 'התפלגות פעולות',
    topProperties: 'נכסים מובילים (לפי פעולות)',
    activeVisitors: 'מבקרים פעילים',
    viewsLegend: 'צפיות',
    clicksLegend: 'לחיצות',
    filteredTag: 'מסונן',
    propertyFallback: (id: number) => `נכס #${id}`,

    // Optional blocks (added from the block picker)
    visitorsTrend: 'מבקרים ייחודיים לאורך זמן',
    topPropertiesViews: 'נכסים מובילים (לפי צפיות)',
    deviceSplit: 'פילוח מכשירים',
    browserSplit: 'פילוח דפדפנים',
    hourlyActivity: 'פעילות לפי שעה',
    weekdayActivity: 'פעילות לפי יום בשבוע',
    funnel: 'משפך המרה',
    deviceMobile: 'נייד',
    deviceDesktop: 'שולחני',
    eventsLegend: 'אירועים',
    weekdayShort: (index: number) => ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'][index] || '',
    ofPrevious: (rate: string) => `${rate}% מהשלב הקודם`,

    // More optional blocks
    averagesKpis: 'ממוצעים יומיים',
    avgViewsPerDay: 'צפיות ליום',
    avgClicksPerDay: 'לחיצות ליום',
    peakHour: 'שעת השיא',
    peakDay: 'יום השיא',
    propertyPerformance: 'ביצועי נכסים',
    colViews: 'צפיות',
    colClicks: 'לחיצות',
    colCtr: 'יחס פעולות',
    eventTypesTable: 'פירוט פעולות',
    colShare: 'חלק',
    returningVisitors: 'מבקרים חוזרים',
    visitorNew: 'חד-פעמי',
    visitorReturning: 'חוזר',
    visitFrequency: 'תדירות ביקורים',
    visitBucket: (label: string) => `${label} ביקורים`,
    visitBucketOne: 'ביקור אחד',
    engagementTrend: 'מעורבות לאורך זמן',
    engagementLegend: 'לחיצות ל-100 צפיות',
    busiestDays: 'הימים העמוסים ביותר',
    noHourData: '—',

    // Recent activity tables
    recentActions: 'פעולות אחרונות',
    recentViews: 'צפיות אחרונות',
    colProperty: 'נכס',
    colAction: 'פעולה',
    colVisitorId: 'מזהה מבקר',
    colBrowser: 'דפדפן',
    colDate: 'תאריך',
    notAvailable: 'לא זמין',

    // Referer buckets (keys come from classifyReferer in the API)
    trafficLabels: {
      direct: 'כניסה ישירה',
      internal: 'ניווט באתר',
      google: 'Google',
      facebook: 'Facebook',
      instagram: 'Instagram',
      yad2: 'Yad2',
      madlan: 'Madlan',
      whatsapp: 'WhatsApp',
      bing: 'Bing',
      duckduckgo: 'DuckDuckGo',
      twitter: 'X/Twitter',
      other: 'אחר',
    },

    // Inquiry.source raw keys (fallback to the raw key when unknown)
    leadSourceLabels: {
      contact_form: 'טופס יצירת קשר',
      property_page: 'עמוד נכס',
      property: 'עמוד נכס',
      whatsapp: 'וואטסאפ',
      phone: 'טלפון',
      email: 'אימייל',
      footer: 'פוטר',
      unknown: 'לא ידוע',
    },

    // Matches STATUS_META in /admin/inquiries
    statusLabels: {
      new: 'חדשה',
      in_progress: 'בטיפול',
      closed: 'סגורה',
    },

    // Click event types
    eventTypes: {
      property_view: 'צפייה בנכס',
      click_property: 'לחיצה על נכס',
      click_phone: 'לחיצה על טלפון',
      click_email: 'לחיצה על אימייל',
      click_whatsapp: 'לחיצה על וואטסאפ',
      contact_form: 'שליחת טופס',
      click_button: 'לחיצה על כפתור',
    },
  },
  en: {
    // Page header
    title: 'Analytics Dashboard',
    subtitle: 'View your site and property performance in real time',
    refresh: 'Refresh',
    resetData: 'Reset Data',
    deleteConfirmTitle: 'Delete Data',
    deleteConfirmDescription: 'Are you sure you want to delete all history? This action cannot be undone.',
    deleteAll: 'Delete All',
    cancel: 'Cancel',

    // Feedback messages
    loadError: 'Error loading data',
    deleteSuccess: 'Analytics deleted successfully',
    deleteError: 'Error deleting analytics',
    loadingData: 'Loading data...',
    noDataInRange: 'No data in this range',

    // Filters bar
    dateRangeLabel: 'Date range:',
    fromDate: 'Start date',
    toDate: 'End date',
    filterByProperty: 'Filter by property:',
    selectProperty: 'Select property',
    filterByVisitor: 'Filter by visitor:',
    selectVisitor: 'Select visitor',
    showAll: 'Show all',
    propertyOption: (id: number, views: number) => `Property #${id} (${views} views)`,
    clicksCount: (n: number) => `${n} clicks`,

    // Selected visitor card
    userActivity: 'User activity:',
    totalClicksOf: (n: number) => `${n} clicks total`,
    clearFilter: 'Clear filter',
    visitor: (num: number | string) => `Visitor #${num}`,

    // KPI cards
    trafficKpis: 'Traffic KPIs',
    totalViews: 'Total Views',
    totalClicks: 'Total Clicks (Actions)',
    engagement: 'Engagement',
    uniqueUsers: 'Unique Users',

    // Inquiries (leads) section
    inquiriesSection: 'Inquiries (Leads)',
    totalInquiries: 'Total Inquiries',
    newInquiries: 'New Inquiries',
    inquiriesToday: 'Inquiries Today',
    inquiriesLast7Days: 'Inquiries in Last 7 Days',
    trafficSources: 'Traffic Sources',
    inquiriesBySource: 'Inquiries by Source',
    inquiriesByStatus: 'Inquiries by Status',

    // Charts
    trendsOverTime: 'Trends Over Time',
    actionsDistribution: 'Actions Breakdown',
    topProperties: 'Top Properties (by Actions)',
    activeVisitors: 'Active Visitors',
    viewsLegend: 'Views',
    clicksLegend: 'Clicks',
    filteredTag: 'Filtered',
    propertyFallback: (id: number) => `Property #${id}`,

    // Optional blocks (added from the block picker)
    visitorsTrend: 'Unique Visitors Over Time',
    topPropertiesViews: 'Top Properties (by Views)',
    deviceSplit: 'Device Breakdown',
    browserSplit: 'Browser Breakdown',
    hourlyActivity: 'Activity by Hour',
    weekdayActivity: 'Activity by Weekday',
    funnel: 'Conversion Funnel',
    deviceMobile: 'Mobile',
    deviceDesktop: 'Desktop',
    eventsLegend: 'Events',
    weekdayShort: (index: number) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index] || '',
    ofPrevious: (rate: string) => `${rate}% of previous step`,

    // More optional blocks
    averagesKpis: 'Daily Averages',
    avgViewsPerDay: 'Views per day',
    avgClicksPerDay: 'Clicks per day',
    peakHour: 'Peak hour',
    peakDay: 'Peak weekday',
    propertyPerformance: 'Property Performance',
    colViews: 'Views',
    colClicks: 'Clicks',
    colCtr: 'Action rate',
    eventTypesTable: 'Actions Breakdown (table)',
    colShare: 'Share',
    returningVisitors: 'Returning Visitors',
    visitorNew: 'One-off',
    visitorReturning: 'Returning',
    visitFrequency: 'Visit Frequency',
    visitBucket: (label: string) => `${label} visits`,
    visitBucketOne: 'Single visit',
    engagementTrend: 'Engagement Over Time',
    engagementLegend: 'Clicks per 100 views',
    busiestDays: 'Busiest Days',
    noHourData: '—',

    // Recent activity tables
    recentActions: 'Recent Actions',
    recentViews: 'Recent Views',
    colProperty: 'Property',
    colAction: 'Action',
    colVisitorId: 'Visitor ID',
    colBrowser: 'Browser',
    colDate: 'Date',
    notAvailable: 'Not available',

    // Referer buckets (keys come from classifyReferer in the API)
    trafficLabels: {
      direct: 'Direct',
      internal: 'Internal navigation',
      google: 'Google',
      facebook: 'Facebook',
      instagram: 'Instagram',
      yad2: 'Yad2',
      madlan: 'Madlan',
      whatsapp: 'WhatsApp',
      bing: 'Bing',
      duckduckgo: 'DuckDuckGo',
      twitter: 'X/Twitter',
      other: 'Other',
    },

    // Inquiry.source raw keys (fallback to the raw key when unknown)
    leadSourceLabels: {
      contact_form: 'Contact form',
      property_page: 'Property page',
      property: 'Property page',
      whatsapp: 'WhatsApp',
      phone: 'Phone',
      email: 'Email',
      footer: 'Footer',
      unknown: 'Unknown',
    },

    // Matches STATUS_META in /admin/inquiries
    statusLabels: {
      new: 'New',
      in_progress: 'In Progress',
      closed: 'Closed',
    },

    // Click event types
    eventTypes: {
      property_view: 'Property view',
      click_property: 'Property click',
      click_phone: 'Phone click',
      click_email: 'Email click',
      click_whatsapp: 'WhatsApp click',
      contact_form: 'Form submission',
      click_button: 'Button click',
    },
  },
});
