import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, Autoplay } from 'swiper/modules';
import { Maximize2, X, ChevronRight, ChevronLeft } from 'lucide-react';
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
  // realIndex tracks the active slide even under loop mode (Swiper clones slides).
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const hasMultiple = images.length > 1;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  // RTL chevron mapping: ChevronRight = previous, ChevronLeft = next.
  const prevLightbox = () => setLightboxIndex((i) => (i - 1 + images.length) % images.length);
  const nextLightbox = () => setLightboxIndex((i) => (i + 1) % images.length);

  // Lock body scroll + wire Escape while the fullscreen lightbox is open.
  useEffect(() => {
    if (!lightboxOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxOpen]);

  return (
    // No entrance animation on the gallery wrapper: it holds the LCP image, and an
    // initial opacity:0 (rendered into the SSR HTML by framer-motion) prevents the
    // image from counting as "contentful" until the client hydrates + the fade runs,
    // pushing LCP out by seconds on slow mobile. The hero now paints as soon as it loads.
    <div className="mb-8">
      <div className="relative mb-4">
        <Swiper
          modules={[Navigation, Pagination, Thumbs, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={isSold ? false : { delay: 3000, disableOnInteraction: false }}
          loop={true}
          speed={800}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          thumbs={{ swiper: thumbsSwiper && !(thumbsSwiper as any).destroyed ? thumbsSwiper : null }}
          // Responsive height instead of a flat 85vh: on a portrait phone 85vh is a
          // ~720px box and an `object-contain` landscape photo only fills ~220px of
          // it, leaving huge empty bands above/below (the "broken" look under the
          // header). A width-proportional height keeps the frame photo-shaped.
          className={`overflow-hidden property-slider h-75 sm:h-110 md:h-140 lg:h-[78vh] ${isSold ? 'grayscale opacity-60' : ''}`}
          dir="ltr"
        >
          {images.map((image: string, index: number) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full flex items-center justify-center bg-black/5">
                <div className="relative w-full h-full">
                  <Image
                    src={image}
                    alt={images.length > 1 ? `${imageAlt} - תמונה ${index + 1}` : imageAlt}
                    fill
                    priority={index === 0}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    sizes="100vw"
                    className={`object-cover ${isSold ? 'grayscale opacity-60' : ''}`}
                  />

                  <div
                    className="absolute z-10 pointer-events-none"
                    style={{
                      top: '20px',
                      left: '20px',
                      width: 'clamp(72px, 9vw, 128px)'
                    }}
                  >
                    <img
                      src="/aiterra-logo.png"
                      alt="לוגו Aiterra"
                      width={112}
                      height={80}
                      loading="lazy"
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

        {/* Tap-to-zoom trigger (reliable single element, not a Swiper-cloned slide). */}
        <button
          type="button"
          onClick={() => openLightbox(activeIndex)}
          aria-label="הגדל תמונה"
          className="absolute z-30 top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm border border-white/10 hover:bg-[#354AC4] transition-colors"
        >
          <Maximize2 size={20} aria-hidden="true" />
        </button>

        {/* n / total counter pill over the main image. */}
        {hasMultiple && (
          <div className="absolute z-30 bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/50 text-white text-xs font-semibold backdrop-blur-sm pointer-events-none">
            <span dir="ltr">{activeIndex + 1} / {images.length}</span>
          </div>
        )}
      </div>

      <style jsx global>{`
        .property-slider { position: relative; }
        .property-slider .swiper-button-prev, .property-slider .swiper-button-next {
          width: 48px;
          height: 48px;
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
          background-color: #354AC4;
          border-color: #354AC4;
          transform: scale(1.1);
        }
        .property-slider .swiper-button-prev:after, .property-slider .swiper-button-next:after {
          font-size: 18px !important;
          font-weight: bold;
        }
        .property-slider .swiper-button-prev { left: 20px; }
        .property-slider .swiper-button-next { right: 20px; }
        .property-slider .swiper-pagination-bullet { background: white; opacity: 0.7; width: 8px; height: 8px; }
        .property-slider .swiper-pagination-bullet-active { background: #354AC4; opacity: 1; width: 24px; border-radius: 4px; }
        /* Dim inactive thumbnails; highlight the active one with an indigo ring. */
        .property-thumbs .swiper-slide { opacity: 0.6; transition: opacity 0.25s ease; }
        .property-thumbs .swiper-slide-thumb-active { opacity: 1; }
        .property-thumbs .swiper-slide-thumb-active .thumb-inner {
          box-shadow: 0 0 0 3px #354AC4;
        }
      `}</style>

      <Swiper
        onSwiper={setThumbsSwiper as any}
        spaceBetween={10}
        slidesPerView={4}
        watchSlidesProgress
        className="rounded-xl property-thumbs"
      >
        {images.map((image: string, index: number) => (
          <SwiperSlide key={index} className={isSold ? 'cursor-not-allowed' : 'cursor-pointer'}>
            <div className={`thumb-inner relative aspect-video rounded-lg overflow-hidden transition ${
              isSold ? 'opacity-60' : ''
            }`}>
              <Image src={image} alt={`${imageAlt} - תמונה ממוזערת ${index + 1}`} fill className={`object-cover ${isSold ? 'grayscale opacity-60' : ''}`} loading="lazy" sizes="(max-width: 768px) 25vw, 20vw" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-100 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="תצוגת תמונה מוגדלת"
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="סגור"
            className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors"
          >
            <X size={24} aria-hidden="true" />
          </button>

          <div
            className="relative w-full h-full max-w-6xl max-h-[85vh] mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={images.length > 1 ? `${imageAlt} - תמונה ${lightboxIndex + 1}` : imageAlt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {hasMultiple && (
            <>
              {/* RTL: ChevronRight = previous (on the right), ChevronLeft = next (on the left). */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
                aria-label="התמונה הקודמת"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#354AC4] transition-colors"
              >
                <ChevronRight size={28} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
                aria-label="התמונה הבאה"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#354AC4] transition-colors"
              >
                <ChevronLeft size={28} aria-hidden="true" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/60 text-white text-sm font-semibold pointer-events-none">
                <span dir="ltr">{lightboxIndex + 1} / {images.length}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
