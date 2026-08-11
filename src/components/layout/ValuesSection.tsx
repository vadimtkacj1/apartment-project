"use client";
import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import SectionEyebrow from '@/components/ui/SectionEyebrow';

import 'swiper/css';
import 'swiper/css/pagination';

interface ValueCard {
  id: number;
  image: string;
  title: string;
  description: string;
}

const values: ValueCard[] = [
  {
    id: 1,
    image: "/Business deal-rafiki.svg",
    title: "יחס אישי וליווי צמוד",
    description: "אנו מאמינים שכל נכס וכל לקוח הם עולם בפני עצמו. לכן, אנו מלווים אתכם באופן אישי לאורך כל הדרך, זמינים לכל שאלה ומנהלים את התהליך בצורה שקופה, רגועה ומקצועית."
  },
  {
    id: 2,
    image: "/Create-rafiki.svg",
    title: "מעטפת שירותים מלאה",
    description: "היכרות עמוקה עם כל סוגי השירותים בעולם המקרקעין – מכירה, השכרה, ניהול נכסים וחיבור לבעלי מקצוע מובילים. אנו עובדים עם יועצי משכנתאות, עורכי דין ואנשי מקצוע נוספים כדי לספק פתרון כולל תחת קורת גג אחת."
  },
  {
    id: 3,
    image: "/Problem solving-rafiki.svg",
    title: "מקצועיות וניסיון מוכח",
    description: "עם ניסיון של מעל 24 שנים, Aiterra פועל בתחום למעלה משני עשורים, יחד עם יואב אלמוג בעל ניסיון של כעשור. השילוב בין הוותק, הידע המקומי וההתמקדות בתיווך בחולון מאפשר לנו לנהל כל עסקה בצורה מדויקת ובטוחה"
  }
];

const ValuesSection: React.FC = () => {
  const [title, setTitle] = useState('למה לבחור בנו?');
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const response = await fetch('/api/homepage-titles', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setTitle(data.valuesSectionTitle || 'למה לבחור בנו?');
        }
      } catch (error) {
        console.error('Error fetching title:', error);
      }
    };
    fetchTitle();
  }, []);

  return (
    <section
      dir="rtl"
      className="relative w-full py-16 md:py-20 overflow-hidden"
      style={{ background: '#f5f7fb' }}
    >

      {/* ── Geometric background ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Diagonal lines grid */}
          <defs>
            <pattern id="diag-lines" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
              <line x1="0" y1="0" x2="0" y2="60" stroke="#051150" strokeWidth="1" strokeOpacity="0.08" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diag-lines)" />

          {/* Large decorative diagonal accent — top-right */}
          <line x1="60%" y1="0" x2="100%" y2="55%" stroke="#051150" strokeWidth="1.5" strokeOpacity="0.12" />
          <line x1="65%" y1="0" x2="100%" y2="50%" stroke="#051150" strokeWidth="1" strokeOpacity="0.08" />
          <line x1="70%" y1="0" x2="100%" y2="45%" stroke="#5594f1" strokeWidth="1" strokeOpacity="0.15" />

          {/* Large decorative diagonal accent — bottom-left */}
          <line x1="0" y1="45%" x2="40%" y2="100%" stroke="#051150" strokeWidth="1.5" strokeOpacity="0.12" />
          <line x1="0" y1="50%" x2="35%" y2="100%" stroke="#051150" strokeWidth="1" strokeOpacity="0.08" />
          <line x1="0" y1="55%" x2="30%" y2="100%" stroke="#5594f1" strokeWidth="1" strokeOpacity="0.15" />

          {/* Geometric rectangles — decorative outlines */}
          <rect x="5%" y="8%" width="120" height="120" rx="4"
            fill="none" stroke="#051150" strokeWidth="1" strokeOpacity="0.1"
            transform="rotate(-15, 120, 120)" />
          <rect x="80%" y="65%" width="90" height="90" rx="4"
            fill="none" stroke="#5594f1" strokeWidth="1.5" strokeOpacity="0.2"
            transform="rotate(20, 1200, 600)" />
          <rect x="88%" y="5%" width="70" height="70" rx="2"
            fill="none" stroke="#051150" strokeWidth="1" strokeOpacity="0.12"
            transform="rotate(-30, 1350, 80)" />

          {/* Small diamond shapes */}
          <polygon points="120,30 135,50 120,70 105,50"
            fill="none" stroke="#051150" strokeWidth="1" strokeOpacity="0.15" />
          <polygon points="1380,400 1395,420 1380,440 1365,420"
            fill="none" stroke="#5594f1" strokeWidth="1.5" strokeOpacity="0.2" />
        </svg>
      </div>

      <style jsx global>{`
        .values-swiper .swiper-pagination {
          position: relative !important;
          bottom: 0 !important;
          margin-top: 24px !important;
        }
        .values-swiper .swiper-pagination-bullet-active {
          background: #354ac4 !important;
        }
      `}</style>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-20 max-w-[87.5rem] 2xl:max-w-[112.5rem] relative z-10">

        {/* Section Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <SectionEyebrow>היתרונות שלנו</SectionEyebrow>
          </m.div>

          <h2 className="text-5xl md:text-6xl font-black text-[#051150] mb-6" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>
            {title}
          </h2>

          <p className="text-xl md:text-2xl text-gray-600 font-semibold max-w-3xl mx-auto">
            שלושת העמודים המרכזיים שעליהם בנוי השירות שלנו
          </p>
        </m.div>

        {/* Mobile View */}
        <div className="block lg:hidden">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={reduced ? false : { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            className="values-swiper"
          >
            {values.map((value) => (
              <SwiperSlide key={value.id}>
                <div className="flex flex-col items-center text-center bg-white rounded-2xl border border-[#E9EDF5] shadow-elev-1 p-7 mx-1 mb-2">
                  <div className="w-full flex justify-center mb-6 rounded-xl bg-[#F4F6FB] py-6">
                    <Image src={value.image} alt={value.title} width={200} height={200} className="object-contain" loading="lazy" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#051150] mb-3">{value.title}</h3>
                  <p className="text-base text-slate-600 leading-relaxed">{value.description}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <m.div
              key={value.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={reduced ? {} : { y: -6 }}
              className="h-full flex flex-col items-center text-center bg-white rounded-2xl border border-[#E9EDF5] shadow-elev-1 hover:shadow-elev-2 transition-shadow duration-300 p-10"
            >
              <div className="w-full flex justify-center mb-8 rounded-xl bg-[#F4F6FB] py-8">
                <div className="w-52 h-52 relative">
                  <Image src={value.image} alt={value.title} fill className="object-contain" loading="lazy" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#051150] mb-4">{value.title}</h3>
              <p className="text-base md:text-lg text-slate-600 leading-relaxed">{value.description}</p>
            </m.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ValuesSection;