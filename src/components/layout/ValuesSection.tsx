"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
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
    description: "היכרות עמוקה עם כל סוגי השירותים – מכירה, השכרה וניהול נכסים. אנו עובדים בשיתוף פעולה עם יועצי משכנתאות ועורכי דין כדי לספק פתרון כולל תחת קורת גג אחת."
  },
  {
    id: 3,
    image: "/Problem solving-rafiki.svg",
    title: "מקצועיות וניסיון מוכח",
    description: "עם מעל 24 שנות ניסיון ומאות עסקאות מוצלחות, השילוב בין הוותק לידע המקומי מאפשר לנו לנהל כל עסקה בצורה המדויקת והבטוחה ביותר עבורכם."
  }
];

const ValuesSection: React.FC = () => {
  return (
    <section dir="rtl" className="relative w-full py-20 md:py-32 overflow-hidden bg-warm">
      {/* סגנון CSS לתיקון המיקום של הנקודות במובייל */}
      <style jsx global>{`
        .values-swiper .swiper-pagination {
          position: relative !important;
          bottom: 0 !important;
          margin-top: 24px !important;
        }
        .values-swiper .swiper-pagination-bullet-active {
          background: #1e3a8a !important; /* צבע כחול כהה לנקודה הפעילה */
        }
      `}</style>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-16" style={{ maxWidth: '1400px' }}>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            למה לבחור בנו?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            שלושת העמודים המרכזיים שעליהם בנוי השירות שלנו
          </p>
        </motion.div>

        {/* Mobile View - Swiper (Visible on < 1024px) */}
        <div className="block lg:hidden">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="values-swiper"
          >
            {values.map((value) => (
              <SwiperSlide key={value.id}>
                <div className="flex flex-col items-center text-center px-4">
                  <div className="flex justify-center mb-6">
                    <img 
                      src={value.image} 
                      alt={value.title} 
                      className="w-56 h-56 object-contain"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-base text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop View - Grid (Visible on > 1024px) */}
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
              <div className="flex justify-center mb-6">
                <div className="w-56 h-56 group-hover:scale-105 transition-transform duration-500 ease-out">
                  <img 
                    src={value.image} 
                    alt={value.title} 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{value.title}</h3>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ValuesSection;