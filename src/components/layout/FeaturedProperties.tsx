"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropertyCard from '@/components/properties/PropertyCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  originalPrice?: string;
  bedrooms: string;
  bathrooms: number;
  area: number;
  status?: string;
  images?: string[];
  image?: string;
  isSold?: boolean;
}

const FeaturedProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [titles, setTitles] = useState({
    featuredPropertiesTitle: 'נכסים באיזור המרכז',
    featuredPropertiesSubtitle: 'מגוון דירות למכירה ולהשכרה אטרקטיביות באיזור המרכז',
  });

  // Fetch featured properties from API
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);
        
        // Fetch titles
        const titlesResponse = await fetch('/api/homepage-titles', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (titlesResponse.ok) {
          const titlesData = await titlesResponse.json();
          setTitles({
            featuredPropertiesTitle: titlesData.featuredPropertiesTitle || 'נכסים באיזור המרכז',
            featuredPropertiesSubtitle: titlesData.featuredPropertiesSubtitle || 'מגוון דירות למכירה ולהשכרה אטרקטיביות באיזור המרכז',
          });
        }
        
        // Fetch pinned properties from center area for sale, limit to 3
        const response = await fetch('/api/properties?region=center&dealType=sale&pinned=true&limit=3', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json();

        // Filter out sold / rented properties – only show available ones
        const available = (data as any[]).filter((prop) => !prop.isSold);

        // Map properties to the format expected by PropertyCard
        const mappedProperties: Property[] = available.map((prop: any) => ({
          id: prop.id,
          title: prop.title,
          location: prop.location,
          price: prop.price,
          originalPrice: prop.originalPrice,
          bedrooms: prop.rooms,
          bathrooms: prop.bathrooms,
          area: prop.area,
          status: prop.status,
          image: prop.images && prop.images.length > 0 ? prop.images[0] : "/images/hero/sales.jpg",
          isSold: prop.isSold || false,
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
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#1c3664] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#1c3664] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="text-[#1c3664] font-bold text-lg uppercase tracking-wider">
              נכסים נבחרים
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tight" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>
            {titles.featuredPropertiesTitle}
          </h2>

          <p className="text-xl md:text-2xl text-gray-600 font-semibold max-w-3xl mx-auto">
            {titles.featuredPropertiesSubtitle}
          </p>
        </motion.div>

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/apartments"
            className="inline-flex items-center gap-3 px-12 py-5 bg-[#1c3664] text-white font-black text-xl uppercase tracking-tight rounded-2xl shadow-2xl hover:bg-[#152a4f] transition-all duration-300 hover:scale-105 active:scale-95 group border border-white/20"
            style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}
          >
            <span>כל הנכסים</span>
            <ArrowLeft
              size={24}
              className="transition-transform duration-300 group-hover:translate-x-2"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
