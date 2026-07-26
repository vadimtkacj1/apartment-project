import { useState, useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import { Maximize2, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { DealType } from '@/types/property.types';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

import 'swiper/css';
import 'swiper/css/navigation';
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
  const [lightboxLoading, setLightboxLoading] = useState(false);
  const hasMultiple = images.length > 1;
  const prefersReducedMotion = usePrefersReducedMotion();

  // Focus trap plumbing: focus the close button on open, return focus on close.
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const prevBtnRef = useRef<HTMLButtonElement | null>(null);
  const nextBtnRef = useRef<HTMLButtonElement | null>(null);
  // Lightbox swipe tracking (pointer events, ~40px threshold).
  const swipeStartXRef = useRef<number | null>(null);
  const suppressCloseRef = useRef(false);

  const openLightbox = (index: number) => {
    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setLightboxIndex(index);
    setLightboxLoading(true);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  // RTL chevron mapping: ChevronRight = previous, ChevronLeft = next.
  const prevLightbox = () => {
    setLightboxLoading(true);
    setLightboxIndex((i) => (i - 1 + images.length) % images.length);
  };
  const nextLightbox = () => {
    setLightboxLoading(true);
    setLightboxIndex((i) => (i + 1) % images.length);
  };

  const onLightboxPointerDown = (e: ReactPointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    swipeStartXRef.current = e.clientX;
  };
  const onLightboxPointerUp = (e: ReactPointerEvent) => {
    const startX = swipeStartXRef.current;
    swipeStartXRef.current = null;
    if (startX === null || !hasMultiple) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) < 40) return;
    // A swipe should never double as the backdrop-close click.
    suppressCloseRef.current = true;
    // Match the chevrons: motion toward the right = previous, toward the left = next.
    if (dx > 0) prevLightbox();
    else nextLightbox();
  };

  // Lock body scroll + wire keyboard (Escape / arrows / Tab trap) while the lightbox is open.
  useEffect(() => {
    if (!lightboxOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
        return;
      }
      // RTL mapping, same as the chevrons: right = previous, left = next.
      if (e.key === 'ArrowRight') {
        prevLightbox();
        return;
      }
      if (e.key === 'ArrowLeft') {
        nextLightbox();
        return;
      }
      if (e.key === 'Tab') {
        const focusables = [closeBtnRef.current, prevBtnRef.current, nextBtnRef.current].filter(
          (el): el is HTMLButtonElement => el !== null
        );
        if (focusables.length === 0) return;
        e.preventDefault();
        const idx = focusables.indexOf(document.activeElement as HTMLButtonElement);
        const next = e.shiftKey
          ? idx <= 0
            ? focusables.length - 1
            : idx - 1
          : idx === -1 || idx === focusables.length - 1
            ? 0
            : idx + 1;
        focusables[next].focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      triggerRef.current?.focus();
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
          modules={[Navigation, Thumbs]}
          navigation
          loop={true}
          speed={prefersReducedMotion ? 0 : 800}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          // Open the lightbox on a genuine tap only — Swiper clears allowClick during
          // a drag, and clickedIndex is undefined when the click landed on chrome
          // (e.g. the nav arrows) rather than a slide.
          onClick={(swiper) => {
            // allowClick exists at runtime but is missing from Swiper's TS types.
            const allowClick = (swiper as unknown as { allowClick?: boolean }).allowClick;
            if (allowClick === false || typeof swiper.clickedIndex !== 'number') return;
            openLightbox(swiper.realIndex);
          }}
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
              <div className="relative w-full h-full flex items-center justify-center bg-black/5 cursor-zoom-in">
                <div className="relative w-full h-full">
                  <Image
                    src={image}
                    alt={images.length > 1 ? `${imageAlt} - תמונה ${index + 1}` : imageAlt}
                    fill
                    priority={index === 0}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    sizes="(min-width:1024px) 66vw, 100vw"
                    className={`object-cover ${isSold ? 'grayscale opacity-60' : ''}`}
                  />

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

        {/* Watermark rendered once over the slider (not duplicated into every slide). */}
        <div
          className="absolute z-30 pointer-events-none"
          style={{
            top: '20px',
            left: '20px',
            width: 'clamp(72px, 9vw, 128px)'
          }}
        >
          <img
            src="/aiterra-white-logo.png"
            alt="לוגו Aiterra"
            width={160}
            height={56}
            loading="lazy"
            className="w-full h-auto drop-shadow-2xl"
          />
        </div>

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
        // Fractional counts leave a cut thumb at the edge, hinting the strip scrolls.
        slidesPerView={4.5}
        breakpoints={{ 768: { slidesPerView: 5.5 } }}
        watchSlidesProgress
        className="rounded-xl property-thumbs"
      >
        {images.map((image: string, index: number) => (
          <SwiperSlide key={index} className="cursor-pointer">
            <button
              type="button"
              aria-label={`תמונה ${index + 1}`}
              className="block w-full cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#354AC4] focus-visible:ring-offset-2"
            >
              <div className={`thumb-inner relative aspect-video rounded-lg overflow-hidden transition ${
                isSold ? 'opacity-60' : ''
              }`}>
                <Image src={image} alt={`${imageAlt} - תמונה ממוזערת ${index + 1}`} fill className={`object-cover ${isSold ? 'grayscale opacity-60' : ''}`} loading="lazy" sizes="(max-width: 768px) 25vw, 20vw" />
              </div>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-100 bg-black/90 flex items-center justify-center select-none touch-pan-y"
          onClick={() => {
            // A horizontal swipe ends with a click on the backdrop — don't treat it as close.
            if (suppressCloseRef.current) {
              suppressCloseRef.current = false;
              return;
            }
            closeLightbox();
          }}
          onPointerDown={onLightboxPointerDown}
          onPointerUp={onLightboxPointerUp}
          onPointerCancel={() => { swipeStartXRef.current = null; }}
          role="dialog"
          aria-modal="true"
          aria-label="תצוגת תמונה מוגדלת"
        >
          <button
            type="button"
            ref={closeBtnRef}
            onClick={closeLightbox}
            aria-label="סגור"
            className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5594F1]"
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
              onLoad={() => setLightboxLoading(false)}
            />
            {lightboxLoading && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                <div className="w-10 h-10 rounded-full border-2 border-white/25 border-t-white motion-safe:animate-spin" />
              </div>
            )}
          </div>

          {hasMultiple && (
            <>
              {/* RTL: ChevronRight = previous (on the right), ChevronLeft = next (on the left). */}
              <button
                type="button"
                ref={prevBtnRef}
                onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
                aria-label="התמונה הקודמת"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#354AC4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5594F1]"
              >
                <ChevronRight size={28} aria-hidden="true" />
              </button>
              <button
                type="button"
                ref={nextBtnRef}
                onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
                aria-label="התמונה הבאה"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#354AC4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5594F1]"
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
