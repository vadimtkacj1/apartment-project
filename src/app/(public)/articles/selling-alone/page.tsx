import type { Metadata } from 'next';
import SellingAloneContent from './SellingAloneContent';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';
const ogImage = `${siteUrl}/images/masterkaspler_A_candid_photograph_of_a_stressed_homeowner_sit_6c1f29f0-7069-4770-a24a-f80d5f110b06_2.png`;

export const metadata: Metadata = {
  title: 'למכור דירה לבד לעומת עם מתווך',
  description: 'האם כדאי למכור דירה לבד? גלו למה מכירה עם מתווך מנוסה בחולון מביאה מחיר גבוה ב-5%–10%, חוסכת זמן וטעויות יקרות. תמחור נכון, שיווק מקצועי וניהול מו״מ.',
  keywords: [
    'מכירת דירה לבד',
    'מכירה עצמאית',
    'תיווך נדל״ן',
    'הערכת שווי נכס',
    'מכירת דירה בחולון',
    'ייעוץ מכירת דירה',
    'מכירת נכס',
  ],
  alternates: {
    canonical: `${siteUrl}/articles/selling-alone`,
  },
  openGraph: {
    title: 'למכור דירה לבד לעומת עם מתווך',
    description: 'למה מכירה עם מתווך מנוסה מביאה תוצאות טובות יותר ממכירה עצמאית — ניתוח מקצועי.',
    url: `${siteUrl}/articles/selling-alone`,
    type: 'article',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'מכירת דירה',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'למכור דירה לבד לעומת עם מתווך',
    description: 'למה מכירה עם מתווך מנוסה מביאה תוצאות טובות יותר ממכירה עצמאית — ניתוח מקצועי.',
    images: [ogImage],
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'למכור לבד? כשה"חיסכון" בתיווך עולה לכם עשרות אלפי שקלים',
  description: 'למה מכירה עצמאית של דירה עלולה לעלות ביוקר, ואיך מתווך מנוסה משיג תוצאות טובות יותר.',
  url: `${siteUrl}/articles/selling-alone`,
  image: ogImage,
  datePublished: '2026-01-14',
  dateModified: '2026-01-14',
  inLanguage: 'he',
  articleSection: 'קניה ומכירה',
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/articles/selling-alone` },
  isPartOf: { '@id': `${siteUrl}/#website` },
  author: {
    '@type': 'Person',
    '@id': `${siteUrl}/about#owner-1`,
    name: 'רם מזרחי',
    jobTitle: 'מתווך נדל״ן מורשה ומייסד',
    url: `${siteUrl}/about`,
    worksFor: { '@id': `${siteUrl}/#organization` },
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Real Estate License',
      identifier: '3019640',
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
      name: 'האם זה אומר שאני אקבל פחות כסף בסוף?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'להפך. הסטטיסטיקה מראה שדירה שנמכרת בעזרת מתווך מנוסה נסגרת במחיר הגבוה ב-5% עד 10% ממכירה עצמאית. זה מכסה את העמלה ומשאיר לכם עודף גדול בכיס.',
      },
    },
    {
      '@type': 'Question',
      name: 'למה שלא אפרסם לבד ורק אם לא ילך אפנה אליכם?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'כי השוק זוכר. דירה שפורסמה חודשיים ולא נמכרה מקבלת "סטיגמה". הקונים רואים ומציעים הצעות נמוכות. עדיף להתחיל חזק ונכון מהיום הראשון.',
      },
    },
    {
      '@type': 'Question',
      name: 'אתם עובדים בבלעדיות?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'כן, ובשבילכם זה יתרון. בבלעדיות אנחנו משקיעים כסף בפרסום, צילום מקצועי ושיתופי פעולה, כי אנחנו מחויבים לתוצאה. בלי בלעדיות? אף אחד לא באמת עובד בשבילכם.',
      },
    },
  ],
};

export default function SellingAlonePage() {
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
        { name: 'למכור לבד', path: '/articles/selling-alone' },
      ]} />
      <SellingAloneContent />
    </>
  );
}
