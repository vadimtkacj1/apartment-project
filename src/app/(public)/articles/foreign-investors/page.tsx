import type { Metadata } from 'next';
import ForeignInvestorsContent from './ForeignInvestorsContent';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';
const ogImage = `${siteUrl}/images/LuxuryLiving.jpg`;

export const metadata: Metadata = {
  title: 'נדל״ן בישראל עבור תושבי חוץ ומשקיעים זרים',
  description: 'מדריך מקיף לרכישת דירה בישראל מרחוק: ייפוי כוח נוטריוני, מימון ומשכנתא לתושבי חוץ, ניהול נכסים מקצועי בחולון ובת ים. רם נכסים — עיניים והידיים שלכם בארץ.',
  keywords: [
    'משקיעים זרים',
    'תושבי חוץ',
    'נדל״ן בישראל',
    'רכישת דירה מרחוק',
    'ניהול נכסים',
    'השקעות בנדל"ן',
    'קניית דירה בישראל',
    'דירות להשקעה',
  ],
  alternates: {
    canonical: `${siteUrl}/articles/foreign-investors`,
  },
  openGraph: {
    title: 'נדל״ן בישראל עבור תושבי חוץ ומשקיעים זרים',
    description: 'מדריך לרכישת דירה בישראל מרחוק עם ליווי מקצועי מלא — רם נכסים חיים ענבי.',
    url: `${siteUrl}/articles/foreign-investors`,
    type: 'article',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'נדל״ן בישראל למשקיעים זרים',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'נדל״ן בישראל עבור תושבי חוץ ומשקיעים זרים',
    description: 'מדריך לרכישת דירה בישראל מרחוק עם ליווי מקצועי מלא — רם נכסים חיים ענבי.',
    images: [ogImage],
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'נדל״ן בשלט רחוק: כשאתם בחו״ל והלב רוצה',
  description: 'מדריך מקיף לרכישת דירה בישראל מרחוק עבור תושבי חוץ ומשקיעים זרים.',
  url: `${siteUrl}/articles/foreign-investors`,
  image: ogImage,
  datePublished: '2026-01-15',
  dateModified: '2026-06-11',
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
      name: 'האם אני חייב להגיע לארץ כדי לחתום?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ברוב המקרים - לא. בעזרת ייפוי כוח נוטריוני ועורכי הדין שאנחנו עובדים איתם, ניתן לבצע את כל תהליך הרכישה מרחוק בצורה מאובטחת וחוקית לחלוטין.',
      },
    },
    {
      '@type': 'Question',
      name: 'מי מבטיח לי שהשיפוץ יתבצע כמו שצריך?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'אנחנו. אנחנו שולחים לכם וידאו ותמונות בזמן אמת מהשטח. אתם רואים את הריצוף, את הצבע ואת המטבח החדש מתקדם, בלי לצאת מהבית בחו"ל.',
      },
    },
    {
      '@type': 'Question',
      name: 'אתם מטפלים גם בנכסים מסחריים?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'בהחלט. יש לנו ניסיון רב עם מגרשים, מפעלים ועסקים, כולל ניהול המורכבויות הייחודיות של נדל"ן מסחרי.',
      },
    },
  ],
};

export default function ForeignInvestorsPage() {
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
        { name: 'משקיעים זרים', path: '/articles/foreign-investors' },
      ]} />
      <ForeignInvestorsContent />
    </>
  );
}
