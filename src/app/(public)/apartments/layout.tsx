import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: 'דירות למכירה ולהשכרה בחולון',
  description: 'מבחר דירות למכירה ולהשכרה בחולון, בת ים וכל אזור המרכז. דירות 2-6 חדרים, גינות, קוטג׳ים ונכסים להשקעה. תיווך נדל״ן מקצועי עם ניסיון 24 שנה.',
  keywords: [
    'דירות למכירה בחולון',
    'דירות להשכרה בחולון',
    'נכסים למכירה חולון',
    'נדל״ן חולון',
    'דירות בחולון',
    'נכסים להשקעה חולון',
    'דירות בת ים',
  ],
  alternates: {
    canonical: `${siteUrl}/apartments`,
  },
  openGraph: {
    title: 'דירות למכירה ולהשכרה בחולון',
    description: 'מבחר דירות למכירה ולהשכרה בחולון, בת ים וכל אזור המרכז.',
    url: `${siteUrl}/apartments`,
    images: [
      {
        url: `${siteUrl}/images/hero/main-hero.jpg`,
        width: 1200,
        height: 630,
        alt: 'דירות למכירה ולהשכרה בחולון',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'דירות למכירה ולהשכרה בחולון',
    description: 'מבחר דירות למכירה ולהשכרה בחולון, בת ים וכל אזור המרכז.',
    images: [`${siteUrl}/images/hero/main-hero.jpg`],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'דף הבית', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'דירות', item: `${siteUrl}/apartments` },
  ],
};

export default function ApartmentsLayout({
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

