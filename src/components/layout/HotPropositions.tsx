"use client";

import { memo, useEffect, useState } from "react";
import { m } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay } from "swiper/modules";
import PropertyCard from "@/components/properties/PropertyCard";
import { analytics } from "@/lib/analytics";
import { DealType, PropertyType, ParkingType, Position, FurnitureLevel, Direction } from "@/types/property.types";

import "swiper/css";

// Type for apartment data
interface Property {
  id: number;
  title: string;
  price: string;
  rooms?: string;
  bedrooms?: string;
  bathrooms?: number;
  area: number;
  location: string;
  image?: string;
  images?: string[];
  status?: string;
  isSold?: boolean;
  floor?: number;
  dealType?: DealType;
  propertyType?: PropertyType;
  totalFloors?: number;
  neighborhood?: string;
  street?: string;
  streetNumber?: string;
  parking?: ParkingType;
  position?: Position;
  furniture?: FurnitureLevel;
  directions?: Direction[];
  vacancyDate?: string;
  features?: any;
}

/** How many cards to show per deal-type group. The heading links to the full
    listing, so this stays a curated preview rather than an endless list. */
const MAX_PER_GROUP = 8;

/**
 * Infinite, self-advancing property carousel. It scrolls on its own — Swiper
 * `loop` + autoplay steps ONE card forward every few seconds — and pauses while
 * the pointer is over it so a visitor can read a card; cards stay draggable.
 *
 * Stepped (not a continuous marquee) on purpose: it settles on WHOLE cards
 * between steps instead of leaving cards cropped mid-flow at the edges, and moves
 * at a relaxed pace (`delay` 4.5s, smooth 0.9s transition). Integer
 * `slidesPerView` at every breakpoint keeps cards whole — no fractional peek.
 *
 * Auto-scroll only engages when a group has more cards than fit (desktop shows
 * 3); a smaller group is a static, centered row.
 */
const PropertyCarousel = ({ items }: { items: Property[] }) => {
  const autoScroll = items.length > 3;

  return (
    <div className="relative">
      <Swiper
        modules={[A11y, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        grabCursor
        loop={autoScroll}
        autoplay={autoScroll ? { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
        speed={900}
        watchOverflow
        centerInsufficientSlides={!autoScroll}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="!px-1 !py-1"
      >
        {items.map((item: Property, i: number) => {
          const cardProps = {
            ...item,
            propertyType: item.propertyType as PropertyType | undefined,
            index: i,
            // The <a> wrapper handles navigation, so the card's own click is
            // disabled to avoid a double push.
            disableClick: true,
          };
          return (
            <SwiperSlide key={`hot-proposition-card-${item.id}-${i}`} className="!h-auto">
              <a
                href={`/apartments/${item.id}`}
                onClick={() => {
                  if (!item.isSold) {
                    analytics.trackPropertyClick(item.id, 'hot-proposition');
                  }
                }}
                className="block h-full"
              >
                <PropertyCard {...cardProps} />
              </a>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

/** Heading above each grid, doubling as a link to the matching listing page. */
const RowTitle = ({ children, href }: { children: React.ReactNode; href: string }) => (
  <div className="mb-6 md:mb-8 flex items-center justify-center gap-3">
    <span className="h-px w-8 md:w-14 bg-[#c5a357]" aria-hidden="true" />
    <h3
      className="text-3xl md:text-4xl font-black text-[#1c3664] tracking-tight"
      style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}
    >
      <a href={href} className="hover:text-[#c5a357] transition-colors">
        {children}
      </a>
    </h3>
    <span className="h-px w-8 md:w-14 bg-[#c5a357]" aria-hidden="true" />
  </div>
);

interface HotPropositionsProps {
  initialProperties?: Property[];
  initialTitle?: string;
}

function HotPropositions({ initialProperties, initialTitle }: HotPropositionsProps = {}) {
  const [properties, setProperties] = useState<Property[]>(initialProperties ?? []);
  const [loading, setLoading] = useState(initialProperties === undefined);
  const [title, setTitle] = useState(initialTitle ?? 'הצעות חמות');

  useEffect(() => {
    if (initialProperties !== undefined) return;

    const fetchHotProperties = async () => {
      try {
        setLoading(true);

        // Fetch title and properties in parallel
        const [titlesResponse, response] = await Promise.all([
          fetch('/api/homepage-titles', { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } }),
          fetch('/api/properties?hotProposition=true&limit=12', { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } }),
        ]);

        if (titlesResponse.ok) {
          const titlesData = await titlesResponse.json();
          setTitle(titlesData.hotPropositionsTitle || 'הצעות חמות');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json();
        const mappedProperties: Property[] = data.map((prop: any) => ({
          id: prop.id,
          title: prop.title,
          price: prop.price,
          bedrooms: prop.rooms,
          rooms: prop.rooms,
          bathrooms: prop.bathrooms,
          area: prop.area,
          location: prop.location,
          image: prop.images && prop.images.length > 0 ? prop.images[0] : "/images/hero/sales.jpg",
          images: prop.images,
          status: prop.status,
          isSold: prop.isSold || false,
          floor: prop.floor,
          dealType: prop.dealType || (prop.category === 'rentals' || prop.category === 'commercial' ? 'rent' : 'sale'),
          category: prop.category,
          propertyType: (prop.propertyType && ['apartment', 'garden-apartment', 'cottage', 'house', 'duplex', 'penthouse', 'roof-apartment', 'housing-unit', 'studio', 'basement-apartment', 'villa'].includes(prop.propertyType))
            ? prop.propertyType as PropertyType
            : undefined,
          totalFloors: prop.totalFloors,
          neighborhood: prop.neighborhood,
          street: prop.street,
          streetNumber: prop.streetNumber,
          parking: prop.parking,
          position: prop.position,
          furniture: prop.furniture,
          directions: prop.directions,
          vacancyDate: prop.vacancyDate,
          features: prop.features,
        }));

        // Filter out sold properties
        const filteredProperties = mappedProperties.filter((prop: Property) => !prop.isSold);

        setProperties(filteredProperties);
      } catch (error) {
        console.error('Error fetching hot properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotProperties();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // One carousel per deal type: sale first, rent second. `dealType` is already
  // resolved upstream (SSR maps category -> dealType), so trust it and treat
  // anything non-rent as a sale.
  const forSale = properties.filter((p) => p.dealType !== 'rent');
  const forRent = properties.filter((p) => p.dealType === 'rent');

  if (loading) {
    return (
      <section className="relative pt-16 md:pt-24 lg:pt-32 pb-8 md:pb-12 overflow-hidden w-full" dir="rtl">
        <div className="text-center py-20">
          <p className="text-gray-600 text-lg">טוען נכסים...</p>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="relative py-16 md:py-20 overflow-hidden w-full" dir="rtl">
      <div className="relative z-10 w-full">
        {/* Section Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 px-4 md:px-6"
        >
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="text-[#1c3664] font-bold text-lg uppercase tracking-wider">
              מבחר נכסים
            </span>
          </m.div>

          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tight" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>
            {title}
          </h2>
        </m.div>

        {/* Carousel rows — one per deal type. A group with no properties is
            skipped entirely (title included) rather than left as an empty strip.
            Centered in a rem container so it uses the extra width on large
            screens without stretching edge-to-edge. */}
        <div className="flex flex-col gap-14 md:gap-20 w-full max-w-7xl mx-auto px-4 md:px-6">
          {forSale.length > 0 && (
            <div className="w-full">
              <RowTitle href="/apartments?dealType=sale">נכסים למכירה</RowTitle>
              <PropertyCarousel items={forSale.slice(0, MAX_PER_GROUP)} />
            </div>
          )}

          {forRent.length > 0 && (
            <div className="w-full">
              <RowTitle href="/apartments?dealType=rent">נכסים להשכרה</RowTitle>
              <PropertyCarousel items={forRent.slice(0, MAX_PER_GROUP)} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default memo(HotPropositions);