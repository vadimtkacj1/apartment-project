import { Award, Users, Building2, Star } from 'lucide-react';

export const stats = [
  { icon: Award, value: '20+', label: 'שנות ניסיון' },
  { icon: Users, value: '1000+', label: 'לקוחות מרוצים' },
  { icon: Building2, value: '500M+', label: 'שווי עסקאות' },
  { icon: Star, value: '98%', label: 'שביעות רצון' }
];

export const owners = [
  {
    id: 1,
    name: 'רם מזרחי',
    licenceNumber: '3019640',
    title: 'מייסד ומתווך נדל"ן',
    image: '/images/owner1.jpg',
    phone: '050-549-6626',
    email: 'rammiz800@gmail.com',
    description: 'רם הוא מתווך נדל"ן מנוסה המתמחה בשיווק דירות למכירה בחולון. הוא ידוע בגישה הישירה, ביכולת להבין במהירות את צרכי הלקוח ובניהול משא ומתן מדויק שמוביל לתוצאות.'
  },
  {
    id: 2,
    name: 'חיים ענבי',
    licenceNumber: '3164492',
    title: 'מייסד ומתווך נדל"ן',
    image: '/images/owner2.jpg',
    phone: '050-675-9999',
    email: 'hd.nadlan@gmail.com',
    description: 'חיים מביא ניסיון רב בתחום התיווך והשיווק, עם הכרות מעמיקה של שכונות חולון והסביבה. חיים מתמקד בליווי אישי, זמינות גבוהה ושירות מקצועי לכל לקוח.'
  }
];

export const team = [
  {
    id: 1,
    name: 'תומר גל',
    licenceNumber: '30829716',
    role: 'סוכן נדל״ן',
    image: '/agent-second.jpg',
    phone: '050-901-7800',
    mobile: '050-901-7800',
    fax: '',
    email: 'twmr0560@gmail.com',
    description: "סוכן נדל״ן מנוסה המתמחה בחולון ובת-ים, עם היכרות עמוקה של השכונות והקונים המקומיים. משלב תמחור מדויק, שיווק חכם וניהול מו״מ חד כדי להביא לעסקה מהירה ובתנאים הטובים ביותר"
  },
  {
    id: 2,
    name: 'ליאור גמיש',
    role: 'סוכנת נדל״ן',
    image: '/agent-fisrt.jpg',
    phone: '',
    mobile: '',
    fax: '',
    email: '',
    description: "סוכנת נדל״ן מנוסה הפועלת מזה מספר שנים באזור חולון ובת-ים, עם היכרות מעמיקה של השכונות, מחירי השוק וקהל הקונים המקומי. מתמחה בליווי מוכרים ורוכשים משלב התמחור והבדיקות ועד סגירת העסקה, תוך התאמה אישית לצרכים ולמטרות הלקוח. משלבת שיווק מדויק, ניהול משא ומתן מקצועי וזמינות מלאה כדי להגיע לתוצאה בטוחה ובתנאים הטובים ביותר"
  }
];

export type Owner = typeof owners[0];
export type TeamMember = typeof team[0];
