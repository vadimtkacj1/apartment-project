"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import { ChevronLeft, ChevronRight, Eye, Download, X, ExternalLink } from "lucide-react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/pagination";

interface FloorPlan {
  title: string;
  subtitle: string;
  image: string;
  pdf: string;
}

// ONE THE PARK · דוד אלעזר 27, חולון — apartment & commercial plans.
// Assets are self-hosted under /public/plans/onethepark (image preview + full PDF).

// Official ONE THE PARK project landing page (Shosh Ltd, the developer).
const ONE_THE_PARK_URL = "https://shosh-ltd.co.il/lp/onethepark";

const PLANS: FloorPlan[] = [
  { title: "דירת 3 חדרים", subtitle: "קומות 1–5", image: "/plans/onethepark/apartment-3-floors-1-5.jpg", pdf: "/plans/onethepark/apartment-3-floors-1-5.pdf" },
  { title: "דירת 4 חדרים", subtitle: "קומות 1–5", image: "/plans/onethepark/apartment-4-floors-1-5.jpg", pdf: "/plans/onethepark/apartment-4-floors-1-5.pdf" },
  { title: "דירת 5 חדרים", subtitle: "קומות 1–5", image: "/plans/onethepark/apartment-5-floors-1-5.jpg", pdf: "/plans/onethepark/apartment-5-floors-1-5.pdf" },
  { title: "דירת 2.5 חדרים", subtitle: "קומות 1–8", image: "/plans/onethepark/apartment-2-5-floors-1-8.jpg", pdf: "/plans/onethepark/apartment-2-5-floors-1-8.pdf" },
  { title: "דירת 4 חדרים", subtitle: "קומות 6–7", image: "/plans/onethepark/apartment-24-28-floors-6-7.jpg", pdf: "/plans/onethepark/apartment-24-28-floors-6-7.pdf" },
  { title: "דירת 3 חדרים", subtitle: "קומה 8", image: "/plans/onethepark/apartment-30-floor-8.jpg", pdf: "/plans/onethepark/apartment-30-floor-8.pdf" },
  { title: "מיני פנטהאוז 5 חדרים", subtitle: "קומה 8", image: "/plans/onethepark/apartment-31-floor-8.jpg", pdf: "/plans/onethepark/apartment-31-floor-8.pdf" },
  { title: "דירת 2.5 חדרים", subtitle: "קומה 9", image: "/plans/onethepark/apartment-32-floor-9.jpg", pdf: "/plans/onethepark/apartment-32-floor-9.pdf" },
  { title: "פנטהאוז 5 חדרים", subtitle: "קומה 9", image: "/plans/onethepark/apartment-33-floor-9.jpg", pdf: "/plans/onethepark/apartment-33-floor-9.pdf" },
  { title: "מסחר", subtitle: "קומת קרקע", image: "/plans/onethepark/commerce-ground-floor.jpg", pdf: "/plans/onethepark/commerce-ground-floor.pdf" },
];

function FloorPlansSection() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [active, setActive] = useState<FloorPlan | null>(null);

  // Close the lightbox on Escape and lock body scroll while it is open.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active]);

  const closeLightbox = useCallback(() => setActive(null), []);

  return (
    <section id="onethepark" className="relative w-full py-16 md:py-20 overflow-hidden bg-warm scroll-mt-24" dir="rtl">
      <div className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-4">
            <span className="text-[#051150] font-bold text-lg uppercase tracking-wider">
              תוכניות הפרויקט
            </span>
          </div>
          <h2
            className="text-5xl md:text-6xl font-black text-gray-900 mb-5 uppercase tracking-tight"
            style={{ fontFamily: "var(--font-caramel), cursive, sans-serif" }}
          >
            תוכניות הדירות והמסחר
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mt-6">
            צפו בתוכניות ישירות מהאתר, או הורידו אותן לעיון נוח בכל עת.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={24}
            slidesPerView={1.1}
            grabCursor
            onSwiper={setSwiper}
            breakpoints={{
              640: { slidesPerView: 1.6 },
              1024: { slidesPerView: 2 },
            }}
            pagination={{
              clickable: true,
              el: ".plan-pagination",
              bulletClass: "plan-bullet",
              bulletActiveClass: "plan-bullet-active",
            }}
            className="!pb-2"
          >
            {PLANS.map((plan, i) => (
              <SwiperSlide key={`${plan.image}-${i}`} className="!h-auto">
                <article className="group h-full flex flex-col bg-white rounded-2xl border border-[#051150]/10 overflow-hidden shadow-sm hover:-translate-y-1 transition-all duration-300">
                  {/* Plan preview */}
                  <button
                    type="button"
                    onClick={() => setActive(plan)}
                    aria-label={`צפייה בתוכנית — ${plan.title}, ${plan.subtitle}`}
                    className="relative block w-full h-64 md:h-72 bg-[#f5f1ea] cursor-zoom-in"
                  >
                    <Image
                      src={plan.image}
                      alt={`תוכנית ${plan.title}, ${plan.subtitle} — ONE THE PARK חולון`}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 55vw, 620px"
                      className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                      quality={85}
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-[#354ac4]/0 group-hover:bg-[#354ac4]/15 transition-colors duration-300">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-2 bg-white/95 text-[#354ac4] text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                        <Eye className="w-4 h-4" />
                        להגדלה
                      </span>
                    </span>
                  </button>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-5 text-center">
                    <h3 className="text-2xl font-black text-[#051150] leading-tight">
                      {plan.title}
                    </h3>
                    <p className="text-gray-500 font-medium mt-1 mb-5">{plan.subtitle}</p>

                    {/* Buttons */}
                    <div className="mt-auto grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setActive(plan)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#354ac4] text-white font-bold text-sm hover:bg-[#5594f1] hover:text-[#051150] transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        צפייה בתוכנית
                      </button>
                      <a
                        href={plan.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-[#354ac4]/30 text-[#354ac4] font-bold text-sm hover:border-[#5594f1] hover:text-[#2a69c4] transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        הורדה / פתיחה
                      </a>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation arrows (desktop) — vertically centered on the plan image */}
          <div className="hidden md:flex absolute top-[150px] -translate-y-1/2 left-0 right-0 z-30 pointer-events-none justify-between px-1">
            <button
              onClick={() => swiper?.slideNext()}
              aria-label="התוכנית הבאה"
              className="pointer-events-auto w-12 h-12 rounded-full bg-[#354ac4] text-white flex items-center justify-center shadow-xl hover:bg-[#5594f1] hover:text-[#051150] transition-colors"
            >
              <ChevronRight size={26} aria-hidden="true" />
            </button>
            <button
              onClick={() => swiper?.slidePrev()}
              aria-label="התוכנית הקודמת"
              className="pointer-events-auto w-12 h-12 rounded-full bg-[#354ac4] text-white flex items-center justify-center shadow-xl hover:bg-[#5594f1] hover:text-[#051150] transition-colors"
            >
              <ChevronLeft size={26} aria-hidden="true" />
            </button>
          </div>

          <div className="plan-pagination flex items-center justify-center gap-2 mt-8" />
        </div>

        {/* CTA — through to the full ONE THE PARK project page */}
        <div className="mt-10 md:mt-12 flex justify-center">
          <a
            href={ONE_THE_PARK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#354ac4] px-8 py-4 text-base md:text-lg font-black text-white shadow-md transition-all duration-300 hover:bg-[#5594f1] hover:text-[#051150] hover:-translate-y-0.5"
            style={{ fontFamily: "var(--font-caramel), cursive, sans-serif" }}
          >
            <span dir="ltr">ONE THE PARK</span>
            <ExternalLink className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-[3000] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
          dir="rtl"
          role="dialog"
          aria-modal="true"
          aria-label={`תוכנית ${active.title}`}
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="סגירה"
            className="absolute top-4 left-4 w-11 h-11 rounded-full bg-white/90 text-[#051150] flex items-center justify-center shadow-lg hover:bg-[#5594f1] transition-colors"
          >
            <X size={24} />
          </button>

          <div
            className="relative w-full max-w-5xl max-h-[78vh] flex-1 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.image}
              alt={`תוכנית ${active.title}, ${active.subtitle} — ONE THE PARK חולון`}
              className="max-w-full max-h-[78vh] object-contain rounded-lg bg-white shadow-2xl"
            />
          </div>

          <div
            className="mt-5 flex flex-col items-center gap-3 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white font-bold text-lg">
              {active.title} <span className="text-white/60 font-normal">· {active.subtitle}</span>
            </p>
            <a
              href={active.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#5594f1] text-[#051150] font-bold text-sm hover:bg-white transition-colors"
            >
              <Download className="w-4 h-4" />
              הורדה / פתיחה (PDF באיכות מלאה)
            </a>
          </div>
        </div>
      )}

      <style jsx global>{`
        .plan-bullet {
          width: 8px;
          height: 8px;
          background: #d1c7b3;
          border-radius: 50%;
          transition: all 0.4s ease;
          cursor: pointer;
        }
        .plan-bullet-active {
          width: 30px;
          background: #354ac4;
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
}

export default FloorPlansSection;
