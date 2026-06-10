import type { Metadata } from 'next';
import ForeignInvestorsContent from './ForeignInvestorsContent';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: 'נדל״ן בישראל עבור תושבי חוץ ומשקיעים זרים | רם נכסים',
  description: 'מדריך מקיף לרכישת דירה בישראל מרחוק: ייפוי כוח נוטריוני, מימון ומשכנתא לתושבי חוץ, ניהול נכסים מקצועי בחולון ובת ים. רם נכסים — עיניים והידיים שלכם בארץ.',
  alternates: {
    canonical: `${siteUrl}/articles/foreign-investors`,
  },
  openGraph: {
    title: 'נדל״ן בישראל עבור תושבי חוץ ומשקיעים זרים',
    description: 'מדריך לרכישת דירה בישראל מרחוק עם ליווי מקצועי מלא — רם נכסים חיים ענבי.',
    url: `${siteUrl}/articles/foreign-investors`,
    type: 'article',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'נדל״ן בשלט רחוק: כשאתם בחו״ל והלב רוצה',
  description: 'מדריך מקיף לרכישת דירה בישראל מרחוק עבור תושבי חוץ ומשקיעים זרים.',
  url: `${siteUrl}/articles/foreign-investors`,
  datePublished: '2026-01-15',
  inLanguage: 'he',
  author: {
    '@type': 'Organization',
    name: 'רם נכסים חיים ענבי',
    url: siteUrl,
  },
  publisher: {
    '@type': 'Organization',
    name: 'רם נכסים חיים ענבי',
    url: siteUrl,
    logo: { '@type': 'ImageObject', url: `${siteUrl}/images/logos.png` },
  },
};

export default function ForeignInvestorsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BreadcrumbSchema items={[
        { name: 'מאמרים', path: '/articles' },
        { name: 'משקיעים זרים', path: '/articles/foreign-investors' },
      ]} />
      <ForeignInvestorsContent />
    </>
  );
}
