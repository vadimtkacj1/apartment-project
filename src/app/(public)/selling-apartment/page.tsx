import type { Metadata } from 'next';
import SellingApartmentContent from './SellingApartmentContent';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: 'מוכרים דירה בחולון | תהליך מכירה מקצועי',
  description: 'מדריך מכירת דירה בחולון: בדיקות משפטיות ומיסוי, הערכת שווי, שיווק מתקדם וניהול משא ומתן. רם נכסים וחיים ענבי — ליווי מלא ממחיר יציאה ועד חתימת החוזה.',
  alternates: {
    canonical: `${siteUrl}/selling-apartment`,
  },
  openGraph: {
    title: 'מוכרים דירה בחולון | תהליך מכירה מקצועי',
    description: 'מדריך מכירת דירה בחולון: בדיקות, הערכת שווי, שיווק מתקדם וניהול משא ומתן עם ליווי מלא.',
    url: `${siteUrl}/selling-apartment`,
  },
};

// Q/A text must stay byte-identical to the visible FAQ in SellingApartmentContent.tsx.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'אילו בדיקות צריך לעשות לפני מכירת דירה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'לפני הפרסום מומלץ לבצע בדיקת כשירות מלאה: הפקת נסח טאבו עדכני, בדיקת ארנונה, הוצאת תשריט בית משותף ובדיקת תיק הבניין בעירייה — כדי לוודא שהנכס נבנה לפי היתר. נכס עם תיק מסודר נמכר מהר יותר ובאמון גבוה יותר מקונים.',
      },
    },
    {
      '@type': 'Question',
      name: 'אילו מסים צריך לבדוק לפני מכירת דירה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'שני המרכיבים המרכזיים הם מס שבח והיטל השבחה. בדיקה מוקדמת של חבות המס מאפשרת לקבוע מחיר נכון לשוק ולהימנע ממצב שבו העסקה נתקעת ברגע האחרון.',
      },
    },
    {
      '@type': 'Question',
      name: 'מה עושים עם משכנתא קיימת בעת מכירה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'מוציאים מהבנק מכתב כוונות המפרט את יתרת המשכנתא כולל קנסות פירעון מוקדם, ובודקים אם כדאי לגרור את המשכנתא או למחזר. אם אתם משפרי דיור, מומלץ לקבל במקביל אישור עקרוני לנכס הבא.',
      },
    },
    {
      '@type': 'Question',
      name: 'איך נקבע מחיר היציאה של הדירה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'אנחנו מבצעים ניתוח שוק מבוסס עסקאות שבוצעו באזור — ולא הערכות כלליות — מגדירים קהל יעד מדויק וקובעים מחיר יציאה שמייצר ביקוש אמיתי כבר בתחילת הפרסום, במקום הורדות מחיר בהמשך.',
      },
    },
    {
      '@type': 'Question',
      name: 'באילו ערוצים משווקים את הדירה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'הנכס משווק במקביל בכמה ערוצים: צילום מקצועי, פרסום באתרי נדל״ן מובילים, קמפיינים ממומנים ברשתות ובגוגל, חשיפה למאגר קונים קיים, שיתופי פעולה עם מתווכים, ושילוט ופעילות שטח. שיווק נכון מייצר תחרות בין קונים.',
      },
    },
  ],
};

export default function SellingApartmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BreadcrumbSchema items={[{ name: 'מוכרים דירה', path: '/selling-apartment' }]} />
      <SellingApartmentContent />
    </>
  );
}
