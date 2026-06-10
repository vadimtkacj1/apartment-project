import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: { absolute: 'אודות - רם נכסים חיים ענבי' },
  description: 'למידע נוסף על משרד התיווך שלנו. ניסיון מצטבר של שנים בעולם הנדל״ן, הכרות עמוקה עם השוק המקומי ושיטות עבודה מוכחות. צוות מקצועי ומנוסה.',
  keywords: [
    'אודות רם נכסים',
    'משרד תיווך חולון',
    'תיווך נדל״ן מקצועי',
    'צוות תיווך',
    'ניסיון נדל״ן',
  ],
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: 'אודות - רם נכסים חיים ענבי',
    description: 'למידע נוסף על משרד התיווך שלנו. ניסיון מצטבר של שנים בעולם הנדל״ן.',
    url: `${siteUrl}/about`,
    images: [
      {
        url: `${siteUrl}/7.jpg`,
        width: 1200,
        height: 630,
        alt: 'אודות רם נכסים חיים ענבי',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'אודות - רם נכסים חיים ענבי',
    description: 'למידע נוסף על משרד התיווך שלנו. ניסיון מצטבר של שנים בעולם הנדל״ן.',
    images: [`${siteUrl}/7.jpg`],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'דף הבית', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'אודות', item: `${siteUrl}/about` },
  ],
};

export default function AboutLayout({
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

