import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const homepageMetadata: Metadata = {
  title: 'רם נכסים חיים ענבי - תיווך נדל״ן בחולון',
  description: 'משרד תיווך ושיווק נדל״ן המתמחה בשיווק, מכירה והשכרה של דירות ונכסים בחולון והסביבה. ניסיון מצטבר של שנים בעולם הנדל״ן. דירות למכירה בחולון, דירות להשכרה בחולון, תיווך נדל״ן מקצועי.',
  keywords: ['תיווך נדל״ן', 'דירות למכירה', 'דירות להשכרה', 'חולון', 'נדל״ן', 'תיווך', 'תיווך נדל״ן בחולון', 'דירות למכירה בחולון', 'דירות להשכרה בחולון'],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'רם נכסים חיים ענבי - תיווך נדל״ן בחולון',
    description: 'משרד תיווך ושיווק נדל״ן המתמחה בשיווק, מכירה והשכרה של דירות ונכסים בחולון והסביבה.',
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/images/hero/main-hero.jpg`,
        width: 1200,
        height: 630,
        alt: 'רם נכסים חיים ענבי - תיווך נדל״ן בחולון',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'רם נכסים חיים ענבי - תיווך נדל״ן בחולון',
    description: 'משרד תיווך ושיווק נדל״ן המתמחה בשיווק, מכירה והשכרה של דירות ונכסים בחולון והסביבה.',
    images: [`${siteUrl}/images/hero/main-hero.jpg`],
  },
};

