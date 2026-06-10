import { prisma } from '@/lib/prisma';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export default async function StructuredData() {
  let contactInfo: {
    phone: string | null;
    address: string | null;
    city: string | null;
    facebook: string | null;
    instagram: string | null;
    weekdayHours: string | null;
    fridayHours: string | null;
  } | null = null;

  try {
    contactInfo = await prisma.contactInfo.findFirst({
      select: {
        phone: true,
        address: true,
        city: true,
        facebook: true,
        instagram: true,
        weekdayHours: true,
        fridayHours: true,
      },
    });
  } catch {
    // non-critical — structured data falls back to static values
  }

  const sameAs = [contactInfo?.facebook, contactInfo?.instagram].filter(
    (v): v is string => typeof v === 'string' && v.length > 0
  );

  const openingHours: string[] = [];
  if (contactInfo?.weekdayHours) openingHours.push(`Mo-Fr ${contactInfo.weekdayHours}`);
  if (contactInfo?.fridayHours) openingHours.push(`Fr ${contactInfo.fridayHours}`);

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'רם נכסים חיים ענבי',
    alternateName: 'Ram Nekasim Chaim Anavi',
    description: 'משרד תיווך ושיווק נדל״ן המתמחה בשיווק, מכירה והשכרה של דירות ונכסים בחולון והסביבה',
    url: siteUrl,
    logo: `${siteUrl}/images/logos.png`,
    image: `${siteUrl}/images/hero/main-hero.jpg`,
    address: {
      '@type': 'PostalAddress',
      ...(contactInfo?.address ? { streetAddress: contactInfo.address } : {}),
      addressLocality: contactInfo?.city || 'חולון',
      addressRegion: 'מרכז',
      addressCountry: 'IL',
    },
    ...(contactInfo?.phone ? { telephone: contactInfo.phone } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(openingHours.length > 0 ? { openingHours } : {}),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+972-50-549-6626',
        email: 'rammiz800@gmail.com',
        name: 'רם מזרחי',
        contactType: 'Customer Service',
        availableLanguage: ['Hebrew', 'English'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+972-50-675-9999',
        email: 'hd.nadlan@gmail.com',
        name: 'חיים ענבי',
        contactType: 'Customer Service',
        availableLanguage: ['Hebrew', 'English'],
      },
    ],
    areaServed: [
      { '@type': 'City', name: 'חולון' },
      { '@type': 'City', name: 'בת ים' },
      { '@type': 'City', name: 'ראשון לציון' },
    ],
    serviceType: [
      'Real Estate Brokerage',
      'Property Sales',
      'Property Rentals',
      'Property Management',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'רם נכסים חיים ענבי',
    url: siteUrl,
    inLanguage: 'he',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/apartments?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
