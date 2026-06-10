import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: 'למכור דירה לבד? למה זה עולה לכם יותר',
  description: 'מדריך למכירת דירה. למה מכירה עצמאית עולה יותר? תמחור כירורגי, סינון פיננסי, ניהול מו״מ מקצועי. נמכור את הדירה שלכם במחיר המקסימלי.',
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
    type: 'article',
    title: 'למכור לבד? כשה"חיסכון" בתיווך עולה לכם עשרות אלפי שקלים',
    description: 'מדריך למכירת דירה. למה מכירה עצמאית עולה יותר?',
    url: `${siteUrl}/articles/selling-alone`,
    images: [
      {
        url: `${siteUrl}/images/masterkaspler_A_candid_photograph_of_a_stressed_homeowner_sit_6c1f29f0-7069-4770-a24a-f80d5f110b06_2.png`,
        width: 1200,
        height: 630,
        alt: 'מכירת דירה',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'למכור לבד? כשה"חיסכון" בתיווך עולה לכם עשרות אלפי שקלים',
    description: 'מדריך למכירת דירה. למה מכירה עצמאית עולה יותר?',
    images: [`${siteUrl}/images/masterkaspler_A_candid_photograph_of_a_stressed_homeowner_sit_6c1f29f0-7069-4770-a24a-f80d5f110b06_2.png`],
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'למכור לבד? כשה"חיסכון" בתיווך עולה לכם עשרות אלפי שקלים',
  description: 'מדריך למכירת דירה. למה מכירה עצמאית עולה יותר? תמחור כירורגי, סינון פיננסי, ניהול מו״מ מקצועי.',
  datePublished: '2026-01-14',
  dateModified: '2026-01-14',
  url: `${siteUrl}/articles/selling-alone`,
  image: `${siteUrl}/images/masterkaspler_A_candid_photograph_of_a_stressed_homeowner_sit_6c1f29f0-7069-4770-a24a-f80d5f110b06_2.png`,
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
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/images/logos.png`,
    },
  },
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

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'דף הבית', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'מאמרים', item: `${siteUrl}/articles` },
    { '@type': 'ListItem', position: 3, name: 'למכור לבד', item: `${siteUrl}/articles/selling-alone` },
  ],
};

export default function SellingAloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
