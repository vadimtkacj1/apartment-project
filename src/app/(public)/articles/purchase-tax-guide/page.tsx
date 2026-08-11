import type { Metadata } from 'next';
import PurchaseTaxContent from './PurchaseTaxContent';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';
const ogImage = `${siteUrl}/images/articles/purchase-tax.jpg`;

export const metadata: Metadata = {
  title: 'מס רכישה על דירה 2026: מדרגות, פטורים וטיפים',
  description: 'כמה מס רכישה משלמים על דירה יחידה ועל דירה להשקעה ב-2026? מדריך מלא: מדרגות המס, פטורים לעולים חדשים, הקלות ודרכים חוקיות לתכנון נכון של העסקה.',
  keywords: [
    'מס רכישה',
    'מס רכישה 2026',
    'מדרגות מס רכישה',
    'מס רכישה דירה יחידה',
    'מס רכישה דירה שנייה',
    'פטור ממס רכישה',
    'קניית דירה בחולון',
    'מיסוי מקרקעין',
  ],
  alternates: {
    canonical: `${siteUrl}/articles/purchase-tax-guide`,
  },
  openGraph: {
    title: 'מס רכישה על דירה 2026: מדרגות, פטורים וטיפים',
    description: 'מדריך מלא למס רכישה: מדרגות לדירה יחידה ולמשקיעים, פטורים והקלות — רם נכסים חיים ענבי.',
    url: `${siteUrl}/articles/purchase-tax-guide`,
    type: 'article',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'מס רכישה על דירה בישראל',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'מס רכישה על דירה 2026: מדרגות, פטורים וטיפים',
    description: 'מדריך מלא למס רכישה: מדרגות לדירה יחידה ולמשקיעים, פטורים והקלות — רם נכסים חיים ענבי.',
    images: [ogImage],
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'מס רכישה על דירה 2026: המדריך שיחסוך לכם עשרות אלפי שקלים',
  description: 'מדריך מקיף למס רכישה בישראל: מדרגות המס לדירה יחידה ולדירה להשקעה, פטורים והקלות, וטעויות נפוצות בתכנון העסקה.',
  url: `${siteUrl}/articles/purchase-tax-guide`,
  image: ogImage,
  datePublished: '2026-02-10',
  dateModified: '2026-06-13',
  inLanguage: 'he',
  articleSection: 'מימון ומיסוי',
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/articles/purchase-tax-guide` },
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
      name: 'כמה מס רכישה משלמים על דירה יחידה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'רוכשי דירה יחידה נהנים ממדרגת מס של 0% עד לתקרה של 1,978,745 ש״ח (נכון ל-2026; המדרגות הוקפאו לשנים 2025–2027). מעל התקרה המס עולה בהדרגה: 3.5%, 5%, 8% ו-10% על חלקי השווי הגבוהים יותר. מקור: רשות המסים.',
      },
    },
    {
      '@type': 'Question',
      name: 'כמה מס רכישה משלמים על דירה שנייה או דירה להשקעה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'מי שבבעלותו כבר דירה משלם מס רכישה מהשקל הראשון: 8% על חלק השווי עד 6,055,070 ש״ח ו-10% מעל לכך (נכון ל-2026; מקור: רשות המסים). לכן חשוב לתכנן את סדר העסקאות — מכירת הדירה הקיימת בתוך התקופה הקבועה בחוק מאפשרת ליהנות ממדרגות דירה יחידה.',
      },
    },
    {
      '@type': 'Question',
      name: 'האם עולים חדשים מקבלים הנחה במס רכישה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'כן. עולה חדש זכאי למדרגות מס מופחתות ברכישת דירת מגורים, וההטבה תקפה בתקופה שסביב מועד העלייה. בנוסף קיימות הקלות לנכים, לנפגעי פעולות איבה ולמשפחות שכולות. מומלץ להתייעץ עם עורך דין מקרקעין לפני החתימה.',
      },
    },
  ],
};

export default function PurchaseTaxGuidePage() {
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
        { name: 'מס רכישה', path: '/articles/purchase-tax-guide' },
      ]} />
      <PurchaseTaxContent />
    </>
  );
}
