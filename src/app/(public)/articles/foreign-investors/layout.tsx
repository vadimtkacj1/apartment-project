import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: { absolute: 'נדל״ן בשלט רחוק: כשאתם בחו״ל והלב רוצה - רם נכסים חיים ענבי' },
  description: 'מדריך מקיף למשקיעים זרים שרוצים לקנות נדל״ן בישראל. ניהול נכסים מרחוק, שיפוץ, מעטפת פיננסית וניהול שוטף. תושבי חוץ - אפשר לנהל נדל״ן בישראל באפס מאמץ.',
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
    type: 'article',
    title: 'נדל״ן בשלט רחוק: כשאתם בחו״ל והלב רוצה',
    description: 'מדריך מקיף למשקיעים זרים שרוצים לקנות נדל״ן בישראל.',
    url: `${siteUrl}/articles/foreign-investors`,
    images: [
      {
        url: `${siteUrl}/images/LuxuryLiving.jpg`,
        width: 1200,
        height: 630,
        alt: 'נדל״ן בישראל למשקיעים זרים',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'נדל״ן בשלט רחוק: כשאתם בחו״ל והלב רוצה',
    description: 'מדריך מקיף למשקיעים זרים שרוצים לקנות נדל״ן בישראל.',
    images: [`${siteUrl}/images/LuxuryLiving.jpg`],
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'נדל״ן בשלט רחוק: כשאתם בחו״ל והלב רוצה',
  description: 'מדריך מקיף למשקיעים זרים שרוצים לקנות נדל״ן בישראל. ניהול נכסים מרחוק, שיפוץ, מעטפת פיננסית וניהול שוטף.',
  datePublished: '2026-01-15',
  dateModified: '2026-01-15',
  url: `${siteUrl}/articles/foreign-investors`,
  image: `${siteUrl}/images/LuxuryLiving.jpg`,
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

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'דף הבית', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'מאמרים', item: `${siteUrl}/articles` },
    { '@type': 'ListItem', position: 3, name: 'משקיעים זרים', item: `${siteUrl}/articles/foreign-investors` },
  ],
};

export default function ForeignInvestorsLayout({
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
