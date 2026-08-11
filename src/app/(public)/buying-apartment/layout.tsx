import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://go-apartsale.online';

export const metadata: Metadata = {
  title: 'קניית דירה בחולון - מדריך שלב אחר שלב',
  description: 'איך קונים דירה בחולון? מבירור צרכים ובדיקת מימון, דרך איתור נכס, ועד ניהול מו״מ וסגירת עסקה. ליווי מקצועי אישי עם מתווך מנוסה לאורך כל הדרך.',
  keywords: [
    'קניית דירה בחולון',
    'רכישת דירה',
    'איך קונים דירה',
    'תהליך רכישת דירה',
    'ייעוץ רכישת דירה',
    'מתווך לרכישת דירה',
    'קונים דירה חולון',
  ],
  alternates: {
    canonical: `${siteUrl}/buying-apartment`,
  },
  openGraph: {
    title: 'קניית דירה בחולון - מדריך שלב אחר שלב',
    description: 'מבירור צרכים ועד קבלת המפתחות — ליווי מקצועי אישי לרכישת דירה בחולון.',
    url: `${siteUrl}/buying-apartment`,
    images: [
      {
        url: `${siteUrl}/images/masterkaspler_A_close-up_photograph_of_a_firm_handshake_betwe_4d324466-a227-404c-b8fb-60648a16bfbd_2.png`,
        width: 1200,
        height: 630,
        alt: 'קניית דירה בחולון - ליווי מקצועי',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'קניית דירה בחולון - מדריך שלב אחר שלב',
    description: 'מבירור צרכים ועד קבלת המפתחות — ליווי מקצועי אישי לרכישת דירה בחולון.',
    images: [`${siteUrl}/images/masterkaspler_A_close-up_photograph_of_a_firm_handshake_betwe_4d324466-a227-404c-b8fb-60648a16bfbd_2.png`],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'דף הבית', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'קונים דירה', item: `${siteUrl}/buying-apartment` },
  ],
};

export default function BuyingApartmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}

