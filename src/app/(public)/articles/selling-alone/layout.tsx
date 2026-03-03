import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: 'למכור לבד? כשה"חיסכון" בתיווך עולה לכם עשרות אלפי שקלים - רם נכסים חיים ענבי',
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

export default function SellingAloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

