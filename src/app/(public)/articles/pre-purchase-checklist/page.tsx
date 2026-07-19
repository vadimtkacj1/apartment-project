import type { Metadata } from 'next';
import PrePurchaseContent from './PrePurchaseContent';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://go-apartsale.online';
const ogImage = `${siteUrl}/images/articles/pre-purchase.jpg`;

export const metadata: Metadata = {
  title: 'בדיקות לפני קניית דירה יד שנייה: הצ׳קליסט המלא',
  description: 'אילו בדיקות חובה לעשות לפני קניית דירה? נסח טאבו, היתרי בנייה, חריגות, רטיבות, בדק בית ובדיקות מס — הצ׳קליסט שיציל אתכם מעסקה גרועה.',
  keywords: [
    'בדיקות לפני קניית דירה',
    'נסח טאבו',
    'בדק בית',
    'חריגות בנייה',
    'קניית דירה יד שנייה',
    'בדיקת דירה לפני קנייה',
    'היתר בנייה',
    'עורך דין מקרקעין',
  ],
  alternates: {
    canonical: `${siteUrl}/articles/pre-purchase-checklist`,
  },
  openGraph: {
    title: 'בדיקות לפני קניית דירה יד שנייה: הצ׳קליסט המלא',
    description: 'נסח טאבו, היתרים, רטיבות ובדיקות מס — כל הבדיקות לפני חתימה. Aiterra.',
    url: `${siteUrl}/articles/pre-purchase-checklist`,
    type: 'article',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'בדיקת דירה לפני קנייה',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'בדיקות לפני קניית דירה יד שנייה: הצ׳קליסט המלא',
    description: 'נסח טאבו, היתרים, רטיבות ובדיקות מס — כל הבדיקות לפני חתימה. Aiterra.',
    images: [ogImage],
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'הצ׳קליסט שיציל אתכם: כל הבדיקות לפני קניית דירה',
  description: 'מדריך בדיקות מקיף לפני רכישת דירה יד שנייה: בדיקות משפטיות, תכנוניות, פיזיות וסביבתיות — והטעויות שעולות מאות אלפי שקלים.',
  url: `${siteUrl}/articles/pre-purchase-checklist`,
  image: ogImage,
  datePublished: '2026-05-19',
  dateModified: '2026-06-13',
  inLanguage: 'he',
  articleSection: 'קניה ומכירה',
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/articles/pre-purchase-checklist` },
  isPartOf: { '@id': `${siteUrl}/#website` },
  author: {
    '@type': 'Person',
    '@id': `${siteUrl}/about#owner-1`,
    name: 'דניאל שרון',
    jobTitle: 'מתווך נדל״ן מורשה ומייסד',
    url: `${siteUrl}/about`,
    worksFor: { '@id': `${siteUrl}/#organization` },
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Real Estate License',
      identifier: '3072851',
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
      name: 'מה זה נסח טאבו ואיך מוציאים אותו?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'נסח טאבו הוא תעודת הזהות של הנכס: מי הבעלים הרשום, ואילו משכנתאות, עיקולים והערות אזהרה רובצים עליו. מוציאים אותו אונליין באתר רשם המקרקעין תוך דקות ובעלות סמלית — וזו הבדיקה הראשונה שעושים, לפני כל התקדמות בעסקה.',
      },
    },
    {
      '@type': 'Question',
      name: 'האם שווה לשלם על בדק בית לדירה יד שנייה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'כן. בדיקה מקצועית עולה בדרך כלל 1,500–3,000 ש"ח ומגלה רטיבות נסתרת, בעיות חשמל, צנרת ישנה וליקויי בנייה. ממצא אחד משמעותי יכול לחסוך עשרות אלפי שקלים בתיקונים — או לשמש קלף מיקוח על המחיר.',
      },
    },
    {
      '@type': 'Question',
      name: 'מה הסיכון בקניית דירה עם חריגות בנייה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'חריגות בנייה (תוספת סגורה ללא היתר, פיצול דירה) עלולות לגרור צווי הריסה, קנסות וקשיים במשכנתא ובמכירה עתידית. חובה להשוות את מצב הדירה בפועל להיתר הבנייה בעירייה לפני חתימה — עורך דין מקרקעין יודע לבדוק זאת.',
      },
    },
  ],
};

export default function PrePurchaseChecklistPage() {
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
        { name: 'בדיקות לפני קנייה', path: '/articles/pre-purchase-checklist' },
      ]} />
      <PrePurchaseContent />
    </>
  );
}
