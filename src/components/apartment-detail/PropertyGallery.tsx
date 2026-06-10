import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, Autoplay } from 'swiper/modules';
import { DealType } from '@/types/property.types';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

interface PropertyGalleryProps {
  images: string[];
  isSold: boolean;
  dealType?: DealType;
  propertyTitle?: string;
}

export function PropertyGallery({ images, isSold, dealType, propertyTitle }: PropertyGalleryProps) {
  const imageAlt = propertyTitle || `דירה ${dealType === 'rent' ? 'להשכרה' : 'למכירה'}`;
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <Swiper
        modules={[Navigation, Pagination, Thumbs, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={isSold ? false : { delay: 3000, disableOnInteraction: false }}
        loop={true}
        speed={800}
        thumbs={{ swiper: thumbsSwiper && !(thumbsSwiper as any).destroyed ? thumbsSwiper : null }}
        className={`overflow-hidden mb-4 property-slider ${isSold ? 'grayscale opacity-60' : ''}`}
        style={{ height: '85vh' }}
        dir="ltr"
      >
        {images.map((image: string, index: number) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full flex items-center justify-center bg-black/5">
              <div className="relative w-full h-full">
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  sizes="100vw"
                  className={`object-contain ${isSold ? 'grayscale opacity-60' : ''}`}
                />
                
                <div 
                  className="absolute z-10 pointer-events-none" 
                  style={{ 
                    top: '20px', 
                    left: '20px',
                    width: 'clamp(100px, 12vw, 180px)' 
                  }}
                >
                  <img
                    src="/watermark.svg"
                    alt="Logo"
                    className="w-full h-auto drop-shadow-2xl"
                  />
                </div>

                {isSold && <div className="absolute inset-0 bg-gray-900/30"></div>}
              </div>
            </div>
          </SwiperSlide>
        ))}
        {isSold && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <Image
              src={dealType === 'rent' ? '/Rented.svg' : '/Sold.svg'}
              alt={dealType === 'rent' ? 'מושכר' : 'נמכר'}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        )}
      </Swiper>

      <style jsx global>{`
        .property-slider { position: relative; }
        .property-slider .swiper-button-prev, .property-slider .swiper-button-next {
          width: 30px;
          height: 30px;
          background-color: rgba(0, 0, 0, 0.4);
          color: white;
          border-radius: 50%;
          backdrop-filter: blur(4px);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .property-slider .swiper-button-prev:hover, .property-slider .swiper-button-next:hover {
          background-color: #1c3664;
          border-color: #1c3664;
          transform: scale(1.1);
        }
        .property-slider .swiper-button-prev:after, .property-slider .swiper-button-next:after {
          font-size: 10px !important;
          font-weight: bold;
        }
        .property-slider .swiper-button-prev { left: 20px; }
        .property-slider .swiper-button-next { right: 20px; }
        .property-slider .swiper-pagination-bullet { background: white; opacity: 0.7; width: 8px; height: 8px; }
        .property-slider .swiper-pagination-bullet-active { background: #1c3664; opacity: 1; width: 24px; border-radius: 4px; }
      `}</style>

      <Swiper
        onSwiper={setThumbsSwiper as any}
        spaceBetween={10}
        slidesPerView={4}
        watchSlidesProgress
        className="rounded-xl"
      >
        {images.map((image: string, index: number) => (
          <SwiperSlide key={index} className={isSold ? 'cursor-not-allowed' : 'cursor-pointer'}>
            <div className={`relative aspect-video rounded-lg overflow-hidden transition-colors ${
              isSold ? 'opacity-60' : ''
            }`}>
              <Image src={image} alt={imageAlt} fill className={`object-contain ${isSold ? 'grayscale opacity-60' : ''}`} loading="lazy" sizes="(max-width: 768px) 25vw, 20vw" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
}