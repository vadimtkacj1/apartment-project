"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  text: string;
}

const Testimonials: React.FC = () => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "דניאל היקר",
      rating: 5,
      text: "ברציעו לשבח את דניאל על כל היחס החם במשכירה של המכירה, קשוב, מחבן, מתחשב, בעל מידות טובות, מכין את דרכי של המכי..."
    },
    {
      id: 2,
      name: "אבי כהן",
      rating: 5,
      text: "שירות מעל המצופה! דניאל ליווה אותנו לאורך כל התהליך במקצועיות רבה וסבלנות אין קץ. ממליץ בחום לכל מי שחפש אמינות."
    },
    {
      id: 3,
      name: "יוסי סנאדו",
      rating: 5,
      text: "ברצוני לשבח את דניאל על כל היחס החם ועל המיתו סות ועל הזמן הרבם, ידיעת להמת משגעת ותשובה לכל שאלה או תשובה..."
    },
    {
      id: 4,
      name: "מרינה שפיר",
      rating: 5,
      text: "דניאל הרעי, נתון שרות טוב, מיקצועי, מדייק. אחד בחורו! אני בחתמה האסכולית עיו והכל לי הולך בזכ כבר מה שעשה לי..."
    },
    {
      id: 5,
      name: "רונית לוי",
      rating: 5,
      text: "ברציעו לשבח את דניאל כי כל תהילים במשכירה של המכירה, קשוב, מחבן, מתחשב, בעל מידות טובות, מכין את דרכי של המכי..."
    }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1.5 justify-center mb-6">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={18}
            className={`${index < rating ? 'fill-[#1c3664] text-[#1c3664]' : 'fill-gray-200 text-gray-200'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <section dir="rtl" className="relative w-full pt-24 md:pt-32 pb-0 overflow-hidden bg-warm">
      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">הלקוחות שלנו משתפים</h2>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            spaceBetween={40}
            slidesPerView={1.3}
            centeredSlides={true}
            loop={true}
            onSwiper={setSwiperInstance}
            navigation={{
              nextEl: '.testimonial-swiper-button-next',
              prevEl: '.testimonial-swiper-button-prev',
            }}
            pagination={{
              clickable: true,
              el: '.testimonial-pagination',
              bulletClass: 'swiper-pagination-bullet testimonial-bullet',
              bulletActiveClass: 'testimonial-bullet-active',
            }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 2.5 },
              1280: { slidesPerView: 3 },
            }}
            className="!pb-24 !pt-12 overflow-visible"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="transition-all duration-500">
                {({ isActive }) => (
                  <div className={`
                    relative bg-white rounded-3xl p-8 md:p-10 h-full flex flex-col border transition-all duration-500 z-10
                    ${isActive 
                      ? 'border-[#1c3664]/30 shadow-[0_25px_50px_-12px_rgba(28,54,100,0.2)] scale-105' 
                      : 'border-transparent shadow-sm scale-90 opacity-40 blur-[0.5px]'}
                  `}>
                    
                    {/* Fixed Quote Position */}
                    <div className="absolute -top-6 right-10 z-20">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-500 
                        ${isActive ? 'bg-[#1c3664]' : 'bg-gray-200'}`}>
                        <Quote size={22} className="text-white fill-white" />
                      </div>
                    </div>

                    <div className="mt-6">{renderStars(testimonial.rating)}</div>

                    <div className="flex-grow flex items-center mb-8">
                      <p className={`text-center leading-relaxed text-lg transition-colors duration-500
                        ${isActive ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                        {testimonial.text}
                      </p>
                    </div>

                    {/* Кнопка "קרא עוד" удалена отсюда */}

                    <div className="flex flex-col items-center pt-8 border-t border-gray-100">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md mb-4 transition-all
                        ${isActive ? 'bg-gradient-to-br from-[#1c3664] to-[#152a4f] scale-110' : 'bg-gray-200 opacity-50'}`}>
                        {testimonial.name.charAt(0)}
                      </div>
                      <h4 className={`font-black text-xl transition-colors ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                        {testimonial.name}
                      </h4>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-30 pointer-events-none px-4 hidden md:block">
            <div className="flex justify-between max-w-[1500px] mx-auto pointer-events-auto">
              <button className="testimonial-swiper-button-prev w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1c3664] to-[#152a4f] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all">
                <ChevronRight size={24} />
              </button>
              <button className="testimonial-swiper-button-next w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1c3664] to-[#152a4f] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all">
                <ChevronLeft size={24} />
              </button>
            </div>
          </div>

          <div className="testimonial-pagination flex items-center justify-center gap-3 mt-10"></div>
        </div>
      </div>

      <style jsx global>{`
        .testimonial-bullet {
          width: 12px;
          height: 12px;
          background: #CBD5E1;
          border-radius: 50%;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .testimonial-bullet-active {
          width: 35px;
          background: #1c3664;
          border-radius: 8px;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;