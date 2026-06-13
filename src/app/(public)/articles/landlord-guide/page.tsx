import type { Metadata } from 'next';
import LandlordGuideContent from './LandlordGuideContent';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';
const ogImage = `${siteUrl}/images/articles/landlord.jpg`;

export const metadata: Metadata = {
  title: 'משכירים דירה? המדריך המלא לבעלי נכסים',
  description: 'מדריך השכרת דירה לבעלי נכסים: איך קובעים שכר דירה נכון, איך מסננים שוכרים, אילו ביטחונות לדרוש בחוזה, ומה חשוב לדעת על מיסוי הכנסות משכירות.',
  keywords: [
    'השכרת דירה',
    'חוזה שכירות',
    'מיסוי שכר דירה',
    'בדיקת שוכרים',
    'ניהול נכסים',
    'דירות להשכרה בחולון',
    'שכר דירה',
    'ביטחונות בשכירות',
  ],
  alternates: {
    canonical: `${siteUrl}/articles/landlord-guide`,
  },
  openGraph: {
    title: 'משכירים דירה? המדריך המלא לבעלי נכסים',
    description: 'תמחור, סינון שוכרים, חוזה שמגן עליכם ומיסוי — כל מה שבעל נכס צריך לדעת. רם נכסים חיים ענבי.',
    url: `${siteUrl}/articles/landlord-guide`,
    type: 'article',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'השכרת דירה לבעלי נכסים',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'משכירים דירה? המדריך המלא לבעלי נכסים',
    description: 'תמחור, סינון שוכרים, חוזה שמגן עליכם ומיסוי — כל מה שבעל נכס צריך לדעת. רם נכסים חיים ענבי.',
    images: [ogImage],
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'השכרת דירה בלי כאבי ראש: המדריך לבעלי נכסים',
  description: 'מדריך מקיף להשכרת דירה: תמחור שכר דירה, סינון שוכרים, ביטחונות, חוזה שכירות נכון ומיסוי הכנסות משכירות.',
  url: `${siteUrl}/articles/landlord-guide`,
  image: ogImage,
  datePublished: '2026-04-21',
  dateModified: '2026-04-21',
  inLanguage: 'he',
  articleSection: 'השכרה וניהול',
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/articles/landlord-guide` },
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
      name: 'אילו ביטחונות כדאי לדרוש משוכר?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'המקובל: שטר חוב חתום על ידי השוכר וערבים, צ\'ק ביטחון או ערבות בנקאית, ופיקדון כספי. בנוסף — ערבים עם תלושי שכר. חשוב שהביטחונות יהיו פרופורציונליים לשכר הדירה ויעוגנו בחוזה כדין.',
      },
    },
    {
      '@type': 'Question',
      name: 'האם צריך לשלם מס על הכנסות משכר דירה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'תלוי בסכום. קיים מסלול פטור מלא עד תקרה חודשית (כ-5,600 ש"ח, מתעדכנת מדי שנה), מסלול מס מופחת של 10% על כל ההכנסה, ומסלול מס שולי עם ניכוי הוצאות. לכל מסלול יתרונות — כדאי להתייעץ עם רואה חשבון.',
      },
    },
    {
      '@type': 'Question',
      name: 'כמה שכר דירה אפשר לבקש על דירה בחולון?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'שכר הדירה נקבע לפי שכונה, גודל, מצב הדירה, קומה ותוספות כמו ממ"ד, מרפסת וחניה. ההבדל בין דירה מתוחזקת למוזנחת באותו בניין יכול להגיע ל-15% ויותר. אנחנו מספקים הערכת שכר דירה ללא עלות על בסיס עסקאות אמיתיות מהשטח.',
      },
    },
  ],
};

export default function LandlordGuidePage() {
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
        { name: 'השכרת דירה', path: '/articles/landlord-guide' },
      ]} />
      <LandlordGuideContent />
    </>
  );
}
