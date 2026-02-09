"use client";
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, HandshakeIcon, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ValueCard {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Обновленные цвета иконок на золотой (#C19A6B)
const values: ValueCard[] = [
  {
    id: 1,
    icon: <Users className="w-16 h-16 text-[#C19A6B]" />,
    title: "יחס אישי",
    description: "משרדנו מעניק יחס אישי וליווי צמוד ללקוחותינו בכל שלב תהליך המכירה של הנכס. בטוחים בשירות שאנו מספקים, עובדים תכנית עבודה מפורטת והסבר מוקפד שיובילו לשביעות רצונכם את הזמן והסבלנות."
  },
  {
    id: 2,
    icon: <HandshakeIcon className="w-16 h-16 text-[#C19A6B]" />,
    title: "לויאלי ומעטפת",
    description: "משרדנו מנהל שירות ליווי ללקונים ולמוכרים ויקרים. אנחנו יד ביד התחל מפיתוח התיכונות התכנונית הראשונה, ועד ליום תתחומת התחומה בשלמות ובתקינות. למשרד קיימים מקטעים קשרים ורב האמץ בתוצאה מצב מקווים דבר מתהות בדר זה ששיהיה לתקרוחותיה בסלב תעשקה השונים."
  },
  {
    id: 3,
    icon: <CheckCircle2 className="w-16 h-16 text-[#C19A6B]" />,
    title: "מקצועיות",
    description: "משרדנו בעל ניסיון עשיר של מאות עסקאות. אנחנו מתמחים רותולון ובלי על אל אות המשרדים המומלצים בתחום ובני בר אל מדור. למשרדנו קיימות שיטות שקוף רבות ומעשרות טלשטרות תקלים בתהליך מכירת הנכס שלכם."
  }
];

const ValuesSection: React.FC = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section
      dir="rtl"
      className="relative w-full py-20 md:py-32 bg-white overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 relative z-10" style={{ maxWidth: '1400px' }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 uppercase tracking-tight">
            למה לבחור בנו?
          </h2>
          {/* Золотая линия */}
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C19A6B] to-transparent mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            שלושת העמודים המרכזיים שעליהם בנוי השירות שלנו
          </p>
        </motion.div>

        {/* Desktop View - Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative p-4 text-center"
            >
              {/* Icon Container */}
              <div className="flex justify-center mb-6">
                {/* Фон иконки теперь золотистый прозрачный, а не синий */}
                <div className="p-6 bg-[#C19A6B]/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {value.title}
              </h3>

              {/* Description */}
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile View - Swiper (Improved Design) */}
        <div className="lg:hidden relative">
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{
              clickable: true,
              // Стилизация точек пагинации под золото
              bulletClass: 'swiper-pagination-bullet !bg-gray-300 !w-2.5 !h-2.5 !mx-1',
              bulletActiveClass: 'swiper-pagination-bullet-active !bg-[#C19A6B]',
            }}
            modules={[Navigation, Pagination]}
            className="!pb-14" // Добавил отступ снизу для точек
          >
            {values.map((value) => (
              <SwiperSlide key={value.id}>
                <div className="px-4 text-center">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="p-5 bg-[#C19A6B]/10 rounded-2xl">
                      {value.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base text-gray-600 leading-relaxed max-w-sm mx-auto">
                    {value.description}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons (Styled Gold) */}
          <div className="hidden sm:block"> {/* Скрываем стрелки на совсем маленьких экранах, оставляем только точки */}
            <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md border border-gray-100 hover:bg-white text-[#C19A6B] transition-all"
                aria-label="Previous slide"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
            <button
                onClick={() => swiperRef.current?.slideNext()}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md border border-gray-100 hover:bg-white text-[#C19A6B] transition-all"
                aria-label="Next slide"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;