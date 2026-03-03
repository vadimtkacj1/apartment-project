import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: 'שאלות ותשובות - רם נכסים חיים ענבי',
  description: 'תשובות לשאלות נפוצות על תיווך נדל״ן, רכישת דירה, מכירת דירה, משכנתאות ועוד. מידע מקצועי ומפורט על תהליכי נדל״ן.',
  keywords: [
    'שאלות ותשובות',
    'FAQ נדל״ן',
    'שאלות על תיווך',
    'שאלות על רכישת דירה',
    'שאלות על מכירת דירה',
    'מידע נדל״ן',
  ],
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
  openGraph: {
    title: 'שאלות ותשובות - רם נכסים חיים ענבי',
    description: 'תשובות לשאלות נפוצות על תיווך נדל״ן, רכישת דירה, מכירת דירה ועוד.',
    url: `${siteUrl}/faq`,
    images: [
      {
        url: `${siteUrl}/7.jpg`,
        width: 1200,
        height: 630,
        alt: 'שאלות ותשובות',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'שאלות ותשובות - רם נכסים חיים ענבי',
    description: 'תשובות לשאלות נפוצות על תיווך נדל״ן, רכישת דירה, מכירת דירה ועוד.',
    images: [`${siteUrl}/7.jpg`],
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

