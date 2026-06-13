import type { Metadata } from 'next';
import MortgageGuideContent from './MortgageGuideContent';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';
const ogImage = `${siteUrl}/images/articles/mortgage.jpg`;

export const metadata: Metadata = {
  title: 'משכנתא לדירה: איך מתכוננים נכון ומשיגים תנאים טובים',
  description: 'מדריך משכנתא מעשי: מה זה אישור עקרוני, כמה הון עצמי דורש הבנק, מה ההבדל בין מסלולי הריבית, והאם משתלם לקחת יועץ משכנתאות. כל מה שצריך לדעת לפני שחותמים.',
  keywords: [
    'משכנתא',
    'אישור עקרוני למשכנתא',
    'מסלולי משכנתא',
    'הון עצמי משכנתא',
    'יועץ משכנתאות',
    'ריבית משכנתא',
    'משכנתא לדירה ראשונה',
    'מחזור משכנתא',
  ],
  alternates: {
    canonical: `${siteUrl}/articles/mortgage-guide`,
  },
  openGraph: {
    title: 'משכנתא לדירה: איך מתכוננים נכון ומשיגים תנאים טובים',
    description: 'אישור עקרוני, הון עצמי, מסלולי ריבית וטיפים לשיפור התנאים — רם נכסים חיים ענבי.',
    url: `${siteUrl}/articles/mortgage-guide`,
    type: 'article',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'תכנון משכנתא לרכישת דירה',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'משכנתא לדירה: איך מתכוננים נכון ומשיגים תנאים טובים',
    description: 'אישור עקרוני, הון עצמי, מסלולי ריבית וטיפים לשיפור התנאים — רם נכסים חיים ענבי.',
    images: [ogImage],
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'משכנתא בלי פאניקה: המדריך המעשי לרוכשי דירות',
  description: 'מדריך מקיף למשכנתא: אישור עקרוני, דרישות הון עצמי, מסלולי ריבית, יועץ משכנתאות וטיפים לשיפור תנאי ההלוואה.',
  url: `${siteUrl}/articles/mortgage-guide`,
  image: ogImage,
  datePublished: '2026-04-07',
  dateModified: '2026-06-13',
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
    logo: { '@type': 'ImageObject', url: `${siteUrl}/images/logos.png` },
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'מה זה אישור עקרוני למשכנתא וכמה זה עולה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'אישור עקרוני הוא התחייבות ראשונית של הבנק לסכום ההלוואה שיעמיד לכם, על סמך הכנסות והתחייבויות. הוא ניתן בחינם, בדרך כלל בתוך ימים ספורים, ותקף לתקופה מוגבלת. מומלץ להוציא אותו לפני שמתחילים לחפש דירה.',
      },
    },
    {
      '@type': 'Question',
      name: 'כמה הון עצמי דורש הבנק למשכנתא?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'לפי הנחיות בנק ישראל: לדירה ראשונה (יחידה) — מימון של עד 75% משווי הדירה (25% הון עצמי). למשפרי דיור — עד 70%. לדירה להשקעה — עד 50% בלבד.',
      },
    },
    {
      '@type': 'Question',
      name: 'האם כדאי לקחת יועץ משכנתאות?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ברוב המקרים — כן. יועץ טוב בונה תמהיל מותאם אישית, מנהל מכרז בין הבנקים ומשיג ריביות שקשה להשיג לבד. העלות נעה בין כמה אלפי שקלים בודדים, והחיסכון לאורך חיי המשכנתא יכול להגיע לעשרות ומאות אלפי שקלים.',
      },
    },
  ],
};

export default function MortgageGuidePage() {
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
        { name: 'משכנתא', path: '/articles/mortgage-guide' },
      ]} />
      <MortgageGuideContent />
    </>
  );
}
