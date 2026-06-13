import type { Metadata } from 'next';
import HomeStagingContent from './HomeStagingContent';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';
const ogImage = `${siteUrl}/images/articles/home-staging.jpg`;

export const metadata: Metadata = {
  title: 'הכנת דירה למכירה: כך תוסיפו עשרות אלפי שקלים למחיר',
  description: 'הום סטיילינג והכנת דירה למכירה: מה כדאי לתקן ומה לא, איך מציגים דירה לקונים, למה צילום מקצועי קריטי — וכמה כל זה מחזיר במחיר הסופי.',
  keywords: [
    'הכנת דירה למכירה',
    'הום סטיילינג',
    'home staging',
    'שיפוץ לפני מכירה',
    'איך למכור דירה מהר',
    'מכירת דירה בחולון',
    'צילום דירה למכירה',
    'העלאת ערך דירה',
  ],
  alternates: {
    canonical: `${siteUrl}/articles/home-staging`,
  },
  openGraph: {
    title: 'הכנת דירה למכירה: כך תוסיפו עשרות אלפי שקלים למחיר',
    description: 'מה לתקן, מה לא, ואיך מציגים דירה כך שתימכר מהר וביוקר — רם נכסים חיים ענבי.',
    url: `${siteUrl}/articles/home-staging`,
    type: 'article',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'הכנת דירה למכירה - הום סטיילינג',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'הכנת דירה למכירה: כך תוסיפו עשרות אלפי שקלים למחיר',
    description: 'מה לתקן, מה לא, ואיך מציגים דירה כך שתימכר מהר וביוקר — רם נכסים חיים ענבי.',
    images: [ogImage],
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'הום סטיילינג: ההשקעה הקטנה שמחזירה את עצמה פי עשרה',
  description: 'מדריך הכנת דירה למכירה: תיקונים משתלמים, סידור והצגה, צילום מקצועי — והטעויות שמורידות את המחיר.',
  url: `${siteUrl}/articles/home-staging`,
  image: ogImage,
  datePublished: '2026-06-09',
  dateModified: '2026-06-13',
  inLanguage: 'he',
  articleSection: 'קניה ומכירה',
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/articles/home-staging` },
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
      name: 'האם כדאי לשפץ דירה לפני מכירה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'שיפוץ קוסמטי — כמעט תמיד כן: צביעה, תיקון נזילות, החלפת ידיות וגופי תאורה. שיפוץ עומק (מטבח חדש, החלפת ריצוף) — בדרך כלל לא: הקונה ממילא ירצה לעצב לפי טעמו, ורוב ההשקעה לא תחזור במחיר.',
      },
    },
    {
      '@type': 'Question',
      name: 'כמה מוסיף הום סטיילינג למחיר הדירה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'דירה מסודרת, מוארת ומצולמת מקצועית נמכרת מהר יותר ובמחיר גבוה יותר. מהניסיון שלנו בשוק המקומי מדובר בתוספת מוערכת של אחוזים בודדים ועד 5%-10% לעומת אותה דירה מוזנחת. על דירה של 2 מיליון ש"ח, גם 3% הם 60,000 ש"ח — על השקעה של אלפי שקלים בודדים.',
      },
    },
    {
      '@type': 'Question',
      name: 'מה הדבר הכי חשוב לעשות לפני שמצלמים את הדירה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'לרוקן ולהאיר. להוציא חפצים אישיים ורהיטים עודפים (הדירה נראית גדולה יותר), לפתוח את כל התריסים ולהדליק את כל האורות. ואז — לתת לצלם מקצועי לעבוד. התמונות הן המודעה: מהניסיון שלנו, הרוב המכריע של הקונים (כ-90%) מסננים דירות לפיהן.',
      },
    },
  ],
};

export default function HomeStagingPage() {
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
        { name: 'הכנת דירה למכירה', path: '/articles/home-staging' },
      ]} />
      <HomeStagingContent />
    </>
  );
}
