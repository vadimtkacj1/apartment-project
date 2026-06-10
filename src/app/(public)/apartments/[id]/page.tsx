import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ApartmentDetailClient from './ApartmentDetailClient';

// Revalidate pre-rendered apartment pages every hour
export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Memoized per-request — generateMetadata and the page body share one DB round-trip
const getProperty = cache(async (id: string) => {
  try {
    return await prisma.property.findUnique({
      where: { id: parseInt(id), isActive: true },
      select: {
        title: true,
        description: true,
        price: true,
        location: true,
        rooms: true,
        area: true,
        dealType: true,
        images: true,
        isSold: true,
        city: true,
        updatedAt: true,
      },
    });
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

  const images = JSON.parse(property.images || '[]') as string[];
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

  return {
    title,
    description,
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

  const images = JSON.parse(property.images || '[]') as string[];
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
    image: ogImage,
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
      <ApartmentDetailClient
        propertyId={id}
        initialTitle={initialTitle}
        initialDescription={initialDescription}
      />
    </>
  );
}
