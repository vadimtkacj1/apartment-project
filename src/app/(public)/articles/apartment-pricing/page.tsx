import type { Metadata } from 'next';
import ApartmentPricingContent from './ApartmentPricingContent';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';
const ogImage = `${siteUrl}/images/articles/apartment-pricing.jpg`;

export const metadata: Metadata = {
  title: 'איך קובעים מחיר נכון לדירה למכירה?',
  description: 'תמחור דירה למכירה הוא ההחלטה הקריטית ביותר בעסקה. איך מעריכים שווי דירה, מה באמת משפיע על המחיר, ולמה מחיר גבוה מדי עולה לכם ביוקר — מדריך מלא.',
  keywords: [
    'הערכת שווי דירה',
    'תמחור דירה למכירה',
    'כמה שווה הדירה שלי',
    'שווי דירה בחולון',
    'מכירת דירה',
    'מחיר דירה',
    'שמאות מקרקעין',
    'מכירת דירה בחולון',
  ],
  alternates: {
    canonical: `${siteUrl}/articles/apartment-pricing`,
  },
  openGraph: {
    title: 'איך קובעים מחיר נכון לדירה למכירה?',
    description: 'מה באמת קובע את שווי הדירה שלכם, ולמה תמחור שגוי הוא הטעות היקרה ביותר — רם נכסים חיים ענבי.',
    url: `${siteUrl}/articles/apartment-pricing`,
    type: 'article',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'הערכת שווי דירה למכירה',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'איך קובעים מחיר נכון לדירה למכירה?',
    description: 'מה באמת קובע את שווי הדירה שלכם, ולמה תמחור שגוי הוא הטעות היקרה ביותר — רם נכסים חיים ענבי.',
    images: [ogImage],
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'כמה שווה הדירה שלכם באמת? המדריך לתמחור נכון',
  description: 'מדריך מקיף לתמחור דירה למכירה: הגורמים שמשפיעים על השווי, כלים להערכת מחיר, והטעויות שמורידות עשרות אלפי שקלים מהעסקה.',
  url: `${siteUrl}/articles/apartment-pricing`,
  image: ogImage,
  datePublished: '2026-03-10',
  dateModified: '2026-06-13',
  inLanguage: 'he',
  articleSection: 'קניה ומכירה',
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/articles/apartment-pricing` },
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
      name: 'איך אפשר לדעת כמה שווה הדירה שלי?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'שלוש דרכים מרכזיות: בדיקת עסקאות אמת באזור (באתר רשות המיסים), הזמנת שמאי מקרקעין מוסמך, או הערכת שווי ממתווך מקומי שמכיר את הביקושים בשטח. השילוב של השלושה נותן את התמונה המדויקת ביותר.',
      },
    },
    {
      '@type': 'Question',
      name: 'למה לא לפרסם במחיר גבוה "ליתר ביטחון" ולרדת אחר כך?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'כי השוק זוכר. דירה שמפורסמת במחיר מנופח לא מקבלת פניות, "נשרפת" בלוחות, ואחרי חודשיים הקונים כבר מתייחסים אליה כאל נכס בעייתי ומציעים פחות מהשווי האמיתי. ההתחלה החזקה היא שמביאה את המחיר הטוב ביותר.',
      },
    },
    {
      '@type': 'Question',
      name: 'מה משפיע הכי הרבה על שווי דירה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'המיקום הוא הגורם הדומיננטי — שכונה, רחוב וקרבה לשירותים. אחריו: קומה ומעלית, מצב תחזוקתי, ממ"ד, מרפסת, חניה, וכיווני אוויר. גם פוטנציאל התחדשות עירונית באזור יכול להוסיף משמעותית לשווי.',
      },
    },
  ],
};

export default function ApartmentPricingPage() {
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
        { name: 'תמחור דירה', path: '/articles/apartment-pricing' },
      ]} />
      <ApartmentPricingContent />
    </>
  );
}
