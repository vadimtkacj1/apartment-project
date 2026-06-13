import type { Metadata } from 'next';
import FirstApartmentContent from './FirstApartmentContent';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';
const ogImage = `${siteUrl}/images/articles/first-apartment.jpg`;

export const metadata: Metadata = {
  title: 'קונים דירה ראשונה? המדריך המלא לזוגות צעירים',
  description: 'מדריך שלב-אחר-שלב לרכישת דירה ראשונה: כמה הון עצמי צריך, איך בונים תקציב נכון, למה חולון היא בחירה חכמה, ואילו טעויות הורסות לרוכשים את העסקה.',
  keywords: [
    'דירה ראשונה',
    'קניית דירה ראשונה',
    'מדריך לרוכשי דירה',
    'הון עצמי לדירה',
    'דירה לזוגות צעירים',
    'קניית דירה בחולון',
    'משכנתא ראשונה',
    'דירות למכירה בחולון',
  ],
  alternates: {
    canonical: `${siteUrl}/articles/first-apartment-guide`,
  },
  openGraph: {
    title: 'קונים דירה ראשונה? המדריך המלא לזוגות צעירים',
    description: 'כמה הון עצמי צריך, איך בונים תקציב ואיך נמנעים מטעויות יקרות — רם נכסים חיים ענבי.',
    url: `${siteUrl}/articles/first-apartment-guide`,
    type: 'article',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'זוג צעיר רוכש דירה ראשונה',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'קונים דירה ראשונה? המדריך המלא לזוגות צעירים',
    description: 'כמה הון עצמי צריך, איך בונים תקציב ואיך נמנעים מטעויות יקרות — רם נכסים חיים ענבי.',
    images: [ogImage],
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'דירה ראשונה: המדריך שיחסוך לכם שנים של טעויות',
  description: 'מדריך מקיף לרכישת דירה ראשונה: תקציב, הון עצמי, משכנתא, בחירת מיקום והטעויות הנפוצות של רוכשים צעירים.',
  url: `${siteUrl}/articles/first-apartment-guide`,
  image: ogImage,
  datePublished: '2026-03-24',
  dateModified: '2026-03-24',
  inLanguage: 'he',
  articleSection: 'קניה ומכירה',
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/articles/first-apartment-guide` },
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
      name: 'כמה הון עצמי צריך לדירה ראשונה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'לדירה ראשונה (יחידה) הבנקים מממנים עד 75% משווי הדירה, כלומר צריך לפחות 25% הון עצמי. על דירה של 1.8 מיליון ש"ח — לפחות 450,000 ש"ח, ועוד כ-5% לעלויות נלוות: עורך דין, תיווך, מעבר ושיפוצים קלים.',
      },
    },
    {
      '@type': 'Question',
      name: 'למה כדאי לזוגות צעירים לקנות דירה דווקא בחולון?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'חולון מציעה שילוב נדיר: קרבה מיידית לתל אביב, מחירים נמוכים משמעותית מהמרכז, תשתיות חינוך וקהילה מהטובות בארץ, ותנופת התחדשות עירונית שצפויה להמשיך להעלות את ערך הדירות.',
      },
    },
    {
      '@type': 'Question',
      name: 'מה הטעות הנפוצה ביותר של רוכשי דירה ראשונה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'חיפוש דירה לפני קבלת אישור עקרוני למשכנתא. זוגות מתאהבים בדירה, מתחייבים רגשית, ואז מגלים שהבנק מאשר להם פחות ממה שתכננו — ומפסידים את הדירה או לוקחים הלוואות יקרות להשלמת הפער.',
      },
    },
  ],
};

export default function FirstApartmentGuidePage() {
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
        { name: 'דירה ראשונה', path: '/articles/first-apartment-guide' },
      ]} />
      <FirstApartmentContent />
    </>
  );
}
