import type { Metadata } from 'next';
import UrbanRenewalContent from './UrbanRenewalContent';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';
const ogImage = `${siteUrl}/images/articles/urban-renewal.jpg`;

export const metadata: Metadata = {
  title: 'התחדשות עירונית בחולון: פינוי-בינוי ותמ״א 38',
  description: 'מדריך להתחדשות עירונית בחולון: מה ההבדל בין פינוי-בינוי לתמ״א 38, אילו שכונות בתנופה, מה זה אומר לבעלי דירות ואיך משקיעים מרוויחים מזה.',
  keywords: [
    'התחדשות עירונית בחולון',
    'פינוי בינוי חולון',
    'תמ"א 38',
    'פינוי בינוי',
    'השקעה בנדל"ן חולון',
    'ג\'סי כהן פינוי בינוי',
    'דירות בחולון',
    'התחדשות עירונית',
  ],
  alternates: {
    canonical: `${siteUrl}/articles/urban-renewal-holon`,
  },
  openGraph: {
    title: 'התחדשות עירונית בחולון: פינוי-בינוי ותמ״א 38',
    description: 'אילו שכונות בחולון בתנופת התחדשות, ומה זה שווה לבעלי דירות ולמשקיעים — רם נכסים חיים ענבי.',
    url: `${siteUrl}/articles/urban-renewal-holon`,
    type: 'article',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'התחדשות עירונית בחולון',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'התחדשות עירונית בחולון: פינוי-בינוי ותמ״א 38',
    description: 'אילו שכונות בחולון בתנופת התחדשות, ומה זה שווה לבעלי דירות ולמשקיעים — רם נכסים חיים ענבי.',
    images: [ogImage],
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'התחדשות עירונית בחולון: ההזדמנות שמתחת לאף',
  description: 'מדריך מקיף להתחדשות עירונית בחולון: ההבדל בין פינוי-בינוי לתמ״א 38, השכונות המתחדשות, וההשלכות לבעלי דירות ומשקיעים.',
  url: `${siteUrl}/articles/urban-renewal-holon`,
  image: ogImage,
  datePublished: '2026-02-24',
  dateModified: '2026-02-24',
  inLanguage: 'he',
  articleSection: 'אזור ומיקום',
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/articles/urban-renewal-holon` },
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
      name: 'מה ההבדל בין פינוי-בינוי לתמ"א 38?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'בפינוי-בינוי הורסים מתחם שלם של בניינים ישנים ובונים במקומם שכונה חדשה — הדיירים מקבלים דירה חדשה לגמרי. בתמ"א 38 מחזקים את הבניין הקיים מפני רעידות אדמה ומוסיפים לו קומות וממ"דים, או הורסים ובונים אותו מחדש (תמ"א 38/2).',
      },
    },
    {
      '@type': 'Question',
      name: 'אילו שכונות בחולון נמצאות בתהליכי התחדשות עירונית?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'המוקדים הבולטים הם ג\'סי כהן — שם מקודמים מתחמי פינוי-בינוי גדולים, תל גיבורים הסמוכה לתל אביב, וכן מתחמים בקרית שרת ובאזורים הוותיקים של מרכז העיר. בכל שנה מצטרפים מתחמים חדשים.',
      },
    },
    {
      '@type': 'Question',
      name: 'יש לי דירה בבניין שמיועד לפינוי-בינוי. מה כדאי לעשות?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'קודם כל — אל תחתמו על שום מסמך לפני בדיקה. שווי הדירה שלכם עשוי לעלות משמעותית, אבל התהליך אורך שנים והתמורה תלויה בתנאי ההסכם מול היזם. מומלץ ללוות את התהליך עם עורך דין מטעם הדיירים ולקבל הערכת שווי עדכנית לפני כל החלטה על מכירה.',
      },
    },
  ],
};

export default function UrbanRenewalHolonPage() {
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
        { name: 'התחדשות עירונית בחולון', path: '/articles/urban-renewal-holon' },
      ]} />
      <UrbanRenewalContent />
    </>
  );
}
