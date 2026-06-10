import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: 'שאלות ותשובות - תיווך נדל״ן בחולון',
  description: 'תשובות לשאלות הנפוצות ביותר על תיווך נדל״ן בחולון: כמה עולה מתווך, איך מוכרים במהירות, מה לבדוק לפני קנייה, משכנתאות ועוד.',
  keywords: [
    'שאלות על תיווך חולון',
    'FAQ נדל״ן',
    'כמה עולה מתווך',
    'שאלות על רכישת דירה',
    'שאלות על מכירת דירה',
    'מידע נדל״ן חולון',
  ],
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
  openGraph: {
    title: 'שאלות ותשובות - תיווך נדל״ן בחולון',
    description: 'תשובות לשאלות הנפוצות על תיווך, קנייה ומכירת דירות בחולון.',
    url: `${siteUrl}/faq`,
    images: [
      {
        url: `${siteUrl}/images/hero/main-hero.jpg`,
        width: 1200,
        height: 630,
        alt: 'שאלות ותשובות תיווך נדל״ן חולון',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'שאלות ותשובות - תיווך נדל״ן בחולון',
    description: 'תשובות לשאלות הנפוצות על תיווך, קנייה ומכירת דירות בחולון.',
    images: [`${siteUrl}/images/hero/main-hero.jpg`],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'דף הבית', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'שאלות נפוצות', item: `${siteUrl}/faq` },
  ],
};

export default function FAQLayout({
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
