"use client";

import React, { useMemo, memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePerformanceSettings } from "@/lib/usePerformanceSettings";
import HotPropositionCard from "@/components/properties/HotPropositionCard";

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
  const duplicatedItems = useMemo(
    () => isMobile ? [...items, ...items] : [...items, ...items, ...items],
    [items, isMobile]
  );

  const animationDuration = isMobile ? duration * 1.5 : duration;

  const xInitial = direction === "left" ? "0%" : (isMobile ? "-50%" : "-33.33%");
  const xAnimate = direction === "left" ? (isMobile ? "-50%" : "-33.33%") : "0%";

  return (
    <div className="flex w-full overflow-hidden" style={{ direction: 'ltr' }}>
      <motion.div
        key={`hot-propositions-marquee-${direction}-${animationDuration}`}
        className="flex gap-4 md:gap-6 py-4 md:py-6"
        style={{ willChange: 'transform' }}
        initial={{ x: xInitial }}
        animate={{ x: xAnimate }}
        transition={{
          duration: animationDuration,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {duplicatedItems.map((item: Property, i: number) => (
          <div key={`hot-proposition-card-${direction}-${i}`} className="w-[320px] sm:w-[340px] md:w-[360px] shrink-0">
            <HotPropositionCard {...item} index={i} />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

function HotPropositions() {
  const { isMobile } = usePerformanceSettings();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotProperties = async () => {
      try {
        setLoading(true);

        // First, fetch the homepage settings to determine the mode
        const settingsResponse = await fetch('/api/admin/homepage-settings');
        const settings = await settingsResponse.json();

        let apiUrl = '/api/properties?dealType=sale&limit=12';

        if (settings.hotPropositionsMode === 'manual') {
          // Manual mode: fetch properties tagged as hot propositions
          apiUrl += '&hotProposition=true';
        } else if (settings.hotPropositionsMode === 'price' && settings.hotPropositionsMaxPrice) {
          // Price mode: fetch properties below the max price
          apiUrl += `&maxPrice=${settings.hotPropositionsMaxPrice}`;
        } else {
          // If price mode but no price set, don't show anything
          setProperties([]);
          setLoading(false);
          return;
        }

        const response = await fetch(apiUrl, {
          next: { revalidate: 300 }
        });

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
        }));

        setProperties(mappedProperties);
      } catch (error) {
        console.error('Error fetching hot properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotProperties();
  }, []);

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
    <section className="relative pt-16 md:pt-24 lg:pt-32 pb-8 md:pb-12 overflow-hidden w-full" dir="rtl">
      {/* Decorative Background Elements удалены, чтобы убрать синие пятна */}

      <div className="relative z-10 w-full">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16 px-4 md:px-6">
          <div className="inline-block mb-3 md:mb-4">
            <span className="text-[#1c3664] font-bold text-sm md:text-lg uppercase tracking-wider">
              הצעות מיוחדות
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 md:mb-6 uppercase tracking-tight">
            הצעות חמות
          </h2>
        </div>

        {/* Scrolling Rows */}
        <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 w-full">
          <MarqueeRow
            items={properties}
            direction="left"
            duration={60}
            isMobile={isMobile}
          />
        </div>
      </div>
    </section>
  );
}

export default memo(HotPropositions);