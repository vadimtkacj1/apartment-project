import type { Metadata } from 'next';
import LandlordGuideContent from './LandlordGuideContent';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://go-apartsale.online';
const ogImage = `${siteUrl}/images/articles/landlord.jpg`;

export const metadata: Metadata = {
  title: 'משכירים דירה? המדריך המלא לבעלי נכסים',
  description: 'מדריך השכרת דירה לבעלי נכסים: איך קובעים שכר דירה נכון, איך מסננים שוכרים, אילו ביטחונות לדרוש בחוזה, ומה חשוב לדעת על מיסוי הכנסות משכירות.',
  keywords: [
    'השכרת דירה',
    'חוזה שכירות',
    'מיסוי שכר דירה',
    'בדיקת שוכרים',
    'ניהול נכסים',
    'דירות להשכרה בחולון',
    'שכר דירה',
    'ביטחונות בשכירות',
  ],
  alternates: {
    canonical: `${siteUrl}/articles/landlord-guide`,
  },
  openGraph: {
    title: 'משכירים דירה? המדריך המלא לבעלי נכסים',
    description: 'תמחור, סינון שוכרים, חוזה שמגן עליכם ומיסוי — כל מה שבעל נכס צריך לדעת. Aiterra.',
    url: `${siteUrl}/articles/landlord-guide`,
    type: 'article',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'השכרת דירה לבעלי נכסים',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'משכירים דירה? המדריך המלא לבעלי נכסים',
    description: 'תמחור, סינון שוכרים, חוזה שמגן עליכם ומיסוי — כל מה שבעל נכס צריך לדעת. Aiterra.',
    images: [ogImage],
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'השכרת דירה בלי כאבי ראש: המדריך לבעלי נכסים',
  description: 'מדריך מקיף להשכרת דירה: תמחור שכר דירה, סינון שוכרים, ביטחונות, חוזה שכירות נכון ומיסוי הכנסות משכירות.',
  url: `${siteUrl}/articles/landlord-guide`,
  image: ogImage,
  datePublished: '2026-04-21',
  dateModified: '2026-06-13',
  inLanguage: 'he',
  articleSection: 'השכרה וניהול',
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/articles/landlord-guide` },
  isPartOf: { '@id': `${siteUrl}/#website` },
  author: {
    '@type': 'Person',
    '@id': `${siteUrl}/about#owner-2`,
    name: 'יואב אלמוג',
    jobTitle: 'מתווך נדל״ן מורשה ומייסד',
    url: `${siteUrl}/about`,
    worksFor: { '@id': `${siteUrl}/#organization` },
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Real Estate License',
      identifier: '3184627',
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
      name: 'אילו ביטחונות לדרוש מהשוכר?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'אל תתביישו לדרוש. המקובל: שטר חוב חתום עם ערבים, צ׳ק ביטחון או ערבות בנקאית, ופיקדון. ערבים עם תלושי שכר — חובה. שוכר רציני לא נבהל מביטחונות; מי שנבהל — סימן אזהרה.',
      },
    },
    {
      '@type': 'Question',
      name: 'צריך לשלם מס על שכר הדירה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'תלוי כמה אתם מקבלים. מסלול הפטור פוטר ממס הכנסה משכירות עד תקרה חודשית של ₪5,654 (2026); מעבר לכך הפטור נשחק בהדרגה עד תקרה מתואמת של ₪11,308. לחלופין יש מסלול מס מופחת של 10% על כל המחזור (סעיף 122 לפקודת מס הכנסה), ומסלול מס שולי עם ניכוי הוצאות. בחירת המסלול הנכון שווה אלפי שקלים בשנה — שווה שיחה עם רואה חשבון.',
      },
    },
    {
      '@type': 'Question',
      name: 'הדירה עומדת ריקה כבר חודש. מה עושים?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'כל חודש ריק = 8% מההכנסה השנתית שנמחקו. בדרך כלל הבעיה היא תמחור גבוה מדי, תמונות גרועות או זמינות נמוכה לתיאום ביקורים. אצלנו דירה להשכרה מקבלת צילום מקצועי, פרסום ממוקד וסינון שוכרים — והיא לא עומדת ריקה.',
      },
    },
  ],
};

export default function LandlordGuidePage() {
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
        { name: 'השכרת דירה', path: '/articles/landlord-guide' },
      ]} />
      <LandlordGuideContent />
    </>
  );
}
