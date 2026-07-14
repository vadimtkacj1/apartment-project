"use client";

import { useMemo, memo, useEffect, useState } from "react";
import { m } from "framer-motion";
import { usePerformanceSettings } from "@/lib/usePerformanceSettings";
import PropertyCard from "@/components/properties/PropertyCard";
import { analytics } from "@/lib/analytics";
import { DealType, PropertyType, ParkingType, Position, FurnitureLevel, Direction } from "@/types/property.types";

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

/**
 * Marquee Row Component utilizing Framer Motion for high-performance looping.
 */
const MarqueeRow = ({
  items,
  direction = "left",
  duration = 40,
  isMobile = false
}: {
  items: Property[],
  direction?: "left" | "right",
  duration?: number,
  isMobile?: boolean
}) => {
  const duplicatedItems = useMemo(() => {
    // Guarantee smooth infinite carousel even when there are few items
    if (items.length === 1) {
      // One item – duplicate more times to avoid big empty gaps
      return [...items, ...items, ...items, ...items];
    }
    if (items.length === 2) {
      // Two items – 3 cycles give good density
      return [...items, ...items, ...items];
    }

    // 3+ items – standard behavior
    return isMobile ? [...items, ...items] : [...items, ...items, ...items];
  }, [items, isMobile]);

  const animationDuration = isMobile ? duration * 0.8 : duration;

  const xInitial = direction === "left" ? "0%" : (isMobile ? "-50%" : "-33.33%");
  const xAnimate = direction === "left" ? (isMobile ? "-50%" : "-33.33%") : "0%";

  return (
    <div className="flex w-full overflow-hidden" style={{ direction: 'ltr' }}>
      <m.div
        key={`hot-propositions-marquee-${direction}-${animationDuration}`}
        className="flex gap-4 md:gap-6 py-4 md:py-6"
        style={{
          willChange: 'transform',
          pointerEvents: 'auto'
        }}
        initial={{ x: xInitial }}
        animate={{ x: xAnimate }}
        transition={{
          duration: animationDuration,
          ease: "linear",
          repeat: Infinity,
        }}
        onMouseDown={(e) => {
          // Allow clicks to pass through to links
          const target = e.target as HTMLElement;
          if (target.closest('a')) {
            e.stopPropagation();
          }
        }}
      >
        {duplicatedItems.map((item: Property, i: number) => {
          const cardProps = {
            ...item,
            propertyType: item.propertyType as PropertyType | undefined,
            index: i,
            disableClick: true
          };
          return (
            <a
              key={`hot-proposition-card-${direction}-${i}`}
              href={`/apartments/${item.id}`}
              onClick={(e) => {
                if (!item.isSold) {
                  analytics.trackPropertyClick(item.id, 'hot-proposition');
                }
              }}
              draggable={false}
              className="w-[320px] sm:w-[340px] md:w-[360px] shrink-0 block select-none"
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
            >
              <PropertyCard {...cardProps} />
            </a>
          );
        })}
      </m.div>
    </div>
  );
};

/** Heading above each marquee, doubling as a link to the matching listing page. */
const MarqueeTitle = ({ children, href }: { children: React.ReactNode; href: string }) => (
  <div className="px-4 md:px-6 mb-2 flex items-center justify-center gap-3">
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
  const { isMobile } = usePerformanceSettings();
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

  // One marquee per deal type: sale first, rent second. `dealType` is already
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

        {/* Scrolling Rows — one per deal type. A group with no properties is
            skipped entirely (title included) rather than left as an empty strip. */}
        <div className="flex flex-col gap-10 md:gap-14 w-full">
          {forSale.length > 0 && (
            <div className="w-full">
              <MarqueeTitle href="/apartments?dealType=sale">נכסים למכירה</MarqueeTitle>
              <MarqueeRow
                items={forSale}
                direction="left"
                duration={60}
                isMobile={isMobile}
              />
            </div>
          )}

          {forRent.length > 0 && (
            <div className="w-full">
              <MarqueeTitle href="/apartments?dealType=rent">נכסים להשכרה</MarqueeTitle>
              <MarqueeRow
                items={forRent}
                direction="right"
                duration={60}
                isMobile={isMobile}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default memo(HotPropositions);