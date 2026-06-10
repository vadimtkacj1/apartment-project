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

  return (
    <ApartmentDetailClient
      propertyId={id}
      initialTitle={initialTitle}
      initialDescription={initialDescription}
    />
  );
}
