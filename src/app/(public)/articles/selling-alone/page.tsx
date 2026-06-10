import type { Metadata } from 'next';
import SellingAloneContent from './SellingAloneContent';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: 'למכור דירה לבד לעומת עם מתווך | רם נכסים',
  description: 'האם כדאי למכור דירה לבד? גלו למה מכירה עם מתווך מנוסה בחולון מביאה מחיר גבוה ב-5%–10%, חוסכת זמן וטעויות יקרות. תמחור נכון, שיווק מקצועי וניהול מו״מ.',
  alternates: {
    canonical: `${siteUrl}/articles/selling-alone`,
  },
  openGraph: {
    title: 'למכור דירה לבד לעומת עם מתווך | רם נכסים',
    description: 'למה מכירה עם מתווך מנוסה מביאה תוצאות טובות יותר ממכירה עצמאית — ניתוח מקצועי.',
    url: `${siteUrl}/articles/selling-alone`,
    type: 'article',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'למכור לבד? כשה"חיסכון" בתיווך עולה לכם עשרות אלפי שקלים',
  description: 'למה מכירה עצמאית של דירה עלולה לעלות ביוקר, ואיך מתווך מנוסה משיג תוצאות טובות יותר.',
  url: `${siteUrl}/articles/selling-alone`,
  datePublished: '2026-01-14',
  dateModified: '2026-06-11',
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

export default function SellingAlonePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BreadcrumbSchema items={[
        { name: 'מאמרים', path: '/articles' },
        { name: 'למכור לבד', path: '/articles/selling-alone' },
      ]} />
      <SellingAloneContent />
    </>
  );
}
