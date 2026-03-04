import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: 'נכסים למכירה - רם נכסים חיים ענבי',
  description: 'גלה נכסים למכירה בחולון והסביבה: דירות, דירות גן, קוטג׳ים ועוד. תיווך נדל״ן מקצועי עם ניסיון של שנים.',
  keywords: [
    'נכסים למכירה',
    'דירות למכירה בחולון',
    'קניית דירה בחולון',
    'תיווך נדל״ן חולון',
    'נדל״ן למכירה',
  ],
  alternates: {
    canonical: `${siteUrl}/apartments/sale`,
  },
  openGraph: {
    title: 'נכסים למכירה - רם נכסים חיים ענבי',
    description: 'גלה נכסים למכירה בחולון והסביבה.',
    url: `${siteUrl}/apartments/sale`,
    images: [
      {
        url: `${siteUrl}/7.jpg`,
        width: 1200,
        height: 630,
        alt: 'נכסים למכירה',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'נכסים למכירה - רם נכסים חיים ענבי',
    description: 'גלה נכסים למכירה בחולון והסביבה.',
    images: [`${siteUrl}/7.jpg`],
  },
};

export default function ApartmentsSaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


