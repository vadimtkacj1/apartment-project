import type { Metadata } from 'next';
import BuyingApartmentContent from './BuyingApartmentContent';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: 'קונים דירה בחולון | מדריך רכישת דירה',
  description: 'מדריך מלא לרכישת דירה בחולון: בירור צרכים, בדיקת מימון ומשכנתא, איתור נכס, וניהול משא ומתן. ליווי מקצועי מהייעוץ הראשוני ועד קבלת המפתחות.',
  alternates: {
    canonical: `${siteUrl}/buying-apartment`,
  },
  openGraph: {
    title: 'קונים דירה בחולון | מדריך רכישת דירה',
    description: 'מדריך מלא לרכישת דירה בחולון עם ליווי מקצועי מהייעוץ הראשוני ועד קבלת המפתחות.',
    url: `${siteUrl}/buying-apartment`,
  },
};

export default function BuyingApartmentPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'קונים דירה', path: '/buying-apartment' }]} />
      <BuyingApartmentContent />
    </>
  );
}
