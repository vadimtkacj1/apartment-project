"use client";
import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import PropertyCard from '@/components/properties/PropertyCard';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DealType, PropertyType } from '@/types/property.types';

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  originalPrice?: string;
  bedrooms: string;
  rooms?: string;
  bathrooms: number;
  area: number;
  dealType: DealType;
  status?: string;
  propertyType?: PropertyType;
  floor?: number;
  totalFloors?: number;
  neighborhood?: string;
  features?: any;
  images?: string[];
  image?: string;
  isSold?: boolean;
}

interface FeaturedTitles {
  featuredPropertiesTitle: string;
  featuredPropertiesSubtitle: string;
}

interface FeaturedPropertiesProps {
  initialProperties?: Property[];
  initialTitles?: FeaturedTitles;
}

const DEFAULT_TITLES: FeaturedTitles = {
  featuredPropertiesTitle: 'נכסים באיזור המרכז',
  featuredPropertiesSubtitle: 'מגוון דירות למכירה ולהשכרה אטרקטיביות באיזור המרכז',
};

const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({ initialProperties, initialTitles }) => {
  const [properties, setProperties] = useState<Property[]>(initialProperties ?? []);
  const [loading, setLoading] = useState(initialProperties === undefined);
  const [titles, setTitles] = useState<FeaturedTitles>(initialTitles ?? DEFAULT_TITLES);

  // Fetch featured properties from API
  useEffect(() => {
    if (initialProperties !== undefined) return;

    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);

        const [titlesResponse, response] = await Promise.all([
          fetch('/api/homepage-titles', { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } }),
          fetch('/api/properties?dealType=sale&limit=20', { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } }),
        ]);

        if (titlesResponse.ok) {
          const titlesData = await titlesResponse.json();
          setTitles({
            featuredPropertiesTitle: titlesData.featuredPropertiesTitle || 'נכסים באיזור המרכז',
            featuredPropertiesSubtitle: titlesData.featuredPropertiesSubtitle || 'מגוון דירות למכירה ולהשכרה אטרקטיביות באיזור המרכז',
          });
        }

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json();

        // Filter out sold / rented properties – only show available ones
        const available = (data as any[]).filter((prop) => !prop.isSold);

        // Sort: pinned first, then by newest
        const sorted = available.sort((a: any, b: any) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        // Take up to 3 properties
        const topThree = sorted.slice(0, 3);

        // Map properties to the format expected by PropertyCard.
        // Force isSold = false so "נמכר/מושכר" не показується в цьому блоці.
        const mappedProperties: Property[] = topThree.map((prop: any) => ({
          id: prop.id,
          title: prop.title,
          location: prop.location,
          price: prop.price,
          originalPrice: prop.originalPrice,
          bedrooms: prop.rooms,
          rooms: prop.rooms,
          bathrooms: prop.bathrooms,
          area: prop.area,
          dealType: prop.dealType || (prop.category === 'rentals' || prop.category === 'commercial' ? 'rent' : 'sale'),
          category: prop.category,
          status: prop.status,
          propertyType: prop.propertyType,
          floor: prop.floor,
          totalFloors: prop.totalFloors,
          neighborhood: prop.neighborhood,
          features: prop.features,
          image: prop.images && prop.images.length > 0 ? prop.images[0] : "/images/hero/sales.jpg",
          images: prop.images,
          isSold: false,
        }));

        setProperties(mappedProperties);
      } catch (error) {
        console.error('Error fetching featured properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show loading state
  if (loading) {
    return (
      <section
        dir="rtl"
        className="relative w-full pt-24 md:pt-32 pb-0 overflow-hidden bg-warm"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center py-20">
            <p className="text-gray-600 text-xl">טוען נכסים...</p>
          </div>
        </div>
      </section>
    );
  }

  // Don't show section if no properties
  if (properties.length === 0) {
    return null;
  }

  return (
<section
  dir="rtl"
  className="relative w-full py-16 md:py-20 bg-warm overflow-hidden"
>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <SectionEyebrow>נכסים נבחרים</SectionEyebrow>
          </m.div>

          <h2 className="text-5xl md:text-6xl font-black text-[#051150] mb-6" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>
            {titles.featuredPropertiesTitle}
          </h2>

          <p className="text-xl md:text-2xl text-gray-600 font-semibold max-w-3xl mx-auto">
            {titles.featuredPropertiesSubtitle}
          </p>
        </m.div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {properties.map((property, index) => (
            <PropertyCard
              key={property.id}
              {...property}
              index={index}
              isSold={property.isSold}
            />
          ))}
        </div>

        {/* View All Button */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/apartments"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#354ac4] text-white font-bold text-lg rounded-xl hover:bg-[#28389b] transition-colors duration-200 group"
            style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}
          >
            <span>כל הנכסים</span>
            <ArrowLeft
              size={24}
              className="transition-transform duration-300 group-hover:translate-x-2"
            />
          </Link>
        </m.div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
