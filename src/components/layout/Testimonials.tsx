"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import type { Swiper as SwiperType } from 'swiper';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

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
      name: "יוסי סנאדו",
      rating: 5,
      text: "ברצוני לשבח את דניאל על כל היחס החם ועל המיתו סות ועל הזמן הרבם, ידיעת להמת משגעת ותשובה לכל שאלה או תשובה..."
    },
    {
      id: 3,
      name: "רונית לוי",
      rating: 5,
      text: "ברציעו לשבח את דניאל כי כל תהילים במשכירה של המכירה, קשוב, מחבן, מתחשב, בעל מידות טובות, מכין את דרכי של המכי..."
    },
    {
      id: 4,
      name: "משאיל מחרבד",
      rating: 5,
      text: "אני רוצה להמליץ בחום על המתווך הספר דניאל, אחד בחורו! אני בחתמה האסכולית עיו והכל לי הולך בזכ כבר מה שעשה לי..."
    },
    {
      id: 5,
      name: "מרינה שפיר",
      rating: 5,
      text: "דניאל הרעי, נתון שרות טוב, מיקצועי, מדייק. אחד בחורו! אני בחתמה האסכולית עיו והכל לי הולך בזכ כבר מה שעשה לי..."
    }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1 justify-center mb-4">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={18}
            className={`${
              index < rating
                ? 'fill-[#C19A6B] text-[#C19A6B]'
                : 'fill-gray-300 text-gray-300'
            } transition-all duration-300`}
          />
        ))}
      </div>
    );
  };

  return (
    <section
      dir="rtl"
      className="relative w-full py-16 md:py-20 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-[#C19A6B] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-[#C19A6B] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="text-[#C19A6B] font-bold text-lg uppercase tracking-wider">
              חוות דעת
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 uppercase tracking-tight">
            מה מספרים עלינו הלקוחות?
          </h2>

          <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-[#C19A6B] to-transparent mx-auto mb-8"></div>

          <p className="text-xl md:text-2xl text-gray-600 font-semibold max-w-3xl mx-auto">
            הלקוחות שלנו משתפים את החוויה שלהם
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative px-4"
        >
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            spaceBetween={40}
            slidesPerView={1}
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
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1.5,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 25,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1280: {
                slidesPerView: 3.5,
                spaceBetween: 30,
              },
            }}
            className="testimonials-swiper !pb-20"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="!h-auto">
                {({ isActive }) => (
                  <div
                    className={`
                      relative bg-white rounded-2xl p-6 h-full flex flex-col
                      border-2 transition-all duration-500 transform
                      ${isActive
                        ? 'border-[#C19A6B] shadow-2xl scale-100'
                        : 'border-gray-200 shadow-lg scale-95 opacity-60'
                      }
                      hover:shadow-2xl
                    `}
                  >
                    {/* Quote Icon */}
                    <div className="absolute -top-4 right-6">
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center shadow-lg
                        transition-all duration-500
                        ${isActive
                          ? 'bg-gradient-to-br from-[#C19A6B] to-[#8B7355] rotate-0'
                          : 'bg-gray-200 rotate-12'
                        }
                      `}>
                        <Quote
                          size={20}
                          className={`${isActive ? 'text-white' : 'text-gray-400'} transition-colors duration-500`}
                        />
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="mt-4">
                      {renderStars(testimonial.rating)}
                    </div>

                    {/* Testimonial Text */}
                    <div className="flex-grow flex items-center justify-center my-4">
                      <p className={`
                        text-center leading-relaxed transition-all duration-500
                        ${isActive
                          ? 'text-gray-800 text-base md:text-lg font-medium'
                          : 'text-gray-600 text-sm md:text-base'
                        }
                      `}>
                        {testimonial.text}
                      </p>
                    </div>

                    {/* Read More Link */}
                    <div className="text-center mb-4">
                      <a
                        href="#"
                        className={`
                          inline-flex items-center gap-2 font-bold text-sm
                          transition-all duration-300 group
                          ${isActive ? 'text-[#C19A6B]' : 'text-gray-400'}
                        `}
                      >
                        קרא עוד
                        <ChevronLeft
                          size={16}
                          className="group-hover:translate-x-[-4px] transition-transform"
                        />
                      </a>
                    </div>

                    {/* Author */}
                    <div className="flex flex-col items-center pt-4 border-t-2 border-gray-100">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center
                        text-white font-black text-lg shadow-lg mb-3
                        transition-all duration-500
                        ${isActive
                          ? 'bg-gradient-to-br from-[#C19A6B] to-[#8B7355] scale-110'
                          : 'bg-gradient-to-br from-gray-400 to-gray-500 scale-100'
                        }
                      `}>
                        {testimonial.name.charAt(0)}
                      </div>
                      <h4 className={`
                        font-black text-base uppercase tracking-tight transition-all duration-500
                        ${isActive ? 'text-gray-900' : 'text-gray-600'}
                      `}>
                        {testimonial.name}
                      </h4>
                    </div>

                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-10 pointer-events-none">
            <div className="max-w-[1500px] mx-auto px-4 flex items-center justify-between pointer-events-auto">
              <button
                className="testimonial-swiper-button-prev w-12 h-12 rounded-xl bg-gradient-to-br from-[#C19A6B] to-[#8B7355] text-white flex items-center justify-center shadow-xl hover:shadow-[#C19A6B]/50 transition-all duration-300 hover:scale-110 active:scale-95 group border-2 border-white/20"
                onClick={() => swiperInstance?.slidePrev()}
              >
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                className="testimonial-swiper-button-next w-12 h-12 rounded-xl bg-gradient-to-br from-[#C19A6B] to-[#8B7355] text-white flex items-center justify-center shadow-xl hover:shadow-[#C19A6B]/50 transition-all duration-300 hover:scale-110 active:scale-95 group border-2 border-white/20"
                onClick={() => swiperInstance?.slideNext()}
              >
                <ChevronLeft size={20} className="group-hover:translate-x-[-4px] transition-transform" />
              </button>
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="testimonial-pagination flex items-center justify-center gap-3 mt-8"></div>
        </motion.div>
      </div>

      <style jsx global>{`
        .testimonials-swiper {
          overflow: visible !important;
        }

        .testimonial-bullet {
          width: 12px;
          height: 12px;
          background: #D1D5DB;
          opacity: 1;
          border-radius: 50%;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .testimonial-bullet:hover {
          background: #9CA3AF;
          transform: scale(1.2);
        }

        .testimonial-bullet-active {
          width: 40px;
          border-radius: 6px;
          background: linear-gradient(90deg, #C19A6B 0%, #8B7355 100%);
        }

        .swiper-slide {
          transition: all 0.5s ease;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
