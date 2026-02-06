"use client";

import React, { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { usePerformanceSettings } from "@/lib/usePerformanceSettings";
import Link from "next/link";

/**
 * Static data for hot apartment propositions.
 */
const hotApartments = [
  {
    id: 1,
    title: "דירת גן מרווחת בתל אביב",
    price: "₪3,200,000",
    rooms: 4,
    area: 120,
    location: "תל אביב - רמת אביב",
  },
  {
    id: 2,
    title: "פנטהאוז יוקרתי עם נוף לים",
    price: "₪5,800,000",
    rooms: 5,
    area: 180,
    location: "תל אביב - הצפון הישן",
  },
  {
    id: 3,
    title: "דירה חדשה במגדל יוקרה",
    price: "₪2,900,000",
    rooms: 3,
    area: 95,
    location: "רמת גן - הבורסה",
  },
  {
    id: 4,
    title: "דופלקס מעוצב בשכונה שקטה",
    price: "₪4,200,000",
    rooms: 5,
    area: 160,
    location: "הרצליה - רמת הדר",
  },
  {
    id: 5,
    title: "דירת סטודיו במרכז העיר",
    price: "₪1,850,000",
    rooms: 2,
    area: 55,
    location: "תל אביב - פלורנטין",
  },
  {
    id: 6,
    title: "דירה משופצת עם מרפסת גדולה",
    price: "₪3,600,000",
    rooms: 4,
    area: 110,
    location: "גבעתיים - הדר",
  },
  {
    id: 7,
    title: "דירת 3 חדרים משופצת - להשכרה",
    price: "₪5,500",
    rooms: 3,
    area: 85,
    location: "בת ים",
  },
  {
    id: 8,
    title: "דירת 4 חדרים מרווחת במרכז חולון",
    price: "₪1,950,000",
    rooms: 4,
    area: 110,
    location: "חולון",
  },
  {
    id: 9,
    title: "פנטהאוז יוקרתי עם גג",
    price: "₪3,200,000",
    rooms: 5,
    area: 160,
    location: "ראשון לציון",
  },
  {
    id: 10,
    title: "דירת גן בשכונה שקטה",
    price: "₪2,700,000",
    rooms: 4,
    area: 125,
    location: "יפו",
  },
  {
    id: 11,
    title: "דירה חדשה מקבלן",
    price: "₪2,400,000",
    rooms: 3,
    area: 90,
    location: "חולון",
  },
  {
    id: 12,
    title: "מיני פנטהאוז עם מעלית",
    price: "₪4,500,000",
    rooms: 5,
    area: 145,
    location: "בת ים",
  },
];

/**
 * Individual Apartment Card Component.
 */
const ApartmentCard = ({ item }: { item: typeof hotApartments[0] }) => (
  <Link href={`/apartments/${item.id}`}>
    <div
      className="group relative flex flex-col w-[340px] md:w-[380px] min-h-[280px] bg-white rounded-xl overflow-hidden shrink-0 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-[#C19A6B]"
      dir="rtl"
    >
      {/* Content */}
      <div className="flex flex-col flex-1 p-6 md:p-8">
        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-[#1c3664] mb-4 text-right leading-tight">
          {item.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2.5 mb-4 text-right">
          <svg className="w-5 h-5 text-[#C19A6B] shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-600 text-base font-medium">{item.location}</span>
        </div>

        {/* Details */}
        <div className="flex items-center gap-4 mb-6 text-right text-gray-600">
          <span className="text-sm">{item.rooms} חדרים</span>
          <span className="text-sm">•</span>
          <span className="text-sm">{item.area} מ״ר</span>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="text-3xl md:text-4xl font-black text-[#1c3664] text-right">
            {item.price}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-auto">
          <div className="w-full bg-[#1c3664] text-white py-3.5 rounded-lg font-bold text-base text-center group-hover:bg-[#C19A6B] transition-all duration-300">
            לפרטים נוספים ←
          </div>
        </div>
      </div>
    </div>
  </Link>
);

/**
 * Marquee Row Component utilizing Framer Motion for high-performance looping.
 */
const MarqueeRow = ({
  items,
  direction = "left",
  duration = 40,
  isMobile = false
}: {
  items: typeof hotApartments,
  direction?: "left" | "right",
  duration?: number,
  isMobile?: boolean
}) => {
  // Use a 3x duplication strategy to ensure the line is always filled during infinite transit.
  const tripleItems = useMemo(() => [...items, ...items, ...items], [items]);

  return (
    <div className="flex w-full overflow-hidden" style={{ direction: 'ltr' }}>
      <motion.div
        key={`apartments-marquee-${direction}-${duration}`}
        className="flex gap-6 md:gap-8 py-4"
        initial={{ x: direction === "left" ? "0%" : "-33.33%" }}
        animate={{ x: direction === "left" ? "-33.33%" : "0%" }}
        transition={{
          duration: isMobile ? duration * 1.5 : duration,
          ease: "linear",
          repeat: Infinity,
        }}
        whileHover={!isMobile ? { animationPlayState: "paused" } : {}}
      >
        {tripleItems.map((item, i) => (
          <ApartmentCard key={`apartment-card-${direction}-${i}`} item={item} />
        ))}
      </motion.div>
    </div>
  );
};

function HotPropositions() {
  const { isMobile } = usePerformanceSettings();

  return (
    <section className="relative py-20 md:py-32 bg-white overflow-hidden w-full" dir="rtl">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#C19A6B]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#1c3664]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 px-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="text-[#C19A6B] font-bold text-lg uppercase tracking-wider">
              הצעות מיוחדות
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tight">
            הצעות חמות
          </h2>

          <div className="w-32 h-1 bg-[#C19A6B] mx-auto"></div>
        </motion.div>

        {/* Scrolling Rows */}
        <div className="flex flex-col gap-6 md:gap-8 w-full">
          <MarqueeRow
            items={hotApartments}
            direction="left"
            duration={60}
            isMobile={isMobile}
          />
          <MarqueeRow
            items={hotApartments}
            direction="right"
            duration={70}
            isMobile={isMobile}
          />
        </div>
      </div>
    </section>
  );
}

export default memo(HotPropositions);
