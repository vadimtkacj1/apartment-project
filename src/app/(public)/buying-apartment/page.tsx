import type { Metadata } from 'next';
import BuyingApartmentContent from './BuyingApartmentContent';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: 'קונים דירה בחולון | מדריך רכישת דירה',
  description: 'מדריך מלא לרכישת דירה בחולון: בירור צרכים, בדיקת מימון ומשכנתא, איתור נכס, וניהול משא ומתן. ליווי מקצועי מהייעוץ הראשוני ועד קבלת המפתחות.',
  alternates: {
    canonical: `${siteUrl}/buying-apartment`,
  },
  openGraph: {
    title: 'קונים דירה בחולון | מדריך רכישת דירה',
    description: 'מדריך מלא לרכישת דירה בחולון עם ליווי מקצועי מהייעוץ הראשוני ועד קבלת המפתחות.',
    url: `${siteUrl}/buying-apartment`,
  },
};

// Q/A text must stay byte-identical to the visible FAQ in BuyingApartmentContent.tsx.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'מהן העלויות הנלוות ברכישת דירה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'מעבר למחיר הדירה כדאי להיערך לכ-3%–5% הוצאות נלוות: מס רכישה, שכר טרחת עורך דין, דמי תיווך ועלויות שיפוץ. אנחנו דואגים שהתקציב שלכם יכסה את כל ההוצאות מראש, בלי הפתעות.',
      },
    },
    {
      '@type': 'Question',
      name: 'מה זה אישור עקרוני ולמה כדאי להוציא אותו מראש?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'אישור עקרוני הוא התחייבות ראשונית של הבנק לסכום המימון. מומלץ להוציא אותו לפני שמתחילים לחפש דירה, כדי לנהל משא ומתן בביטחון ולא לפספס דירה טובה בגלל עיכובים בנקאיים.',
      },
    },
    {
      '@type': 'Question',
      name: 'אילו מסמכים בודקים לפני קניית דירה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'לכל נכס שמעניין אתכם אנחנו מוציאים נסח טאבו ותרשים בית משותף, ובודקים היסטוריית מחירים ועסקאות שבוצעו באותו בניין ובאותה שכונה — כדי שתדעו בדיוק מה אתם קונים.',
      },
    },
    {
      '@type': 'Question',
      name: 'באילו שכונות בחולון אתם מתמחים?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'אנחנו מכירים לעומק את כל שכונות העיר — גרין, נווה רמז, רסקו, קרית שרת, נאות שושנים ועוד — ומתאימים את החיפוש לצרכים ולתקציב שלכם על בסיס עסקאות שבוצעו באזור.',
      },
    },
  ],
};

export default function BuyingApartmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BreadcrumbSchema items={[{ name: 'קונים דירה', path: '/buying-apartment' }]} />
      <BuyingApartmentContent />
    </>
  );
}
