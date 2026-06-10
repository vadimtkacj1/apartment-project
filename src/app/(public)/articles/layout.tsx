import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: { absolute: 'מאמרים ומדריכים - רם נכסים חיים ענבי' },
  description: 'מאמרים מקצועיים ומדריכים על נדל״ן, רכישת דירה, מכירת דירה, השקעות נדל״ן ועוד. מידע עדכני וטיפים מקצועיים מהמומחים שלנו.',
  keywords: [
    'מאמרי נדל״ן',
    'מדריכי נדל״ן',
    'טיפים לקניית דירה',
    'טיפים למכירת דירה',
    'השקעות נדל״ן',
    'משקיעים זרים',
  ],
  alternates: {
    canonical: `${siteUrl}/articles`,
  },
  openGraph: {
    title: 'מאמרים ומדריכים - רם נכסים חיים ענבי',
    description: 'מאמרים מקצועיים ומדריכים על נדל״ן, רכישת דירה, מכירת דירה ועוד.',
    url: `${siteUrl}/articles`,
    images: [
      {
        url: `${siteUrl}/7.jpg`,
        width: 1200,
        height: 630,
        alt: 'מאמרים ומדריכים',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'מאמרים ומדריכים - רם נכסים חיים ענבי',
    description: 'מאמרים מקצועיים ומדריכים על נדל״ן, רכישת דירה, מכירת דירה ועוד.',
    images: [`${siteUrl}/7.jpg`],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'דף הבית', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'מאמרים', item: `${siteUrl}/articles` },
  ],
};

export default function ArticlesLayout({
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

