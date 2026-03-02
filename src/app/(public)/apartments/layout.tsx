import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ramnekasim.co.il';

export const metadata: Metadata = {
  title: 'נכסים למכירה והשכרה - רם נכסים חיים ענבי',
  description: 'גלה את מבחר הנכסים שלנו למכירה ולהשכרה בחולון והסביבה. דירות, גינות, קוטג׳ים ועוד. תיווך נדל״ן מקצועי עם ניסיון של שנים.',
  keywords: [
    'נכסים למכירה',
    'נכסים להשכרה',
    'דירות למכירה בחולון',
    'דירות להשכרה בחולון',
    'תיווך נדל״ן',
    'נדל״ן חולון',
    'דירות למכירה',
    'דירות להשכרה',
  ],
  alternates: {
    canonical: `${siteUrl}/apartments`,
  },
  openGraph: {
    title: 'נכסים למכירה והשכרה - רם נכסים חיים ענבי',
    description: 'גלה את מבחר הנכסים שלנו למכירה ולהשכרה בחולון והסביבה.',
    url: `${siteUrl}/apartments`,
    images: [
      {
        url: `${siteUrl}/7.jpg`,
        width: 1200,
        height: 630,
        alt: 'נכסים למכירה והשכרה',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'נכסים למכירה והשכרה - רם נכסים חיים ענבי',
    description: 'גלה את מבחר הנכסים שלנו למכירה ולהשכרה בחולון והסביבה.',
    images: [`${siteUrl}/7.jpg`],
  },
};

export default function ApartmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

