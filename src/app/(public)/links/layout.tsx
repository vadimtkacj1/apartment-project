import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

const linksTitle = 'קישורים שימושיים | כלים לרכישה ומכירת נדל״ן';
const linksDescription = 'כלים ומקורות מידע רשמיים לבדיקת נכסים ותכנון עסקאות נדל״ן: נסח טאבו, מסמכי בית משותף, מדד תשומות הבנייה, מדד המחירים לצרכן ומחשבון משכנתא.';

export const metadata: Metadata = {
  title: { absolute: linksTitle },
  description: linksDescription,
  keywords: [
    'קישורים שימושיים',
    'נסח טאבו',
    'תשריט בית משותף',
    'מחשבון משכנתא',
    'מדד תשומות הבנייה',
    'כלים נדל״ן',
  ],
  alternates: {
    canonical: `${siteUrl}/links`,
  },
  openGraph: {
    title: linksTitle,
    description: linksDescription,
    url: `${siteUrl}/links`,
    images: [
      {
        url: `${siteUrl}/7.jpg`,
        width: 1200,
        height: 630,
        alt: 'קישורים שימושיים',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: linksTitle,
    description: linksDescription,
    images: [`${siteUrl}/7.jpg`],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'דף הבית', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'קישורים שימושיים', item: `${siteUrl}/links` },
  ],
};

export default function LinksLayout({
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

