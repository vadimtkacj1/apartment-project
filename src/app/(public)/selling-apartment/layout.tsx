import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: { absolute: 'תהליך מכירת דירה - רם נכסים חיים ענבי' },
  description: 'מדריך מקיף למכירת דירה. בדיקות משפטיות ותכנוניות, בדיקות מס, הערכת שווי, שיווק מקיף וניהול מו״מ מקצועי. נמכור את הדירה שלכם במחיר הטוב ביותר.',
  keywords: [
    'מוכרים דירה',
    'מכירת דירה',
    'איך מוכרים דירה',
    'תהליך מכירת דירה',
    'מכירת דירה בחולון',
    'ייעוץ מכירת דירה',
    'הערכת שווי נכס',
  ],
  alternates: {
    canonical: `${siteUrl}/selling-apartment`,
  },
  openGraph: {
    title: 'תהליך מכירת דירה - רם נכסים חיים ענבי',
    description: 'מדריך מקיף למכירת דירה. נמכור את הדירה שלכם במחיר הטוב ביותר.',
    url: `${siteUrl}/selling-apartment`,
    images: [
      {
        url: `${siteUrl}/7.jpg`,
        width: 1200,
        height: 630,
        alt: 'תהליך מכירת דירה',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'תהליך מכירת דירה - רם נכסים חיים ענבי',
    description: 'מדריך מקיף למכירת דירה. נמכור את הדירה שלכם במחיר הטוב ביותר.',
    images: [`${siteUrl}/7.jpg`],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'דף הבית', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'מוכרים דירה', item: `${siteUrl}/selling-apartment` },
  ],
};

export default function SellingApartmentLayout({
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

