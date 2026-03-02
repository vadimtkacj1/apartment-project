import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ramnekasim.co.il';

export const metadata: Metadata = {
  title: 'נדל״ן בשלט רחוק: כשאתם בחו״ל והלב רוצה - רם נכסים חיים ענבי',
  description: 'מדריך מקיף למשקיעים זרים שרוצים לקנות נדל״ן בישראל. ניהול נכסים מרחוק, שיפוץ, מעטפת פיננסית וניהול שוטף. תושבי חוץ - אפשר לנהל נדל״ן בישראל באפס מאמץ.',
  keywords: [
    'משקיעים זרים',
    'תושבי חוץ',
    'נדל״ן בישראל',
    'רכישת דירה מרחוק',
    'ניהול נכסים',
    'Property Management',
    'Foreign Investors',
    'Israel Real Estate',
  ],
  alternates: {
    canonical: `${siteUrl}/articles/foreign-investors`,
  },
  openGraph: {
    type: 'article',
    title: 'נדל״ן בשלט רחוק: כשאתם בחו״ל והלב רוצה',
    description: 'מדריך מקיף למשקיעים זרים שרוצים לקנות נדל״ן בישראל.',
    url: `${siteUrl}/articles/foreign-investors`,
    images: [
      {
        url: `${siteUrl}/images/LuxuryLiving.jpg`,
        width: 1200,
        height: 630,
        alt: 'נדל״ן בישראל למשקיעים זרים',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'נדל״ן בשלט רחוק: כשאתם בחו״ל והלב רוצה',
    description: 'מדריך מקיף למשקיעים זרים שרוצים לקנות נדל״ן בישראל.',
    images: [`${siteUrl}/images/LuxuryLiving.jpg`],
  },
};

export default function ForeignInvestorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

