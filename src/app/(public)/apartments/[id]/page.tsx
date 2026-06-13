import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getFullProperty } from '@/lib/property-detail';
import { getCityLabel } from '@/data/cities';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import ApartmentDetailClient from './ApartmentDetailClient';

// Revalidate pre-rendered apartment pages every 5 minutes — matches the
// freshness of the old client-side fetch (API s-maxage=300).
export const revalidate = 300;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Memoized per-request — generateMetadata and the page body share one DB round-trip.
// Serialized through JSON so the object passed to the client component is identical
// to what /api/properties/[id] returns (Dates become ISO strings).
const getProperty = cache(async (id: string) => {
  try {
    const property = await getFullProperty(parseInt(id));
    return property ? JSON.parse(JSON.stringify(property)) : null;
  } catch {
    return null;
  }
});

// Pre-render all active apartment pages at build time
export async function generateStaticParams() {
  try {
    const properties = await prisma.property.findMany({
      where: { isActive: true },
      select: { id: true },
    });
    return properties.map((p) => ({ id: String(p.id) }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return {
      title: 'נכס לא נמצא',
      description: 'הנכס המבוקש אינו קיים או אינו זמין',
    };
  }

  const images = (property.images || []) as string[];
  const firstImage = images[0];
  const dealTypeLabel = property.dealType === 'rent' ? 'להשכרה' : 'למכירה';
  const title = property.title?.trim() ||
    `${property.rooms} חדרים ${dealTypeLabel} ב${property.location}`;
  const rawDesc = property.description || '';
  const description = rawDesc.length > 0
    ? rawDesc.slice(0, 155)
    : `דירה ${dealTypeLabel} | ${property.rooms} חדרים | ${property.area} מ"ר | ${property.location} | מחיר: ${property.price}`;

  const ogImage = firstImage
    ? (firstImage.startsWith('http') ? firstImage : `${siteUrl}${firstImage}`)
    : `${siteUrl}/images/hero/main-hero.jpg`;

  const cityName = getCityLabel(property.city) || property.city || property.location;

  return {
    title,
    description,
    keywords: [
      `דירה ${dealTypeLabel}`,
      `דירה ${dealTypeLabel} ב${cityName}`,
      `${property.rooms} חדרים ${cityName}`,
      `נדל״ן ${cityName}`,
      `תיווך ${cityName}`,
      ...(property.neighborhood ? [property.neighborhood] : []),
    ],
    alternates: {
      canonical: `${siteUrl}/apartments/${id}`,
    },
    openGraph: {
      title: `${title} | רם נכסים`,
      description,
      type: 'article',
      url: `${siteUrl}/apartments/${id}`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ApartmentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) notFound();

  const dealTypeLabel = property.dealType === 'rent' ? 'להשכרה' : 'למכירה';
  const initialTitle = property.title?.trim() ||
    `${property.rooms} חדרים ${dealTypeLabel} ב${property.location}`;
  const initialDescription = property.description?.trim() || undefined;

  const images = (property.images || []) as string[];
  const firstImage = images[0];
  const ogImage = firstImage
    ? (firstImage.startsWith('http') ? firstImage : `${siteUrl}${firstImage}`)
    : `${siteUrl}/images/hero/main-hero.jpg`;

  const priceValidUntil = new Date(property.updatedAt);
  priceValidUntil.setDate(priceValidUntil.getDate() + (property.dealType === 'rent' ? 30 : 90));
  const numericPrice = property.price != null
    ? parseFloat(String(property.price).replace(/[^\d.]/g, ''))
    : NaN;

  const apartmentSchema = {
    '@context': 'https://schema.org',
    '@type': 'Apartment',
    name: initialTitle,
    ...(property.description && { description: property.description.slice(0, 300) }),
    url: `${siteUrl}/apartments/${id}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.city || property.location,
      addressCountry: 'IL',
    },
    ...(property.rooms && { numberOfRooms: property.rooms }),
    ...(property.area && { floorSize: { '@type': 'QuantitativeValue', value: property.area, unitCode: 'MTK' } }),
    image: images.length > 0
      ? images.map((img) => (img.startsWith('http') ? img : `${siteUrl}${img}`))
      : ogImage,
    offers: {
      '@type': 'Offer',
      ...(!isNaN(numericPrice) && { price: numericPrice }),
      priceCurrency: 'ILS',
      availability: property.isSold
        ? 'https://schema.org/SoldOut'
        : 'https://schema.org/InStock',
      priceValidUntil: priceValidUntil.toISOString().split('T')[0],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(apartmentSchema) }}
      />
      <BreadcrumbSchema items={[
        { name: 'דירות', path: '/apartments' },
        { name: initialTitle, path: `/apartments/${id}` },
      ]} />
      <ApartmentDetailClient
        propertyId={id}
        initialProperty={property}
        initialTitle={initialTitle}
        initialDescription={initialDescription}
      />
    </>
  );
}
