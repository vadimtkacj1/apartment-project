"use client";

import { memo, useEffect, useRef, useState } from "react";
import { m } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Autoplay, FreeMode } from "swiper/modules";
import PropertyCard from "@/components/properties/PropertyCard";
import { analytics } from "@/lib/analytics";
import { DealType, PropertyType, ParkingType, Position, FurnitureLevel, Direction } from "@/types/property.types";

import "swiper/css";
import "swiper/css/free-mode";

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

const MARQUEE_PX_PER_SECOND = 16;
const MARQUEE_FALLBACK_MS = 6000;
const MIN_MARQUEE_SLIDES = 16;
const WATCHDOG_MS = 400;
const STALL_EPSILON_PX = 1;
const STUCK_DRAG_MS = 3000;

const applyMarqueeSpeed = (instance: SwiperInstance) => {
  const slideWidth = instance.slidesSizesGrid?.[0];
  if (!slideWidth) return;
  const gap = Number(instance.params.spaceBetween ?? 0);
  instance.params.speed = ((slideWidth + gap) / MARQUEE_PX_PER_SECOND) * 1000;
};

const repeatToFill = (items: Property[], min: number) => {
  if (items.length === 0) return items;
  const filled = [...items];
  while (filled.length < min) filled.push(...items);
  return filled;
};

const PropertyCarousel = ({ items, reverse = false }: { items: Property[]; reverse?: boolean }) => {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const draggingSince = useRef<number | null>(null);
  const lastTranslate = useRef<number | null>(null);

  const marquee = items.length >= 2;
  const slides = marquee ? repeatToFill(items, MIN_MARQUEE_SLIDES) : items;

  useEffect(() => {
    if (!swiper || !marquee) return;

    const isDragging = () => {
      const since = draggingSince.current;
      if (since === null) return false;
      if (Date.now() - since > STUCK_DRAG_MS) {
        draggingSince.current = null;
        return false;
      }
      return true;
    };

    const endDrag = () => {
      draggingSince.current = null;
    };

    const keepMoving = () => {
      if (swiper.destroyed || !swiper.autoplay) return;
      if (isDragging() || document.visibilityState !== "visible") {
        lastTranslate.current = null;
        return;
      }

      applyMarqueeSpeed(swiper);
      if (!swiper.autoplay.running) swiper.autoplay.start();
      else if (swiper.autoplay.paused) swiper.autoplay.resume();

      const translate = swiper.translate;
      const previous = lastTranslate.current;
      lastTranslate.current = translate;

      if (previous !== null && Math.abs(translate - previous) < STALL_EPSILON_PX) {
        const step = Number(swiper.params.speed) || MARQUEE_FALLBACK_MS;
        if (reverse) swiper.slidePrev(step, true);
        else swiper.slideNext(step, true);
      }
    };

    const ticker = window.setInterval(keepMoving, WATCHDOG_MS);
    document.addEventListener("visibilitychange", keepMoving);
    window.addEventListener("focus", keepMoving);
    window.addEventListener("pageshow", keepMoving);
    window.addEventListener("touchend", endDrag);
    window.addEventListener("touchcancel", endDrag);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    return () => {
      window.clearInterval(ticker);
      document.removeEventListener("visibilitychange", keepMoving);
      window.removeEventListener("focus", keepMoving);
      window.removeEventListener("pageshow", keepMoving);
      window.removeEventListener("touchend", endDrag);
      window.removeEventListener("touchcancel", endDrag);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [swiper, marquee, reverse]);

  return (
    <div className="relative">
      <Swiper
        modules={[A11y, Autoplay, FreeMode]}
        spaceBetween={12}
        slidesPerView={2}
        grabCursor
        simulateTouch
        allowTouchMove
        touchEventsTarget="container"
        threshold={3}
        followFinger
        resistance={false}
        loop={marquee}
        loopAdditionalSlides={2}
        freeMode={marquee ? { enabled: true, momentum: true, momentumRatio: 0.7, momentumVelocityRatio: 0.7, momentumBounce: false } : false}
        autoplay={marquee ? { delay: 0, disableOnInteraction: false, stopOnLastSlide: false, reverseDirection: reverse } : false}
        speed={MARQUEE_FALLBACK_MS}
        watchOverflow
        centerInsufficientSlides={!marquee}
        breakpoints={{
          480: { slidesPerView: 2, spaceBetween: 16 },
          640: { slidesPerView: 3, spaceBetween: 16 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 24 },
          1280: { slidesPerView: 5, spaceBetween: 24 },
          1536: { slidesPerView: 6, spaceBetween: 24 },
          1920: { slidesPerView: 7, spaceBetween: 24 },
        }}
        onSwiper={(instance) => {
          setSwiper(instance);
          if (marquee) applyMarqueeSpeed(instance);
        }}
        onResize={(instance) => {
          if (marquee) applyMarqueeSpeed(instance);
        }}
        onBreakpoint={(instance) => {
          if (marquee) applyMarqueeSpeed(instance);
        }}
        onTouchStart={() => {
          draggingSince.current = Date.now();
        }}
        onTouchEnd={(instance) => {
          draggingSince.current = null;
          lastTranslate.current = null;
          if (marquee) instance.autoplay?.start();
        }}
        className={`property-carousel !px-0 !py-4 ${marquee ? "property-carousel--marquee" : ""}`}
      >
        {slides.map((item: Property, i: number) => {
          const cardProps = {
            ...item,
            propertyType: item.propertyType as PropertyType | undefined,
            index: i,
            disableClick: true,
          };
          return (
            <SwiperSlide key={`hot-proposition-card-${item.id}-${i}`} className="!h-auto">
              <a
                href={`/apartments/${item.id}`}
                draggable={false}
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
        <div className="flex flex-col gap-14 md:gap-20 w-full">
          {forSale.length > 0 && (
            <div className="w-full">
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <RowTitle href="/apartments?dealType=sale">נכסים למכירה</RowTitle>
              </div>
              <PropertyCarousel items={forSale.slice(0, MAX_PER_GROUP)} />
            </div>
          )}

          {forRent.length > 0 && (
            <div className="w-full">
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <RowTitle href="/apartments?dealType=rent">נכסים להשכרה</RowTitle>
              </div>
              <PropertyCarousel items={forRent.slice(0, MAX_PER_GROUP)} reverse />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default memo(HotPropositions);