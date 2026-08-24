import { useRef, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import { DealType } from '@/types/property.types';
import { isVideoUrl, videoMimeType } from '@/lib/media';

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
  const mainSwiperRef = useRef<SwiperClass | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const pauseAllVideos = () => {
    galleryRef.current?.querySelectorAll('video').forEach((video) => video.pause());
  };

  const stopAutoplay = () => {
    mainSwiperRef.current?.autoplay?.stop();
  };

  const holdOnVideoSlide = (swiper: SwiperClass) => {
    const activeSlide = swiper.slides?.[swiper.activeIndex];
    if (activeSlide?.querySelector('video')) swiper.autoplay?.stop();
  };

  const handleSlideChange = (swiper: SwiperClass) => {
    pauseAllVideos();
    setPlayingIndex(null);
    holdOnVideoSlide(swiper);
  };

  return (
    // No entrance animation on the gallery wrapper: it holds the LCP image, and an
    // initial opacity:0 (rendered into the SSR HTML by framer-motion) prevents the
    // image from counting as "contentful" until the client hydrates + the fade runs,
    // pushing LCP out by seconds on slow mobile. The hero now paints as soon as it loads.
    <div className="mb-8" ref={galleryRef}>
      <Swiper
        modules={[Navigation, Pagination, Thumbs, Autoplay]}
        onSwiper={(swiper) => { mainSwiperRef.current = swiper; holdOnVideoSlide(swiper); }}
        onSlideChange={handleSlideChange}
        navigation
        pagination={{ clickable: true }}
        autoplay={isSold ? false : { delay: 3000, disableOnInteraction: false }}
        loop={true}
        speed={800}
        thumbs={{ swiper: thumbsSwiper && !(thumbsSwiper as any).destroyed ? thumbsSwiper : null }}
        // Responsive height instead of a flat 85vh: on a portrait phone 85vh is a
        // ~720px box and an `object-contain` landscape photo only fills ~220px of
        // it, leaving huge empty bands above/below (the "broken" look under the
        // header). A width-proportional height keeps the frame photo-shaped.
        className={`overflow-hidden mb-4 property-slider h-75 sm:h-110 md:h-140 lg:h-[78vh] ${isSold ? 'grayscale opacity-60' : ''}`}
        dir="ltr"
      >
        {images.map((image: string, index: number) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full flex items-center justify-center bg-black/5">
              <div className="relative w-full h-full">
                {isVideoUrl(image) ? (
                  <>
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      onPlay={() => { stopAutoplay(); setPlayingIndex(index); }}
                      onPause={() => setPlayingIndex((current) => (current === index ? null : current))}
                      aria-label={`${imageAlt} - סרטון`}
                      className={`swiper-no-swiping w-full h-full object-contain bg-black ${isSold ? 'grayscale opacity-60' : ''}`}
                    >
                      <source src={`${image}#t=0.1`} type={videoMimeType(image)} />
                    </video>
                    {playingIndex !== index && (
                      <button
                        type="button"
                        aria-label="נגן סרטון"
                        onClick={(event) => {
                          stopAutoplay();
                          const video = event.currentTarget.parentElement?.querySelector('video');
                          video?.play().catch(() => undefined);
                        }}
                        className="swiper-no-swiping absolute inset-0 z-20 flex items-center justify-center bg-black/25 transition-colors hover:bg-black/35"
                        style={{ bottom: '60px' }}
                      >
                        <span className="flex flex-col items-center gap-2">
                          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-xl sm:h-20 sm:w-20">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-[#1c3664] sm:h-10 sm:w-10">
                              <path d="M8.5 5.6a.8.8 0 0 1 1.2-.7l8.2 5.4a.8.8 0 0 1 0 1.4l-8.2 5.4a.8.8 0 0 1-1.2-.7V5.6z" />
                            </svg>
                          </span>
                          <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white sm:text-sm">
                            סרטון הנכס
                          </span>
                        </span>
                      </button>
                    )}
                  </>
                ) : (
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
                )}
                
                <div 
                  className="absolute z-10 pointer-events-none" 
                  style={{ 
                    top: '20px', 
                    left: '20px',
                    width: 'clamp(100px, 12vw, 180px)' 
                  }}
                >
                  <img
                    src="/watermark.webp"
                    alt="לוגו רם נכסים חיים ענבי"
                    width={512}
                    height={267}
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
              {isVideoUrl(image) ? (
                <>
                  <video src={image} muted playsInline preload="metadata" className={`w-full h-full object-cover bg-black ${isSold ? 'grayscale opacity-60' : ''}`} />
                  <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-8 h-8 fill-white/90 drop-shadow-lg">
                      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.5 6.2 5 3.3a.6.6 0 0 1 0 1l-5 3.3a.6.6 0 0 1-.9-.5V8.7a.6.6 0 0 1 .9-.5z" />
                    </svg>
                  </span>
                </>
              ) : (
                <Image src={image} alt={`${imageAlt} - תמונה ממוזערת ${index + 1}`} fill className={`object-contain ${isSold ? 'grayscale opacity-60' : ''}`} loading="lazy" sizes="(max-width: 768px) 25vw, 20vw" />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}