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
    name: 'רם',
    title: 'מייסד ומתווך נדל"ן',
    image: '/images/owner1.jpg',
    phone: '*8851',
    email: 'ram@example.com',
    description: 'רם הוא מתווך נדל"ן מנוסה המתמחה בשיווק דירות למכירה בחולון. הוא ידוע בגישה הישירה, ביכולת להבין במהירות את צרכי הלקוח ובניהול משא ומתן מדויק שמוביל לתוצאות.'
  },
  {
    id: 2,
    name: 'חיים ענבי',
    title: 'מייסד ומתווך נדל"ן',
    image: '/images/owner2.jpg',
    phone: '*8851',
    email: 'haim@example.com',
    description: 'חיים מביא ניסיון רב בתחום התיווך והשיווק, עם הכרות מעמיקה של שכונות חולון והסביבה. חיים מתמקד בליווי אישי, זמינות גבוהה ושירות מקצועי לכל לקוח.'
  }
];

export const team = [
  {
    id: 1,
    name: 'תומר',
    role: 'סוכן נדל"ן',
    image: '/images/agent1.jpg',
    phone: '09-7407500',
    mobile: '052-3385053',
    fax: '09-7407600',
    email: 'tomer@example.com',
    description: 'סוכן נדל"ן המתמחה בדירות להשכרה ובאיתור נכסים המותאמים לצרכי הלקוח.'
  },
  {
    id: 2,
    name: 'ליאור',
    role: 'סוכנת נדל"ן',
    image: '/images/agent2.jpg',
    phone: '09-7407500',
    mobile: '052-7808233',
    fax: '09-7407600',
    email: 'lior@example.com',
    description: 'סוכנת נדל"ן המתמחה בדירות למכירה בחולון, עם דגש על שירות אישי וניהול תהליך יעיל ומדויק.'
  }
];

export type Owner = typeof owners[0];
export type TeamMember = typeof team[0];
