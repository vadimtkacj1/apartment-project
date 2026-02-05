"use client";
import React from 'react';
import { motion } from 'framer-motion';
import PropertyCard from '@/components/properties/PropertyCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const FeaturedProperties: React.FC = () => {
  // Sample properties data - replace with real data later
  const properties = [
    {
      id: 1,
      image: "/images/hero/sales.jpg",
      title: "חופיין 58 חולון – למכירה דירת 3.5 חדרים – מחיר שיווק",
      location: "חולון, בת ים",
      price: "1,895,000",
      originalPrice: undefined,
      bedrooms: 3.5,
      bathrooms: 2,
      area: 85,
      status: "משגע לפגוס"
    },
    {
      id: 2,
      image: "/images/hero/rentals.webp",
      title: "החשמונאים 15 חולון – למכירה דירת גג 4.5 חדרים – מחיר שיווק",
      location: "חולון",
      price: "2,020,000",
      originalPrice: "2,020,000",
      bedrooms: 4.5,
      bathrooms: 2,
      area: 120,
      status: "גגם חדש"
    },
    {
      id: 3,
      image: "/images/hero/rent.png",
      title: "דירת יוקרה בלב העיר – 5 חדרים עם מרפסת שמש",
      location: "תל אביב, יפו",
      price: "3,500,000",
      originalPrice: undefined,
      bedrooms: 5,
      bathrooms: 3,
      area: 140,
      status: "משגע לפגוס"
    }
  ];

  return (
    <section
      dir="rtl"
      className="relative w-full py-24 md:py-32 bg-gradient-to-b from-slate-50 to-white overflow-hidden"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#C19A6B] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#C19A6B] rounded-full blur-3xl"></div>
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
            <span className="text-[#C19A6B] font-bold text-lg uppercase tracking-wider">
              נכסים נבחרים
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tight">
            נכסים למכירה
          </h2>

          <div className="w-32 h-1 bg-[#C19A6B] mx-auto mb-6"></div>

          <p className="text-xl md:text-2xl text-gray-600 font-semibold max-w-3xl mx-auto">
            מבחר דירות ונכסים איכוטיים במיקומים המבוקשים ביותר
          </p>
        </motion.div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {properties.map((property, index) => (
            <PropertyCard
              key={property.id}
              {...property}
              index={index}
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
            className="inline-flex items-center gap-3 px-12 py-5 bg-gray-900 text-white font-black text-xl uppercase tracking-tight rounded-xl shadow-xl hover:bg-[#C19A6B] transition-all duration-300 hover:scale-105 active:scale-95 group"
          >
            <span>כל הנכסים</span>
            <ArrowLeft
              size={24}
              className="transform rotate-180 transition-transform duration-300 group-hover:translate-x-2"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
