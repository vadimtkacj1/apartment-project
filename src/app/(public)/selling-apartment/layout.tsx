import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://go-apartsale.online';

export const metadata: Metadata = {
  title: 'מכירת דירה בחולון - תהליך מכירה מקצועי',
  description: 'מוכרים דירה בחולון? בדיקות משפטיות, הערכת שווי מדויקת, שיווק ממוקד וניהול מו״מ מקצועי. נמכור את הדירה שלכם במחיר הטוב ביותר ובזמן קצר.',
  keywords: [
    'מכירת דירה בחולון',
    'מוכרים דירה',
    'איך מוכרים דירה',
    'תהליך מכירת דירה',
    'ייעוץ מכירת דירה',
    'הערכת שווי נכס',
    'מתווך למכירת דירה',
  ],
  alternates: {
    canonical: `${siteUrl}/selling-apartment`,
  },
  openGraph: {
    title: 'מכירת דירה בחולון - תהליך מכירה מקצועי',
    description: 'בדיקות משפטיות, הערכת שווי, שיווק ממוקד וניהול מו״מ — נמכור את הדירה שלכם במחיר הטוב ביותר.',
    url: `${siteUrl}/selling-apartment`,
    images: [
      {
        url: `${siteUrl}/images/masterkaspler_A_candid_photograph_of_a_stressed_homeowner_sit_6c1f29f0-7069-4770-a24a-f80d5f110b06_2.png`,
        width: 1200,
        height: 630,
        alt: 'מכירת דירה בחולון - תהליך מקצועי',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'מכירת דירה בחולון - תהליך מכירה מקצועי',
    description: 'בדיקות משפטיות, הערכת שווי, שיווק ממוקד וניהול מו״מ — נמכור את הדירה שלכם במחיר הטוב ביותר.',
    images: [`${siteUrl}/images/masterkaspler_A_candid_photograph_of_a_stressed_homeowner_sit_6c1f29f0-7069-4770-a24a-f80d5f110b06_2.png`],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'דף הבית', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'מוכרים דירה', item: `${siteUrl}/selling-apartment` },
  ],
};

export default function SellingApartmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}

