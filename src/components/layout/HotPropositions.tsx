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
  // Use 2x duplication on mobile for better performance, 3x on desktop
  const duplicatedItems = useMemo(
    () => isMobile ? [...items, ...items] : [...items, ...items, ...items],
    [items, isMobile]
  );

  // On mobile, use simpler animation or disable it
  if (isMobile) {
    return (
      <div className="flex w-full overflow-x-auto scrollbar-hide" style={{ direction: 'ltr' }}>
        <div className="flex gap-4 py-4">
          {items.map((item: Property, i: number) => (
            <div key={`hot-proposition-card-mobile-${i}`} className="w-[260px] md:w-[280px] shrink-0">
              <HotPropositionCard {...item} index={i} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full overflow-hidden" style={{ direction: 'ltr' }}>
      <motion.div
        key={`hot-propositions-marquee-${direction}-${duration}`}
        className="flex gap-4 md:gap-5 py-4"
        style={{ willChange: 'transform' }}
        initial={{ x: direction === "left" ? "0%" : "-33.33%" }}
        animate={{ x: direction === "left" ? "-33.33%" : "0%" }}
        transition={{
          duration: duration,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {duplicatedItems.map((item: Property, i: number) => (
          <div key={`hot-proposition-card-${direction}-${i}`} className="w-[260px] md:w-[280px] shrink-0">
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

  // Fetch hot propositions from API
  useEffect(() => {
    const fetchHotProperties = async () => {
      try {
        setLoading(true);
        // Fetch properties from center area for sale
        const response = await fetch('/api/properties?region=center&dealType=sale&limit=12', {
          next: { revalidate: 300 } // Cache for 5 minutes
        });

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json();

        // Map properties to format expected by HotPropositionCard
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

  // Show loading state or empty state
  if (loading) {
    return (
      <section className="relative pt-24 md:pt-32 pb-12 overflow-hidden w-full" dir="rtl">
        <div className="text-center">
          <p className="text-gray-600">טוען נכסים...</p>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="relative pt-24 md:pt-32 pb-12 overflow-hidden w-full" dir="rtl">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#1c3664]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#1c3664]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16 px-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="inline-block mb-4"
          >
            <span className="text-[#1c3664] font-bold text-lg uppercase tracking-wider">
              הצעות מיוחדות
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tight">
            הצעות חמות
          </h2>
        </motion.div>

        {/* Scrolling Rows */}
        <div className="flex flex-col gap-6 md:gap-8 w-full">
          <MarqueeRow
            items={properties}
            direction="left"
            duration={30}
            isMobile={isMobile}
          />
        </div>
      </div>
    </section>
  );
}

export default memo(HotPropositions);
