import type { Metadata } from 'next';
import ApartmentsPageClient from '@/components/pages/ApartmentsPageClient';
import { DealType } from '@/types/property.types';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const dealType = params.dealType as string | undefined;

  if (dealType === 'rent') {
    return {
      title: 'דירות להשכרה בחולון',
      description: 'מאגר דירות להשכרה בחולון, בת ים וראשון לציון. מגוון נכסים להשכרה — 2, 3, 4 חדרים ויותר. ליווי מקצועי מהחיפוש ועד חתימת החוזה.',
      alternates: { canonical: `${siteUrl}/apartments?dealType=rent` },
      openGraph: { url: `${siteUrl}/apartments?dealType=rent` },
    };
  }

  if (dealType === 'sale') {
    return {
      title: 'דירות למכירה בחולון',
      description: 'מאגר דירות למכירה בחולון, בת ים וראשון לציון. תמחור מדויק וליווי מלא עד סגירת העסקה.',
      alternates: { canonical: `${siteUrl}/apartments?dealType=sale` },
      openGraph: { url: `${siteUrl}/apartments?dealType=sale` },
    };
  }

  return {
    title: 'דירות למכירה ולהשכרה בחולון',
    description: 'מאגר מלא של דירות למכירה ולהשכרה בחולון, בת ים וראשון לציון. סינון לפי מחיר, גודל, קומה ועוד. ליווי מקצועי בכל שלבי העסקה.',
    alternates: { canonical: `${siteUrl}/apartments` },
    openGraph: { url: `${siteUrl}/apartments` },
  };
}

export default async function ApartmentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const dealType = params.dealType as DealType | undefined;
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'דירות', path: '/apartments' }]} />
      <div className="sr-only">
        <h1>דירות למכירה ולהשכרה בחולון</h1>
        <p>
          מבחר נכסים איכותיים למכירה ולהשכרה בחולון, בת ים וכל אזור המרכז.
          דירות 2–6 חדרים, דירות גן, קוטג׳ים ונכסים להשקעה.
          רם נכסים וחיים ענבי — משרד תיווך עם ניסיון של מעל 24 שנה,
          מלווה קונים, מוכרים ומשכירים לאורך כל הדרך.
        </p>
      </div>
      <ApartmentsPageClient initialDealType={dealType} />
    </>
  );
}