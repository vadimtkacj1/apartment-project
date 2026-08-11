import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: 'מומחים לתיווך נדל״ן בחולון - ניסיון 24 שנה',
  description: 'רם מזרחי וחיים ענבי — משרד תיווך בחולון עם ניסיון מצטבר של 24 שנה. 4 סוכנים מקצועיים, מכירה, השכרה וניהול נכסים. היכרות עמוקה עם כל שכונות חולון ובת ים.',
  keywords: [
    'אודות רם נכסים',
    'משרד תיווך חולון',
    'תיווך נדל״ן מקצועי',
    'מתווך חולון',
    'ניסיון נדל״ן',
    'רם מזרחי',
    'חיים ענבי',
  ],
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: 'מומחים לתיווך נדל״ן בחולון - ניסיון 24 שנה',
    description: 'רם מזרחי וחיים ענבי — משרד תיווך בחולון עם ניסיון מצטבר של 24 שנה. מכירה, השכרה וניהול נכסים.',
    url: `${siteUrl}/about`,
    images: [
      {
        url: `${siteUrl}/6.png`,
        width: 1200,
        height: 630,
        alt: 'צוות רם נכסים חיים ענבי - משרד תיווך בחולון',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'מומחים לתיווך נדל״ן בחולון - ניסיון 24 שנה',
    description: 'רם מזרחי וחיים ענבי — משרד תיווך בחולון עם ניסיון מצטבר של 24 שנה.',
    images: [`${siteUrl}/6.png`],
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

