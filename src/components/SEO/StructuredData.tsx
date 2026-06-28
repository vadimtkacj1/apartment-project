import { prisma } from '@/lib/prisma';
import { owners } from '@/app/(public)/about/aboutData';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

// Parse an "HH:MM - HH:MM" range out of a free-text Hebrew hours string so the
// schema OpeningHoursSpecification stays in sync with the admin-edited value.
function parseHours(s: string | null | undefined): { opens: string; closes: string } | null {
  if (!s) return null;
  const m = s.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/);
  if (!m) return null;
  const pad = (t: string) => (t.length === 4 ? `0${t}` : t);
  return { opens: pad(m[1]), closes: pad(m[2]) };
}

export default async function StructuredData() {
  let contactInfo: {
    phone: string | null;
    address: string | null;
    city: string | null;
    facebook: string | null;
    instagram: string | null;
    linkedin: string | null;
    latitude: number | null;
    longitude: number | null;
    mapUrl: string | null;
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
        linkedin: true,
        latitude: true,
        longitude: true,
        mapUrl: true,
        weekdayHours: true,
        fridayHours: true,
      },
    });
  } catch {
    // non-critical — structured data falls back to static values
  }

  // Guard against leftover template placeholders: an early seed shipped dead
  // "apartment-realty" social profiles, and a WRONG sameAs actively misdirects
  // Google's/AI's entity reconciliation — strictly worse than emitting none. Drop
  // any known-bad value so a stale prod ContactInfo row can't poison the graph.
  const sameAs = [contactInfo?.facebook, contactInfo?.instagram, contactInfo?.linkedin].filter(
    (v): v is string => typeof v === 'string' && v.length > 0 && !v.includes('apartment-realty')
  );

  // Coordinates: prefer the real lat/lng columns; otherwise parse them out of the
  // Google Maps URL (…?q=32.0167,34.7794) the admin already populates. Emit geo
  // only when a real point is available — never a hardcoded fallback that could
  // misplace the office.
  let lat = typeof contactInfo?.latitude === 'number' ? contactInfo.latitude : null;
  let lng = typeof contactInfo?.longitude === 'number' ? contactInfo.longitude : null;
  if ((lat == null || lng == null) && contactInfo?.mapUrl) {
    const m = contactInfo.mapUrl.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
    if (m) {
      lat = parseFloat(m[1]);
      lng = parseFloat(m[2]);
    }
  }

  // Israel work week is Sunday–Thursday, with a short Friday. Times come from the
  // human-readable DB strings (kept as the single source of truth for the UI too).
  const weekday = parseHours(contactInfo?.weekdayHours);
  const friday = parseHours(contactInfo?.fridayHours);
  const openingHoursSpecification = [
    ...(weekday
      ? [{
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          opens: weekday.opens,
          closes: weekday.closes,
        }]
      : []),
    ...(friday
      ? [{
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Friday',
          opens: friday.opens,
          closes: friday.closes,
        }]
      : []),
  ];

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${siteUrl}/#organization`,
    name: 'רם נכסים חיים ענבי',
    // Genuine alternate names of the agency — the short forms people actually type
    // (the domain is ram-haim). These teach Google to resolve "רם חיים"/"רם נכסים"
    // brand queries to this entity, not the generic adjective רם.
    alternateName: ['רם חיים', 'רם נכסים', 'רם שיווק נכסים', 'רם נדל״ן', 'רם חיים נדל״ן', 'Ram Nekasim Chaim Anavi'],
    description: 'משרד תיווך ושיווק נדל״ן המתמחה בשיווק, מכירה והשכרה של דירות ונכסים בחולון והסביבה',
    url: siteUrl,
    logo: `${siteUrl}/images/logos.png`,
    image: {
      '@type': 'ImageObject',
      url: `${siteUrl}/images/hero/main-hero.jpg`,
      width: 1200,
      height: 630,
    },
    address: {
      '@type': 'PostalAddress',
      ...(contactInfo?.address ? { streetAddress: contactInfo.address } : {}),
      addressLocality: contactInfo?.city || 'חולון',
      addressRegion: 'תל אביב',
      addressCountry: 'IL',
    },
    // Hardcoded to match contactPoint[0] (the main office line) so schema NAP never
    // drifts from the visible footer. Update here if the primary number changes.
    telephone: '+972-50-549-6626',
    ...(lat != null && lng != null
      ? { geo: { '@type': 'GeoCoordinates', latitude: lat, longitude: lng } }
      : {}),
    ...(contactInfo?.mapUrl ? { hasMap: contactInfo.mapUrl } : {}),
    currenciesAccepted: 'ILS',
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(openingHoursSpecification.length > 0 ? { openingHoursSpecification } : {}),
    // Close the entity graph: link the agency to its named founders' Person nodes
    // (emitted by PersonSchema on /about with matching @id). Reinforces E-E-A-T and
    // ties the personal brand "רם מזרחי" to the organization. Derived from the same
    // owners source so the @id scheme can never drift.
    founder: owners.map((o) => ({ '@id': `${siteUrl}/about#owner-${o.id}` })),
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
    knowsAbout: [
      'מכירת דירות',
      'השכרת דירות',
      'תיווך נדל״ן',
      'מס רכישה',
      'משכנתאות',
      'התחדשות עירונית',
      'הערכת שווי נכס',
      'השקעות נדל״ן',
      'ניהול נכסים',
      'ליווי משקיעים זרים',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: 'רם נכסים חיים ענבי',
    alternateName: ['רם חיים', 'רם נכסים', 'רם שיווק נכסים', 'רם נדל״ן', 'רם חיים נדל״ן'],
    url: siteUrl,
    inLanguage: 'he',
    publisher: { '@id': `${siteUrl}/#organization` },
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
