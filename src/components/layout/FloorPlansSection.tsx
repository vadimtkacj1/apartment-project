"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import { ChevronLeft, ChevronRight, Eye, Download, X, ExternalLink, Share2, Check } from "lucide-react";
import type { Swiper as SwiperType } from "swiper";
import { copyToClipboard } from "@/lib/copy-to-clipboard";
import { analytics } from "@/lib/analytics";

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

/** Stable id of a plan, taken from its asset filename — used in shared links. */
const planSlug = (plan: FloorPlan) =>
  plan.image.split("/").pop()!.replace(/\.[^.]+$/, "");

/**
 * Link that reopens this exact plan: the query param drives the lightbox, the
 * hash lands the reader on the section even before the (lazy) chunk mounts.
 */
const planShareUrl = (plan: FloorPlan) =>
  `${window.location.origin}${window.location.pathname}?plan=${planSlug(plan)}#onethepark`;

function FloorPlansSection() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [active, setActive] = useState<FloorPlan | null>(null);
  const [mounted, setMounted] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  // Open the shared plan when arriving via a ?plan=… link. This section is
  // lazy-loaded, so the browser has long finished its own hash scroll by the
  // time we mount — scroll again once the slides exist.
  const deepLinkOpened = useRef(false);
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("plan");
    if (!slug) return;
    const shared = PLANS.find((p) => planSlug(p) === slug);
    if (!shared) return;

    // `swiper` is intentionally a dependency: it is null on the first pass and
    // the effect re-runs once the carousel registers itself, which is when the
    // slide can actually be selected.
    swiper?.slideTo(PLANS.indexOf(shared), 0);

    // Open the lightbox only on the first pass — otherwise closing it and
    // letting Swiper re-register would pop it straight back open.
    if (deepLinkOpened.current) return;
    deepLinkOpened.current = true;
    document.getElementById("onethepark")?.scrollIntoView({ behavior: "smooth" });
    setActive(shared);
  }, [swiper]);

  const handleShare = async (plan: FloorPlan, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const slug = planSlug(plan);
    const url = planShareUrl(plan);

    // On phones this opens the OS sheet (WhatsApp, Telegram, mail…), which is
    // what "share with people" means there. Desktop has no sheet — fall back to
    // copying the link.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: `תוכנית ${plan.title} — ONE THE PARK`, url });
        // The slug rides in the button id: `propertyId` is an Int column and a
        // plan has no property row behind it.
        analytics.trackButtonClick(`share-floorplan:${slug}`);
        return;
      } catch (err) {
        // AbortError = the user dismissed the sheet; anything else falls back.
        if ((err as Error)?.name === "AbortError") return;
      }
    }

    if (!(await copyToClipboard(url))) return;
    analytics.trackButtonClick(`copy-link-floorplan:${slug}`);
    setCopiedSlug(slug);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopiedSlug(null), 2000);
  };

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
      <div className="relative z-10 max-w-[81.25rem] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-4">
            <span className="text-[#1c3664] font-bold text-lg uppercase tracking-wider">
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
                <article className="group h-full flex flex-col bg-white rounded-2xl border border-[#1c3664]/10 overflow-hidden shadow-sm hover:-translate-y-1 transition-all duration-300">
                  {/* Plan preview. The share button is a sibling, not a child:
                      a <button> may not nest inside another <button>. */}
                  <div className="relative">
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
                      <span className="absolute inset-0 flex items-center justify-center bg-[#1c3664]/0 group-hover:bg-[#1c3664]/15 transition-colors duration-300">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-2 bg-white/95 text-[#1c3664] text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                          <Eye className="w-4 h-4" />
                          להגדלה
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleShare(plan, e)}
                      aria-label={
                        copiedSlug === planSlug(plan)
                          ? "הקישור הועתק ללוח"
                          : `שיתוף התוכנית — ${plan.title}, ${plan.subtitle}`
                      }
                      title={copiedSlug === planSlug(plan) ? "הקישור הועתק ללוח!" : "שיתוף התוכנית"}
                      className={`absolute top-3 left-3 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors duration-200 ${
                        copiedSlug === planSlug(plan)
                          ? "bg-[#1c3664] text-white"
                          : "bg-white/95 text-[#1c3664] hover:bg-[#1c3664] hover:text-white"
                      }`}
                    >
                      {copiedSlug === planSlug(plan) ? (
                        <Check className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Share2 className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-5 text-center">
                    <h3 className="text-2xl font-black text-[#1c3664] leading-tight">
                      {plan.title}
                    </h3>
                    <p className="text-gray-500 font-medium mt-1 mb-5">{plan.subtitle}</p>

                    {/* Buttons */}
                    <div className="mt-auto grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setActive(plan)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1c3664] text-white font-bold text-sm hover:bg-[#c5a357] hover:text-[#1c3664] transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        צפייה בתוכנית
                      </button>
                      <a
                        href={plan.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-[#1c3664]/30 text-[#1c3664] font-bold text-sm hover:border-[#c5a357] hover:text-[#c5a357] transition-colors"
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
              className="pointer-events-auto w-12 h-12 rounded-full bg-[#1c3664] text-white flex items-center justify-center shadow-xl hover:bg-[#c5a357] hover:text-[#1c3664] transition-colors"
            >
              <ChevronRight size={26} aria-hidden="true" />
            </button>
            <button
              onClick={() => swiper?.slidePrev()}
              aria-label="התוכנית הקודמת"
              className="pointer-events-auto w-12 h-12 rounded-full bg-[#1c3664] text-white flex items-center justify-center shadow-xl hover:bg-[#c5a357] hover:text-[#1c3664] transition-colors"
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
            className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#1c3664] px-8 py-4 text-base md:text-lg font-black text-white shadow-md transition-all duration-300 hover:bg-[#c5a357] hover:text-[#1c3664] hover:-translate-y-0.5"
            style={{ fontFamily: "var(--font-caramel), cursive, sans-serif" }}
          >
            <span dir="ltr">ONE THE PARK</span>
            <ExternalLink className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Lightbox — portalled to <body>: nested inside this section (which is
          `overflow-hidden`) iOS Safari paints the fixed overlay but routes taps
          past it, so the close button was dead on phones. The overlay also drops
          backdrop-filter below md for the same reason.
          z-index must clear the Sienna a11y widget (1000001), or its launcher
          floats above the overlay and covers the PDF button. */}
      {mounted && active && createPortal(
        <div
          className="fixed inset-0 z-1000002 flex flex-col items-center justify-center bg-black/90 md:bg-black/80 md:backdrop-blur-sm p-4 md:p-8"
          dir="rtl"
          role="dialog"
          aria-modal="true"
          aria-label={`תוכנית ${active.title}`}
          onClick={closeLightbox}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <button
            type="button"
            onClick={closeLightbox}
            onPointerUp={closeLightbox}
            aria-label="סגירה"
            className="absolute top-4 left-4 z-10 w-12 h-12 rounded-full bg-white/95 text-[#1c3664] flex items-center justify-center shadow-lg hover:bg-[#c5a357] transition-colors"
            style={{ touchAction: "manipulation" }}
          >
            <X size={24} aria-hidden="true" />
          </button>

          {/* The wrapper fills the viewport, so it must stay click-through:
              only the image itself swallows the tap, everything around it closes. */}
          <div className="relative w-full max-w-5xl max-h-[78vh] flex-1 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.image}
              alt={`תוכנית ${active.title}, ${active.subtitle} — ONE THE PARK חולון`}
              className="max-w-full max-h-[78vh] object-contain rounded-lg bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div
            className="mt-5 flex flex-col items-center gap-3 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white font-bold text-lg">
              {active.title} <span className="text-white/60 font-normal">· {active.subtitle}</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={active.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c5a357] text-[#1c3664] font-bold text-sm hover:bg-white transition-colors"
                style={{ touchAction: "manipulation" }}
              >
                <Download className="w-4 h-4" />
                הורדה / פתיחה (PDF באיכות מלאה)
              </a>
              <button
                type="button"
                onClick={(e) => handleShare(active, e)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/95 text-[#1c3664] font-bold text-sm hover:bg-[#c5a357] transition-colors"
                style={{ touchAction: "manipulation" }}
              >
                {copiedSlug === planSlug(active) ? (
                  <>
                    <Check className="w-4 h-4" aria-hidden="true" />
                    הקישור הועתק!
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" aria-hidden="true" />
                    שיתוף התוכנית
                  </>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
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
          background: #1c3664;
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
}

export default FloorPlansSection;
