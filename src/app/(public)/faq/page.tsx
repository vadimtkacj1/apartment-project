import type { Metadata } from 'next';
import React from 'react';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FAQ from '@/components/layout/FAQ';
import { faqData } from '@/data/faqData';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://go-apartsale.online';

export const metadata: Metadata = {
  title: 'שאלות ותשובות בנדל״ן',
  description: 'תשובות לשאלות הנפוצות ביותר בנושאי קנייה, מכירה והשכרה של דירות בחולון. מס רכישה, תהליך מכירה, הערכת שווי נכס, חוזי שכירות ועוד.',
  keywords: [
    'שאלות על תיווך חולון',
    'FAQ נדל״ן',
    'כמה עולה מתווך',
    'שאלות על רכישת דירה',
    'שאלות על מכירת דירה',
    'מידע נדל״ן חולון',
  ],
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
  openGraph: {
    title: 'שאלות ותשובות בנדל״ן',
    description: 'תשובות לשאלות הנפוצות ביותר בנושאי קנייה, מכירה והשכרה של דירות בחולון.',
    url: `${siteUrl}/faq`,
    images: [
      {
        url: `${siteUrl}/images/hero/main-hero.jpg`,
        width: 1200,
        height: 630,
        alt: 'שאלות ותשובות תיווך נדל״ן חולון',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'שאלות ותשובות בנדל״ן',
    description: 'תשובות לשאלות הנפוצות ביותר בנושאי קנייה, מכירה והשכרה של דירות בחולון.',
    images: [`${siteUrl}/images/hero/main-hero.jpg`],
  },
};

const faqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <BreadcrumbSchema items={[{ name: 'שאלות נפוצות', path: '/faq' }]} />
      <SecondaryHero
        img="/7.jpg"
        title="שאלות ותשובות"
        centered={true}
      />
      <Breadcrumbs />
      <main className="min-h-screen bg-warm">
        <FAQ />
      </main>
    </>
  );
}
