"use client";

import React, { useMemo, memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePerformanceSettings } from "@/lib/usePerformanceSettings";
import PropertyCard from "@/components/properties/PropertyCard";
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
    // Avoid showing the same 1–2 cards 3 times in a row
    if (items.length <= 2) {
      return [...items, ...items];
    }

    return isMobile ? [...items, ...items] : [...items, ...items, ...items];
  }, [items, isMobile]);

  const animationDuration = isMobile ? duration * 0.8 : duration;

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
        {duplicatedItems.map((item: Property, i: number) => {
          const cardProps = {
            ...item,
            propertyType: item.propertyType as PropertyType | undefined,
            index: i
          };
          return (
            <div key={`hot-proposition-card-${direction}-${i}`} className="w-[320px] sm:w-[340px] md:w-[360px] shrink-0">
              <PropertyCard {...cardProps} />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

function HotPropositions() {
  const { isMobile } = usePerformanceSettings();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('הצעות חמות');

  useEffect(() => {
    const fetchHotProperties = async () => {
      try {
        setLoading(true);
        
        // Fetch title
        const titlesResponse = await fetch('/api/homepage-titles', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (titlesResponse.ok) {
          const titlesData = await titlesResponse.json();
          setTitle(titlesData.hotPropositionsTitle || 'הצעות חמות');
        }
        
        const response = await fetch('/api/properties?dealType=sale&hotProposition=true&limit=12', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
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
          dealType: prop.dealType || 'sale',
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
    <section className="relative py-16 md:py-20 overflow-hidden w-full" dir="rtl">
      <div className="relative z-10 w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 px-4 md:px-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="text-[#1c3664] font-bold text-lg uppercase tracking-wider">
              מבחר נכסים
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tight" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>
            {title}
          </h2>
        </motion.div>

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