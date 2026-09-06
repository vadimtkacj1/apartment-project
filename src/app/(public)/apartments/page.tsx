import type { Metadata } from 'next';
import { firstImage } from '@/lib/media';
import ApartmentsPageClient from '@/components/pages/ApartmentsPageClient';
import { DealType, City } from '@/types/property.types';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import { prisma } from '@/lib/prisma';
import { ISRAELI_CITIES } from '@/data/cities';
import { applyListingOrder } from '@/lib/listing-order';
import { getListingOrder } from '@/lib/listing-order.server';

function parseImages(value: string | null): string[] {
  if (!value) return [];
  try {
    const arr = JSON.parse(value);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

// category has priority over dealType when they disagree (mirrors /api/properties)
function resolveDealType(dealType: string, category?: string | null): string {
  if (category === 'rentals' || category === 'commercial') return 'rent';
  if (category === 'sales' || category === 'land') return 'sale';
  return dealType;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const listingOgImage = {
  url: `${siteUrl}/images/hero/main-hero.jpg`,
  width: 1200,
  height: 630,
  alt: 'דירות למכירה ולהשכרה בחולון',
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const dealType = params.dealType as string | undefined;

  if (dealType === 'rent') {
    const title = 'דירות להשכרה בחולון';
    const description = 'מאגר דירות להשכרה בחולון, בת ים וראשון לציון. מגוון נכסים להשכרה — 2, 3, 4 חדרים ויותר. ליווי מקצועי מהחיפוש ועד חתימת החוזה.';
    return {
      title,
      description,
      keywords: ['דירות להשכרה בחולון', 'השכרת דירה חולון', 'דירות להשכרה בת ים', 'נדל״ן חולון'],
      alternates: { canonical: `${siteUrl}/apartments?dealType=rent` },
      openGraph: { title, description, url: `${siteUrl}/apartments?dealType=rent`, images: [listingOgImage] },
      twitter: { card: 'summary_large_image', title, description, images: [listingOgImage.url] },
    };
  }

  if (dealType === 'sale') {
    const title = 'דירות למכירה בחולון';
    const description = 'מאגר דירות למכירה בחולון, בת ים וראשון לציון. תמחור מדויק וליווי מלא עד סגירת העסקה.';
    return {
      title,
      description,
      keywords: ['דירות למכירה בחולון', 'נכסים למכירה חולון', 'דירות למכירה בת ים', 'נדל״ן חולון'],
      alternates: { canonical: `${siteUrl}/apartments?dealType=sale` },
      openGraph: { title, description, url: `${siteUrl}/apartments?dealType=sale`, images: [listingOgImage] },
      twitter: { card: 'summary_large_image', title, description, images: [listingOgImage.url] },
    };
  }

  const title = 'דירות למכירה ולהשכרה בחולון';
  const description = 'מאגר מלא של דירות למכירה ולהשכרה בחולון, בת ים וראשון לציון. סינון לפי מחיר, גודל, קומה ועוד. ליווי מקצועי בכל שלבי העסקה.';
  return {
    title,
    description,
    keywords: ['דירות למכירה בחולון', 'דירות להשכרה בחולון', 'נכסים למכירה חולון', 'נדל״ן חולון', 'דירות בחולון', 'נכסים להשקעה חולון', 'דירות בת ים'],
    alternates: { canonical: `${siteUrl}/apartments` },
    openGraph: { title, description, url: `${siteUrl}/apartments`, images: [listingOgImage] },
    twitter: { card: 'summary_large_image', title, description, images: [listingOgImage.url] },
  };
}

export default async function ApartmentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const dealType = params.dealType as DealType | undefined;
  const cityParam = typeof params.city === 'string' ? params.city : undefined;
  const city = cityParam && ISRAELI_CITIES.some((c) => c.value === cityParam) ? cityParam : undefined;

  // Fetch the initial listing server-side: the first paint shows property cards
  // without waiting for hydration + a client /api/properties round-trip, and
  // Google can crawl links to individual pages.
  const where: Record<string, unknown> = { isActive: true };
  if (dealType === 'sale' || dealType === 'rent') where.dealType = dealType;
  if (city) where.city = city;

  const [listingOrder, rows] = await Promise.all([
    // Order the agency picked in the CMS (admin → ניהול נכסים)
    getListingOrder(),
    prisma.property.findMany({
      where,
      select: {
        id: true, title: true, location: true, price: true, rooms: true,
        bathrooms: true, area: true, status: true, category: true,
        dealType: true, city: true, images: true, isSold: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const orderedRows = applyListingOrder(rows, listingOrder);

  // Same shape ApartmentsPageClient builds from the API response
  const initialProperties = orderedRows.map((p) => {
    const resolvedDealType = resolveDealType(p.dealType, p.category) as DealType;
    return {
      id: p.id,
      title: p.title,
      location: p.location,
      price: p.price,
      bedrooms: p.rooms,
      bathrooms: p.bathrooms,
      area: p.area,
      status: p.status ?? undefined,
      category: p.category || (resolvedDealType === 'sale' ? 'sales' : 'rentals'),
      dealType: resolvedDealType,
      city: (p.city ?? undefined) as City | undefined,
      image: firstImage(parseImages(p.images)) || '/images/hero/sales.jpg',
      isSold: Boolean(p.isSold),
    };
  });

  // Query string these filters would produce client-side — the client skips
  // its first fetch when its own filter state serializes to the same string.
  const keyParams = new URLSearchParams();
  if (dealType === 'sale' || dealType === 'rent') keyParams.append('dealType', dealType);
  if (city) keyParams.append('city', city);
  const initialFilterKey = keyParams.toString();

  const activeProperties = initialProperties;

  // Filter-aware collection so the schema matches the page's own canonical/title
  // and enumerates every crawlable listing link for Google and AI answer engines.
  const collectionName =
    dealType === 'rent' ? 'דירות להשכרה בחולון'
    : dealType === 'sale' ? 'דירות למכירה בחולון'
    : 'דירות למכירה ולהשכרה בחולון';
  const collectionUrl = `${siteUrl}/apartments${initialFilterKey ? `?${initialFilterKey}` : ''}`;
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collectionName,
    url: collectionUrl,
    inLanguage: 'he',
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#organization` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: activeProperties.length,
      itemListElement: activeProperties.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${siteUrl}/apartments/${p.id}`,
        name:
          p.title?.trim() ||
          `${p.bedrooms} חדרים ${p.dealType === 'rent' ? 'להשכרה' : 'למכירה'} ב${p.location}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <BreadcrumbSchema items={[{ name: 'דירות', path: '/apartments' }]} />
      <div className="sr-only">
        <h1>דירות למכירה ולהשכרה בחולון</h1>
        <p>
          מבחר נכסים איכותיים למכירה ולהשכרה בחולון, בת ים וכל אזור המרכז.
          דירות 2–6 חדרים, דירות גן, קוטג׳ים ונכסים להשקעה.
          רם נכסים וחיים ענבי — משרד תיווך עם ניסיון של מעל 24 שנה,
          מלווה קונים, מוכרים ומשכירים לאורך כל הדרך.
        </p>
        <nav aria-label="אזורי פעילות">
          <a href="/holon">משרד תיווך בחולון</a>
          <a href="/bat-yam">משרד תיווך בבת ים</a>
          <a href="/rishon-lezion">משרד תיווך בראשון לציון</a>
        </nav>
        <nav aria-label="רשימת נכסים">
          {activeProperties.map((p) => {
            const label = p.title?.trim() ||
              `${p.bedrooms} חדרים ${p.dealType === 'rent' ? 'להשכרה' : 'למכירה'} ב${p.location}`;
            return (
              <a key={p.id} href={`/apartments/${p.id}`}>{label}</a>
            );
          })}
        </nav>
      </div>
      <ApartmentsPageClient
        initialDealType={dealType}
        initialCity={city as City | undefined}
        initialProperties={initialProperties}
        initialFilterKey={initialFilterKey}
        defaultSort={listingOrder}
      />
    </>
  );
}