import type { Metadata } from 'next';
import HolonNeighborhoodsContent from './HolonNeighborhoodsContent';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';
const ogImage = `${siteUrl}/images/articles/holon-neighborhoods.jpg`;

export const metadata: Metadata = {
  title: 'שכונות חולון: המדריך המלא — איפה לגור ואיפה להשקיע',
  description: 'מדריך השכונות של חולון: קרית שרת, נאות שושנים, ג\'סי כהן, תל גיבורים ועוד. יתרונות, מחירים, פוטנציאל השבחה — איזו שכונה מתאימה לכם לגור או להשקיע?',
  keywords: [
    'שכונות חולון',
    'איפה לגור בחולון',
    'קרית שרת חולון',
    'נאות שושנים',
    'ג\'סי כהן חולון',
    'תל גיבורים',
    'דירות בחולון',
    'השקעה בחולון',
  ],
  alternates: {
    canonical: `${siteUrl}/articles/holon-neighborhoods`,
  },
  openGraph: {
    title: 'שכונות חולון: המדריך המלא — איפה לגור ואיפה להשקיע',
    description: 'קרית שרת, נאות שושנים, ג\'סי כהן, תל גיבורים ועוד — מדריך השכונות מבית רם נכסים חיים ענבי.',
    url: `${siteUrl}/articles/holon-neighborhoods`,
    type: 'article',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'שכונות מגורים בחולון',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'שכונות חולון: המדריך המלא — איפה לגור ואיפה להשקיע',
    description: 'קרית שרת, נאות שושנים, ג\'סי כהן, תל גיבורים ועוד — מדריך השכונות מבית רם נכסים חיים ענבי.',
    images: [ogImage],
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'שכונות חולון: איפה לגור, איפה להשקיע ולמה',
  description: 'סקירת השכונות המרכזיות של חולון: אופי, קהל יעד, רמות מחירים ופוטנציאל השבחה — מנקודת מבט של מתווכים שחיים את העיר.',
  url: `${siteUrl}/articles/holon-neighborhoods`,
  image: ogImage,
  datePublished: '2026-05-05',
  dateModified: '2026-06-13',
  inLanguage: 'he',
  articleSection: 'אזור ומיקום',
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/articles/holon-neighborhoods` },
  isPartOf: { '@id': `${siteUrl}/#website` },
  author: {
    '@type': 'Person',
    '@id': `${siteUrl}/about#owner-2`,
    name: 'חיים ענבי',
    jobTitle: 'מתווך נדל״ן מורשה ומייסד',
    url: `${siteUrl}/about`,
    worksFor: { '@id': `${siteUrl}/#organization` },
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Real Estate License',
      identifier: '3164492',
    },
  },
  publisher: { '@id': `${siteUrl}/#organization` },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'איזו שכונה הכי מתאימה למשפחה צעירה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'קרית שרת ונאות שושנים מובילות. בתי ספר טובים, פארקים, קהילה מבוססת ושקט. מי שמחפש בנייה חדשה ימצא אותה בשכונות החדשות במזרח העיר ובפרויקטים של התחדשות עירונית.',
      },
    },
    {
      '@type': 'Question',
      name: 'איפה הכי כדאי להשקיע?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'תלוי מה אתם מחפשים. לתשואת שכירות שוטפת — דירות קטנות ליד מוקדי תחבורה. לאפסייד הון — שכונות בתנופת התחדשות כמו ג׳סי כהן ותל גיבורים, שבהן דירה ישנה היום יכולה להפוך לדירה חדשה בעתיד.',
      },
    },
    {
      '@type': 'Question',
      name: 'אני מתלבט בין חולון לבת ים. מה ההבדל?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'שתי ערים מצוינות עם אופי שונה. חולון חזקה בחינוך, פארקים וקהילה משפחתית. בת ים מציעה קו ראשון לים ותנופת התחדשות אדירה. אנחנו עובדים בשתיהן — ונשמח להתאים לכם את המיקום לפי הצרכים והתקציב.',
      },
    },
  ],
};

export default function HolonNeighborhoodsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BreadcrumbSchema items={[
        { name: 'מאמרים', path: '/articles' },
        { name: 'שכונות חולון', path: '/articles/holon-neighborhoods' },
      ]} />
      <HolonNeighborhoodsContent />
    </>
  );
}
