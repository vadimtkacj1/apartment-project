import type { Metadata } from 'next';
import NewVsSecondhandContent from './NewVsSecondhandContent';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';
const ogImage = `${siteUrl}/images/articles/new-vs-secondhand.jpg`;

export const metadata: Metadata = {
  title: 'דירה חדשה מקבלן או יד שנייה — מה משתלם יותר?',
  description: 'דירה מקבלן או דירה יד שנייה? השוואה מלאה: מדד תשומות הבנייה, איחורים במסירה, עלויות נסתרות, מיקום ופוטנציאל השבחה — כל מה שצריך לדעת לפני ההחלטה.',
  keywords: [
    'דירה מקבלן',
    'דירה יד שנייה',
    'דירה חדשה מול ישנה',
    'מדד תשומות הבנייה',
    'קניית דירה מקבלן',
    'דירות חדשות בחולון',
    'מחיר דירה מקבלן',
    'קניית דירה',
  ],
  alternates: {
    canonical: `${siteUrl}/articles/new-vs-secondhand`,
  },
  openGraph: {
    title: 'דירה חדשה מקבלן או יד שנייה — מה משתלם יותר?',
    description: 'השוואה כנה בין דירה מקבלן לדירה יד שנייה: עלויות, סיכונים ופוטנציאל — רם נכסים חיים ענבי.',
    url: `${siteUrl}/articles/new-vs-secondhand`,
    type: 'article',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'דירה חדשה מקבלן מול דירה יד שנייה',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'דירה חדשה מקבלן או יד שנייה — מה משתלם יותר?',
    description: 'השוואה כנה בין דירה מקבלן לדירה יד שנייה: עלויות, סיכונים ופוטנציאל — רם נכסים חיים ענבי.',
    images: [ogImage],
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'קבלן או יד שנייה? ההשוואה שאף משווק לא יעשה לכם',
  description: 'השוואה מקיפה בין רכישת דירה חדשה מקבלן לדירה יד שנייה: יתרונות, עלויות נסתרות, סיכונים ושיקולי השקעה.',
  url: `${siteUrl}/articles/new-vs-secondhand`,
  image: ogImage,
  datePublished: '2026-06-02',
  dateModified: '2026-06-02',
  inLanguage: 'he',
  articleSection: 'קניה ומכירה',
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/articles/new-vs-secondhand` },
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
      name: 'מה זה מדד תשומות הבנייה ולמה הוא מייקר דירה מקבלן?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'בחוזי רכישה מקבלן, יתרת התשלומים צמודה בדרך כלל למדד תשומות הבנייה — מדד שמודד את עלויות הבנייה במשק. כשהמדד עולה, החוב שלכם לקבלן גדל בהתאם. בתקופות של התייקרות, ההצמדה יכולה להוסיף עשרות אלפי שקלים למחיר הסופי.',
      },
    },
    {
      '@type': 'Question',
      name: 'האם דירה יד שנייה זולה יותר מדירה מקבלן?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'בדרך כלל כן — על אותו מספר חדרים באותו אזור, דירה יד שנייה תעלה פחות, והמחיר סגור וידוע מראש. מנגד, ייתכנו עלויות שיפוץ והתאמה. את ההשוואה נכון לעשות על העלות הכוללת: מחיר + הצמדות + שיפוץ + עלויות נלוות.',
      },
    },
    {
      '@type': 'Question',
      name: 'מה הסיכונים בקניית דירה על הנייר?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'העיקריים: איחור במסירה (נפוץ מאוד), הצמדה למדד תשומות הבנייה, פערים בין ההדמיות למוצר הסופי, וסביבה שעדיין בבנייה שנים אחרי האכלוס. חשוב לבדוק את איתנות היזם ואת הערבויות לפי חוק המכר.',
      },
    },
  ],
};

export default function NewVsSecondhandPage() {
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
        { name: 'קבלן או יד שנייה', path: '/articles/new-vs-secondhand' },
      ]} />
      <NewVsSecondhandContent />
    </>
  );
}
