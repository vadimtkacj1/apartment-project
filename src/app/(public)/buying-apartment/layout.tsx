import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: 'קונים דירה - רם נכסים חיים ענבי',
  description: 'מדריך מקיף לרכישת דירה. בירור צרכים, בדיקת מימון, איתור נכס, ניהול מו״מ וסגירת עסקה. ליווי מקצועי משלב התכנון ועד לקבלת המפתחות.',
  keywords: [
    'קונים דירה',
    'רכישת דירה',
    'איך קונים דירה',
    'תהליך רכישת דירה',
    'קניית דירה בחולון',
    'ייעוץ רכישת דירה',
  ],
  alternates: {
    canonical: `${siteUrl}/buying-apartment`,
  },
  openGraph: {
    title: 'קונים דירה - רם נכסים חיים ענבי',
    description: 'מדריך מקיף לרכישת דירה. ליווי מקצועי משלב התכנון ועד לקבלת המפתחות.',
    url: `${siteUrl}/buying-apartment`,
    images: [
      {
        url: `${siteUrl}/7.jpg`,
        width: 1200,
        height: 630,
        alt: 'קונים דירה',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'קונים דירה - רם נכסים חיים ענבי',
    description: 'מדריך מקיף לרכישת דירה. ליווי מקצועי משלב התכנון ועד לקבלת המפתחות.',
    images: [`${siteUrl}/7.jpg`],
  },
};

export default function BuyingApartmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

