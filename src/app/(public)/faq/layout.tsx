import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: { absolute: 'שאלות ותשובות - רם נכסים חיים ענבי' },
  description: 'תשובות לשאלות נפוצות על תיווך נדל״ן, רכישת דירה, מכירת דירה, משכנתאות ועוד. מידע מקצועי ומפורט על תהליכי נדל״ן.',
  keywords: [
    'שאלות ותשובות',
    'FAQ נדל״ן',
    'שאלות על תיווך',
    'שאלות על רכישת דירה',
    'שאלות על מכירת דירה',
    'מידע נדל״ן',
  ],
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
  openGraph: {
    title: 'שאלות ותשובות - רם נכסים חיים ענבי',
    description: 'תשובות לשאלות נפוצות על תיווך נדל״ן, רכישת דירה, מכירת דירה ועוד.',
    url: `${siteUrl}/faq`,
    images: [
      {
        url: `${siteUrl}/7.jpg`,
        width: 1200,
        height: 630,
        alt: 'שאלות ותשובות',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'שאלות ותשובות - רם נכסים חיים ענבי',
    description: 'תשובות לשאלות נפוצות על תיווך נדל״ן, רכישת דירה, מכירת דירה ועוד.',
    images: [`${siteUrl}/7.jpg`],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'אילו הוצאות נוספות צריך לקחת בחשבון בעת רכישת דירה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'מעבר למחיר הדירה עצמה, יש הוצאות נוספות כמו מס רכישה, שכר טרחת עורך דין, דמי תיווך, שמאות, הובלה ושיפוצים במידת הצורך. חשוב לתכנן את התקציב מראש כדי להימנע מהפתעות בהמשך.',
      },
    },
    {
      '@type': 'Question',
      name: 'כמה זמן לוקח בדרך כלל למכור דירה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'משך הזמן משתנה לפי מחיר הנכס, מיקום, מצב הדירה והביקוש באזור. דירה שמתומחרת נכון ומשווקת בצורה מקצועית יכולה להימכר בתוך שבועות ספורים, בעוד נכסים שמתומחרים גבוה מדי עלולים להישאר זמן רב בשוק.',
      },
    },
    {
      '@type': 'Question',
      name: 'איך ניתן למכור דירה במהירות ובמחיר טוב?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'המפתח הוא תמחור נכון מההתחלה, צילום איכותי, שיווק ממוקד וניהול משא ומתן מקצועי. שילוב של כל הגורמים האלו מגדיל משמעותית את הסיכוי למכירה מהירה ובתנאים טובים.',
      },
    },
    {
      '@type': 'Question',
      name: 'איך יודעים שהמחיר של הדירה ריאלי?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'בדיקת מחיר מתבצעת לפי עסקאות שבוצעו באזור, מצב הנכס, קומה, גודל, חניה, מעלית ומאפיינים נוספים. מתווך שמכיר היטב את השוק המקומי יכול לתת הערכת מחיר מדויקת המבוססת על נתונים אמיתיים ולא על תחושות.',
      },
    },
    {
      '@type': 'Question',
      name: 'האם אפשר לשפר את ערך הדירה לפני מכירה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'כן. לעיתים שיפוצים קלים, צביעה, סידור וניקיון מקצועי יכולים לשפר משמעותית את הרושם על קונים פוטנציאליים ולהוביל להצעות מחיר גבוהות יותר.',
      },
    },
    {
      '@type': 'Question',
      name: 'כמה זמן לוקח לקבל משכנתא לאחר חתימת חוזה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ברוב המקרים התהליך לוקח בין שלושה לשישה שבועות, תלוי בבנק, במורכבות התיק ובמסמכים הנדרשים. תכנון נכון והכנה מוקדמת יכולים לקצר את התהליך.',
      },
    },
    {
      '@type': 'Question',
      name: 'מה צריך לבדוק לפני רכישת דירה יד שנייה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'חשוב לבדוק את מצבה הפיזי של הדירה, רישום בטאבו, חריגות בנייה, חובות קיימים, מצב הבניין והסביבה. בדיקה יסודית מונעת בעיות משפטיות והוצאות בלתי צפויות.',
      },
    },
    {
      '@type': 'Question',
      name: 'האם כדאי למכור דירה לבד או עם מתווך?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'מכירה עם מתווך מקצועי חוסכת זמן, טעויות ולחצים מיותרים. מתווך מנוסה מבצע תמחור מדויק, משווק את הנכס לקהל יעד נכון ומנהל את המשא ומתן בצורה שתשיג את התנאים הטובים ביותר עבור המוכר.',
      },
    },
    {
      '@type': 'Question',
      name: 'מה כולל תהליך ליווי במכירת נכס?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'התהליך כולל הערכת שווי, בניית אסטרטגיית שיווק, צילום מקצועי, פרסום הנכס, סינון פניות, תיאום ביקורים, ניהול משא ומתן וליווי עד חתימת החוזה.',
      },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'דף הבית', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'שאלות נפוצות', item: `${siteUrl}/faq` },
  ],
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
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
