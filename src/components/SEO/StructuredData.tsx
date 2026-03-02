const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ramnekasim.co.il';

interface StructuredDataProps {
  type?: 'Organization' | 'RealEstateAgent' | 'WebSite';
  propertyData?: {
    name?: string;
    description?: string;
    price?: string;
    address?: string;
    images?: string[];
  };
}

export default function StructuredData({ type = 'Organization', propertyData }: StructuredDataProps) {
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
      addressLocality: 'חולון',
      addressRegion: 'מרכז',
      addressCountry: 'IL',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['Hebrew', 'English'],
    },
    sameAs: [
      // Add social media links if available
    ],
    areaServed: {
      '@type': 'City',
      name: 'חולון',
    },
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
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/apartments?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const propertySchema = propertyData ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: propertyData.name,
    description: propertyData.description,
    image: propertyData.images || [],
    offers: {
      '@type': 'Offer',
      price: propertyData.price,
      priceCurrency: 'ILS',
      availability: 'https://schema.org/InStock',
    },
  } : null;

  const schemas: Array<Record<string, any>> = [organizationSchema, websiteSchema];
  if (propertySchema) {
    schemas.push(propertySchema);
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

