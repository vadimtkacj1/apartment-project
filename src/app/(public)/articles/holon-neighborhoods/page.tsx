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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'איזו שכונה בחולון הכי מתאימה למשפחות צעירות?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'קרית שרת ונאות שושנים מובילות אצל משפחות: בתי ספר טובים, פארקים, קהילה מבוססת ושקט. מי שמחפש בנייה חדשה יותר ימצא אותה בשכונות החדשות במזרח העיר ובפרויקטים של התחדשות עירונית.',
      },
    },
    {
      '@type': 'Question',
      name: 'איפה הכי כדאי להשקיע בחולון?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'תלוי באסטרטגיה. לתשואת שכירות שוטפת — דירות קטנות ליד מוקדי תחבורה ותעסוקה. לאפסייד הון — שכונות בתנופת התחדשות עירונית כמו ג\'סי כהן ותל גיבורים, שבהן דירה ישנה היום יכולה להפוך לדירה חדשה בעתיד.',
      },
    },
    {
      '@type': 'Question',
      name: 'כמה עולה דירת 4 חדרים בחולון?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'המחיר משתנה משמעותית בין שכונות, סוג בניין ומצב הדירה — ההבדל בין שכונה ותיקה לפרויקט חדש יכול להגיע למאות אלפי שקלים. לקבלת תמונת מחירים עדכנית לשכונה ספציפית, צרו קשר ונשתף נתוני עסקאות אמיתיים מהשטח.',
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
