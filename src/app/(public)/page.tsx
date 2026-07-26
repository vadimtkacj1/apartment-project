import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { preload } from 'react-dom';
import Hero from '@/components/layout/Hero';
import NeighborhoodChips, { type HoodChip } from '@/components/layout/NeighborhoodChips';
import SoldRecently, { type SoldItem } from '@/components/layout/SoldRecently';
import GuidesSection from '@/components/layout/GuidesSection';
import { prisma } from '@/lib/prisma';
import type { DealType, Direction, PropertyType, ParkingType, FurnitureLevel } from '@/types/property.types';

// Cache SSR output for 60 seconds — balances freshness with server load
export const revalidate = 60;

// Lazy load heavy components below the fold
const NoCommissionSection = dynamic(() => import('@/components/layout/NoCommissionSection'), {
  loading: () => <div className="h-64 bg-warm animate-pulse" />,
});

const HotPropositions = dynamic(() => import('@/components/layout/HotPropositions'), {
  loading: () => <div className="h-96 bg-warm animate-pulse" />,
});

const AboutSection = dynamic(() => import('@/components/layout/AboutSection'), {
  loading: () => <div className="h-96 bg-warm animate-pulse" />,
});

const Stats = dynamic(() => import('@/components/layout/Stats'), {
  loading: () => <div className="h-64 bg-warm animate-pulse" />,
});

const ValuesSection = dynamic(() => import('@/components/layout/ValuesSection'), {
  loading: () => <div className="h-96 bg-warm animate-pulse" />,
});

const Testimonials = dynamic(() => import('@/components/layout/Testimonials'), {
  loading: () => <div className="h-96 bg-warm animate-pulse" />,
});

const FeaturedProperties = dynamic(() => import('@/components/layout/FeaturedProperties'), {
  loading: () => <div className="h-96 bg-warm animate-pulse" />,
});

const ContactForm = dynamic(() => import('@/components/layout/ContactForm'), {
  loading: () => <div className="h-96 bg-warm animate-pulse" />,
});

function parseJson(val: string | null | undefined): string[] {
  if (!val) return [];
  try { return JSON.parse(val); } catch { return []; }
}

function resolveDealType(dealType: string, category?: string | null): string {
  if (category === 'rentals' || category === 'commercial') return 'rent';
  if (category === 'sales' || category === 'land') return 'sale';
  return dealType;
}

export default async function Home() {
  // Hero poster is referenced via <video poster> (low browser priority) —
  // preload it here, scoped to the homepage only, so it paints at FCP.
  preload('/hero-poster.jpg', { as: 'image', fetchPriority: 'high' });

  // Fetch all homepage section data in parallel — eliminates client-side waterfall
  const HomepageSettings = (prisma as any).homepageSettings;

  const [hotPropsRaw, noCommPropRaw, featuredPropsRaw, settings, hoodGroups, soldRaw] = await Promise.all([
    prisma.property.findMany({
      where: { isActive: true, isHotProposition: true, isSold: false },
      take: 12,
      select: {
        id: true, title: true, price: true, rooms: true, bathrooms: true, area: true,
        location: true, images: true, status: true, isSold: true, floor: true,
        dealType: true, category: true, propertyType: true, totalFloors: true,
        neighborhood: true, street: true, streetNumber: true, parking: true,
        position: true, furniture: true, directions: true, vacancyDate: true,
      },
    }),
    prisma.property.findFirst({
      where: { isActive: true, isNoCommission: true, isSold: false },
      select: {
        id: true, title: true, price: true, rooms: true, bathrooms: true, area: true,
        location: true, images: true, status: true, isSold: true, floor: true,
        description: true, propertyType: true, parking: true, furniture: true,
        directions: true, hasAirConditioning: true, hasElevator: true,
        hasStorage: true, hasSafeRoom: true, hasSunBalcony: true, hasBoiler: true,
        vacancyDate: true,
      },
    }),
    prisma.property.findMany({
      where: { isActive: true, dealType: 'sale', isSold: false },
      take: 3,
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true, title: true, location: true, price: true, rooms: true,
        bathrooms: true, area: true, dealType: true, category: true, status: true,
        propertyType: true, floor: true, totalFloors: true, neighborhood: true,
        images: true, isSold: true, isPinned: true,
      },
    }),
    HomepageSettings ? HomepageSettings.findFirst().catch(() => null) : Promise.resolve(null),
    prisma.property.groupBy({
      by: ['neighborhood', 'city'],
      where: { isActive: true, isSold: false, neighborhood: { not: null } },
      _count: true,
    }).catch(() => []),
    prisma.property.findMany({
      where: { isSold: true },
      orderBy: { updatedAt: 'desc' },
      take: 3,
      select: { id: true, title: true, location: true, neighborhood: true, price: true, images: true },
    }).catch(() => []),
  ]);

  const hotProperties = hotPropsRaw.map((p: any) => {
    const images = parseJson(p.images);
    return {
      id: p.id, title: p.title, price: p.price,
      rooms: p.rooms, bedrooms: p.rooms,
      bathrooms: p.bathrooms, area: p.area, location: p.location,
      images, image: images[0] || '/images/hero/sales.jpg',
      status: p.status ?? undefined, isSold: Boolean(p.isSold),
      floor: p.floor ?? undefined,
      dealType: resolveDealType(p.dealType, p.category) as DealType,
      category: p.category, propertyType: p.propertyType ?? undefined,
      totalFloors: p.totalFloors ?? undefined, neighborhood: p.neighborhood ?? undefined,
      street: p.street ?? undefined, streetNumber: p.streetNumber ?? undefined,
      parking: p.parking ?? undefined, position: p.position ?? undefined,
      furniture: p.furniture ?? undefined,
      directions: parseJson(p.directions) as Direction[],
      vacancyDate: p.vacancyDate ?? undefined,
    };
  });

  const noCommProperty = noCommPropRaw ? (() => {
    const images = parseJson(noCommPropRaw.images);
    return {
      id: noCommPropRaw.id, title: noCommPropRaw.title, price: noCommPropRaw.price,
      rooms: noCommPropRaw.rooms, bedrooms: noCommPropRaw.rooms,
      bathrooms: noCommPropRaw.bathrooms, area: noCommPropRaw.area,
      location: noCommPropRaw.location,
      images, image: images[0] || '/images/hero/sales.jpg',
      status: noCommPropRaw.status ?? undefined, isSold: Boolean(noCommPropRaw.isSold),
      floor: noCommPropRaw.floor ?? undefined,
      description: noCommPropRaw.description ?? undefined,
      propertyType: noCommPropRaw.propertyType as PropertyType | undefined,
      parking: noCommPropRaw.parking as ParkingType | undefined,
      furniture: noCommPropRaw.furniture as FurnitureLevel | undefined,
      directions: parseJson(noCommPropRaw.directions as string | null),
      hasAirConditioning: Boolean(noCommPropRaw.hasAirConditioning),
      hasElevator: Boolean(noCommPropRaw.hasElevator),
      hasStorage: Boolean(noCommPropRaw.hasStorage),
      hasSafeRoom: Boolean(noCommPropRaw.hasSafeRoom),
      hasSunBalcony: Boolean(noCommPropRaw.hasSunBalcony),
      hasBoiler: Boolean(noCommPropRaw.hasBoiler),
      vacancyDate: noCommPropRaw.vacancyDate ?? undefined,
    };
  })() : null;

  const featuredProperties = featuredPropsRaw.map((p: any) => {
    const images = parseJson(p.images);
    return {
      id: p.id, title: p.title, location: p.location, price: p.price,
      bedrooms: p.rooms, rooms: p.rooms,
      bathrooms: p.bathrooms, area: p.area,
      dealType: resolveDealType(p.dealType, p.category) as DealType,
      category: p.category, status: p.status ?? undefined,
      propertyType: p.propertyType ?? undefined,
      floor: p.floor, totalFloors: p.totalFloors,
      neighborhood: p.neighborhood ?? undefined,
      images, image: images[0] || '/images/hero/sales.jpg',
      isSold: false as const,
    };
  });


  const hoods: HoodChip[] = (hoodGroups as Array<{ neighborhood: string | null; city: string; _count: number }>)
    .filter((g) => g.neighborhood)
    .sort((a, b) => b._count - a._count)
    .slice(0, 6)
    .map((g) => ({ name: g.neighborhood as string, city: g.city, count: g._count }));

  const sold: SoldItem[] = (soldRaw as Array<{ id: number; title: string; location: string; neighborhood: string | null; price: string; images: string | null }>).map((s0) => ({
    id: s0.id, title: s0.title, location: s0.location, neighborhood: s0.neighborhood,
    price: s0.price, image: parseJson(s0.images)[0] || '/images/hero/sales.jpg',
  }));

  const homepageTitles = {
    hotPropositionsTitle: settings?.hotPropositionsTitle || 'הצעות חמות',
    noCommissionTitle: settings?.noCommissionTitle || 'דירה ללא עמלת תיווך',
    featuredPropertiesTitle: settings?.featuredPropertiesTitle || 'נכסים באיזור המרכז',
    featuredPropertiesSubtitle: settings?.featuredPropertiesSubtitle || 'מגוון דירות למכירה ולהשכרה אטרקטיביות באיזור המרכז',
  };

  return (
    <>
      {/* Hero section - scrolls normally */}
      <div className="w-full">
        <Hero />
      </div>

      {/* Content below hero - lazy loaded */}
      <div id="hero-next" className="relative bg-warm">
        <Suspense fallback={<div className="h-96 bg-warm animate-pulse" />}>
          <HotPropositions
            initialProperties={hotProperties}
            initialTitle={homepageTitles.hotPropositionsTitle}
          />
        </Suspense>
        <NeighborhoodChips hoods={hoods} />
        <Suspense fallback={<div className="h-64 bg-warm animate-pulse" />}>
          <NoCommissionSection
            initialProperty={noCommProperty}
            initialTitle={homepageTitles.noCommissionTitle}
          />
        </Suspense>
        <Suspense fallback={<div className="h-96 bg-warm animate-pulse" />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<div className="h-64 bg-warm animate-pulse" />}>
          <Stats />
        </Suspense>
        <Suspense fallback={<div className="h-96 bg-warm animate-pulse" />}>
          <ValuesSection />
        </Suspense>
        <SoldRecently items={sold} />
        <Suspense fallback={<div className="h-96 bg-warm animate-pulse" />}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<div className="h-96 bg-warm animate-pulse" />}>
          <FeaturedProperties
            initialProperties={featuredProperties}
            initialTitles={{
              featuredPropertiesTitle: homepageTitles.featuredPropertiesTitle,
              featuredPropertiesSubtitle: homepageTitles.featuredPropertiesSubtitle,
            }}
          />
        </Suspense>
        <Suspense fallback={<div className="h-96 bg-warm animate-pulse" />}>
          <ContactForm />
        </Suspense>
        {/* Server-rendered internal links to the guide/knowledge pages (SEO).
            Placed at the very bottom, just before the footer. */}
        <GuidesSection />
      </div>
    </>
  );
}
