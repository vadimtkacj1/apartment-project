import type { Metadata } from 'next';
import { firstImage } from '@/lib/media';
import { prisma } from '@/lib/prisma';
import type { CityLanding } from '@/data/city-landings';
import type { CityProperty } from '@/components/pages/CityLandingContent';
import type { DealType, PropertyType } from '@/types/property.types';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

function parseJson(val: string | null | undefined): string[] {
  if (!val) return [];
  try {
    const arr = JSON.parse(val);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function resolveDealType(dealType: string, category?: string | null): DealType {
  if (category === 'rentals' || category === 'commercial') return 'rent' as DealType;
  if (category === 'sales' || category === 'land') return 'sale' as DealType;
  return dealType as DealType;
}

export async function getCityProperties(city: CityLanding, take = 6): Promise<CityProperty[]> {
  try {
    const rows = await prisma.property.findMany({
      where: { isActive: true, isSold: false, city: city.dbKey },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      take,
      select: {
        id: true, title: true, location: true, price: true, rooms: true,
        bathrooms: true, area: true, dealType: true, category: true, status: true,
        propertyType: true, floor: true, totalFloors: true, neighborhood: true,
        images: true, isSold: true,
      },
    });

    return rows.map((p) => {
      const images = parseJson(p.images);
      return {
        id: p.id,
        title: p.title,
        location: p.location,
        price: p.price,
        area: p.area,
        images,
        image: firstImage(images) || '/images/hero/sales.jpg',
        rooms: p.rooms,
        bedrooms: p.rooms,
        bathrooms: p.bathrooms ?? undefined,
        dealType: resolveDealType(p.dealType, p.category),
        category: p.category ?? undefined,
        status: p.status ?? undefined,
        isSold: Boolean(p.isSold),
        floor: p.floor ?? undefined,
        totalFloors: p.totalFloors ?? undefined,
        neighborhood: p.neighborhood ?? undefined,
        propertyType: (p.propertyType ?? undefined) as PropertyType | undefined,
      };
    });
  } catch {
    return [];
  }
}

export function cityMetadata(city: CityLanding): Metadata {
  const url = `${siteUrl}/${city.slug}`;
  return {
    title: city.metaTitle,
    description: city.metaDescription,
    keywords: city.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: city.metaTitle,
      description: city.metaDescription,
      url,
      images: [{ url: `${siteUrl}${city.heroImage}`, width: 1200, height: 630, alt: city.h1 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: city.metaTitle,
      description: city.metaDescription,
      images: [`${siteUrl}${city.heroImage}`],
    },
  };
}

export function cityFaqSchema(city: CityLanding) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: city.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function cityServiceSchema(city: CityLanding) {
  const url = `${siteUrl}/${city.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: city.h1,
    description: city.metaDescription,
    serviceType: 'תיווך נדל״ן',
    url,
    inLanguage: 'he',
    provider: { '@id': `${siteUrl}/#organization` },
    areaServed: { '@type': 'City', name: city.name },
  };
}
