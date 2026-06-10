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

export default function SellingApartmentPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'מוכרים דירה', path: '/selling-apartment' }]} />
      <SellingApartmentContent />
    </>
  );
}
