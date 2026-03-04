import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: 'נכסים להשכרה - רם נכסים חיים ענבי',
  description: 'גלה נכסים להשכרה בחולון והסביבה: דירות, דירות גן ועוד. תיווך נדל״ן מקצועי עם ניסיון של שנים.',
  keywords: [
    'נכסים להשכרה',
    'דירות להשכרה בחולון',
    'השכרת דירה בחולון',
    'תיווך נדל״ן חולון',
    'נדל״ן להשכרה',
  ],
  alternates: {
    canonical: `${siteUrl}/apartments/rent`,
  },
  openGraph: {
    title: 'נכסים להשכרה - רם נכסים חיים ענבי',
    description: 'גלה נכסים להשכרה בחולון והסביבה.',
    url: `${siteUrl}/apartments/rent`,
    images: [
      {
        url: `${siteUrl}/7.jpg`,
        width: 1200,
        height: 630,
        alt: 'נכסים להשכרה',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'נכסים להשכרה - רם נכסים חיים ענבי',
    description: 'גלה נכסים להשכרה בחולון והסביבה.',
    images: [`${siteUrl}/7.jpg`],
  },
};

export default function ApartmentsRentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


