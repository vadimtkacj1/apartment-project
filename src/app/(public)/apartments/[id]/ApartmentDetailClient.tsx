"use client";
import dynamic from 'next/dynamic';
import { m } from 'framer-motion';
import { ArrowLeft, Share2, Check, Phone, MapPin, LayoutDashboard, ArrowUpFromLine, Maximize } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SimilarProperties from '@/components/properties/SimilarProperties';
import { PropertyGallery } from '@/components/apartment-detail/PropertyGallery';
import { formatShekelPrice } from '@/components/apartment-detail/PriceCard';
import { analytics } from '@/lib/analytics';
import { usePropertyData } from '@/hooks/usePropertyData';
import {
  LoadingState,
  ErrorState,
  PropertyAgentBlock,
  PropertyDescription,
  PropertyAmenities,
  PropertySpecs,
  PriceCard,
  ContactForm,
  PropertyNavigation
} from '@/components/apartment-detail';

// PropertyGallery is imported STATICALLY (not next/dynamic): it holds the LCP
// hero image, and a dynamic import puts it behind a Suspense boundary whose
// content streams in a later chunk — on slow mobile the LCP image then can't
// paint until that segment arrives, adding seconds. Static keeps the first
// image in the immediate SSR shell. Swiper ships in this route's JS as a result,
// which is fine (TBT has headroom); only the LCP image must be in the shell.
const PropertyMap = dynamic(
  () => import('@/components/apartment-detail/PropertyMap').then(m => ({ default: m.PropertyMap })),
  {
    ssr: false,
    loading: () => <div className="h-[450px] bg-gray-100 rounded-2xl animate-pulse mb-8" />,
  }
);

interface ApartmentDetailClientProps {
  propertyId: string;
  /** Full property in /api/properties/[id] response shape, fetched server-side */
  initialProperty?: any;
  initialTitle?: string;
  initialDescription?: string;
}

function formatWhatsAppNumber(num: string): string {
  const digits = num.replace(/\D/g, '');
  if (digits.startsWith('972')) return digits;
  if (digits.startsWith('0')) return '972' + digits.slice(1);
  return '972' + digits;
}

export default function ApartmentDetailClient({ propertyId, initialProperty, initialTitle, initialDescription }: ApartmentDetailClientProps) {
  const { property, loading, error } = usePropertyData(propertyId, initialProperty);
  const [previousId, setPreviousId] = useState<number | null>(null);
  const [nextId, setNextId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Mount the Google Map (and its ~190KB Maps API) only when the user scrolls
  // near it instead of on page load. Explicit observer (not useInView) because
  // the target div mounts only after `property` is available.
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapNearViewport, setMapNearViewport] = useState(false);

  // 'צור קשר' in the mobile sticky bar scrolls the lead form into view.
  const leadFormRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () =>
    leadFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const handleShare = async () => {
    const url = window.location.href;
    if (typeof navigator.share === 'function') {
      // Native share sheet — no "copied" confirmation needed. Rejection also
      // covers the user simply dismissing the sheet (AbortError).
      try {
        await navigator.share({ title: displayTitle || document.title, url });
      } catch {
        /* user cancelled or share failed — nothing to clean up */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable (permissions / insecure context) — keep label as-is */
    }
  };

  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el || mapNearViewport) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setMapNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [property, mapNearViewport]);

  useEffect(() => {
    const fetchNeighbors = async () => {
      try {
        const response = await fetch(`/api/properties/${propertyId}/neighbors`);
        if (!response.ok) return;
        const { previousId: prev, nextId: next } = await response.json();
        setPreviousId(prev);
        setNextId(next);
      } catch (err) {
        console.error('Error fetching property neighbors:', err);
      }
    };
    if (propertyId) fetchNeighbors();
  }, [propertyId]);

  const isSold = property?.isSold || false;
  // Prefer the SSR-composed intent title ("דירה 3 חד׳ למכירה ב…") over the raw admin
  // title (a bare street address) so the H1, JSON-LD name and gallery alt lead with
  // the keywords buyers actually search.
  const displayTitle = initialTitle || property?.title?.trim() || property?.location || '';

  // Primary contact for the mobile sticky CTAs and the price-card call button
  // (the full list lives in PropertyAgentBlock / the lead form).
  const contacts = [...(property?.owners ?? []), ...(property?.agents ?? [])];
  const primaryContact = contacts.find((o: any) => o.whatsapp || o.phone);
  const stickyWhatsappLink = primaryContact
    ? `https://wa.me/${formatWhatsAppNumber(primaryContact.whatsapp || primaryContact.phone || '')}`
    : null;
  const primaryPhone: string | undefined = contacts.find((o: any) => o.phone)?.phone;
  const telHref = primaryPhone ? `tel:${primaryPhone.replace(/\D/g, '')}` : null;
  const showStickyBar = !!property && !isSold;

  return (
    <div className={`min-h-screen bg-warm pt-24 relative ${showStickyBar ? 'pb-28 lg:pb-16' : 'pb-16'}`} dir="rtl">
      <div className="w-full">
        <Breadcrumbs labels={property ? { [String(property.id)]: property.title?.trim() || displayTitle } : undefined} />
        <div className="w-full px-6 flex justify-between items-center mb-4 lg:px-12">
          <button
            onClick={handleShare}
            aria-live="polite"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#354AC4] text-[#354AC4] hover:bg-[#354AC4] hover:text-white transition-all duration-200 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#354AC4] focus-visible:ring-offset-2"
          >
            {copied ? (
              <>
                <Check size={16} aria-hidden="true" />
                <span>הקישור הועתק!</span>
              </>
            ) : (
              <>
                <Share2 size={16} aria-hidden="true" />
                <span>שתף נכס</span>
              </>
            )}
          </button>
          <Link
            href="/apartments"
            className="group inline-flex items-center gap-2 text-gray-600 hover:text-[#354AC4] transition-colors duration-300 font-bold text-lg"
          >
            <span>חזרה לנכסים</span>
            <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>

        {displayTitle && (
          <h1 className="w-full px-6 lg:px-12 text-3xl md:text-4xl font-black text-[#051150] mb-3 text-start" dir="rtl">
            {displayTitle}
          </h1>
        )}

        {/* Key facts under the H1: location · rooms · floor · area. */}
        {property && (
          <div className="w-full px-6 lg:px-12 mb-6 flex flex-wrap items-center gap-3 text-sm font-medium text-[#475569]">
            {property.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} className="shrink-0 text-[#64748B]" aria-hidden="true" />
                {property.location}
              </span>
            )}
            {!!property.bedrooms && (
              <span className="inline-flex items-center gap-1.5">
                <LayoutDashboard size={14} className="shrink-0 text-[#64748B]" aria-hidden="true" />
                {property.bedrooms} חדרים
              </span>
            )}
            {property.floor !== null && property.floor !== undefined && (
              <span className="inline-flex items-center gap-1.5">
                <ArrowUpFromLine size={14} className="shrink-0 text-[#64748B]" aria-hidden="true" />
                {property.floor === 0 ? 'קומת קרקע' : `קומה ${property.floor}`}
              </span>
            )}
            {!!property.area && (
              <span className="inline-flex items-center gap-1.5">
                <Maximize size={14} className="shrink-0 text-[#64748B]" aria-hidden="true" />
                {property.area} מ״ר
              </span>
            )}
          </div>
        )}

        {/* Compact price line directly under the H1 on mobile — only when the
            sticky bar (which already shows the price) is absent, i.e. sold
            properties. Keeps exactly one price above the fold on mobile. */}
        {property && !showStickyBar && (
          <div className="w-full px-6 lg:px-12 mb-6 lg:hidden text-start">
            <span className="text-sm font-semibold text-gray-500 me-2">מחיר מבוקש:</span>
            <span
              dir="ltr"
              className={`text-2xl font-black text-[#354AC4] ${isSold ? 'line-through' : ''}`}
            >
              {formatShekelPrice(property.price)} ₪
            </span>
          </div>
        )}

        {!property && initialDescription && (
          <p className="w-full px-6 lg:px-12 text-gray-700 leading-relaxed mb-6 text-right" dir="rtl">
            {initialDescription}
          </p>
        )}

        {loading && !property ? (
          <LoadingState />
        ) : !property ? (
          <ErrorState error={error || undefined} />
        ) : (
          <>
            <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:px-12">
              <div className="lg:col-span-2">
                <div className="-mx-6 lg:mx-0">
                  <PropertyGallery images={property.images} isSold={isSold} dealType={property.dealType} propertyTitle={displayTitle} />
                </div>
                {((property.owners && property.owners.length > 0) || (property.agents && property.agents.length > 0)) && (
                  <div className="px-6 mb-6">
                    <PropertyAgentBlock
                      agents={[...(property.owners ?? []), ...(property.agents ?? [])]}
                      isSold={isSold}
                      propertyId={propertyId}
                    />
                  </div>
                )}
                <div className="px-6">
                  <PropertyDescription
                    description={property.description}
                    bedrooms={property.bedrooms}
                    floor={property.floor}
                    totalFloors={property.totalFloors}
                    area={property.area}
                    builtArea={property.builtArea}
                    isSold={isSold}
                  />
                  <PropertyAmenities amenities={property.amenities} isSold={isSold} />
                  <PropertySpecs specs={property.specs} isSold={isSold} />
                  {typeof property.latitude === 'number' && typeof property.longitude === 'number' ? (
                    <div ref={mapContainerRef}>
                      {mapNearViewport ? (
                        <PropertyMap
                          isSold={isSold}
                          latitude={property.latitude}
                          longitude={property.longitude}
                          location={property.location}
                        />
                      ) : (
                        <div className="h-[450px] bg-gray-100 rounded-2xl animate-pulse mb-8" />
                      )}
                    </div>
                  ) : property.location ? (
                    /* No coordinates: skip the Maps API entirely — plain location card
                       instead of a map centered on a default city. */
                    <div className={`rounded-2xl p-8 mb-8 shadow-lg border ${
                      isSold ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-100'
                    }`}>
                      <h2 className={`text-2xl font-black mb-4 ${
                        isSold ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>מיקום</h2>
                      <div className="flex items-center gap-2 text-base font-semibold text-[#475569]">
                        <MapPin size={18} className="shrink-0 text-[#354AC4]" aria-hidden="true" />
                        <span>{property.location}</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="lg:col-span-1 px-6">
                <m.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="sticky top-24"
                >
                  <PriceCard
                    price={property.price}
                    originalPrice={property.originalPrice}
                    area={property.area}
                    isSold={isSold}
                    dealType={property.dealType}
                    phone={primaryPhone}
                    propertyId={propertyId}
                  />
                  <div ref={leadFormRef} id="lead-form" className="scroll-mt-28">
                    <ContactForm
                      propertyId={propertyId}
                      isSold={isSold}
                      owners={property.owners ?? []}
                      dealType={property.dealType}
                    />
                  </div>
                </m.div>
              </div>
            </div>

            {/* Prev/next lives below the content: the neighbor IDs arrive async, and
                rendering the row here (instead of above the H1) keeps the late pop-in
                out of the initial viewport — no CLS at the top of the page. */}
            {(previousId || nextId) && (
              <div className="w-full px-6 lg:px-12 mt-10">
                <PropertyNavigation previousId={previousId} nextId={nextId} isSold={isSold} />
              </div>
            )}

            <SimilarProperties currentPropertyId={property.id} limit={3} />
          </>
        )}
      </div>

      {/* Mobile sticky action bar: price + צור קשר + WhatsApp. Keeps the primary
          conversion actions reachable while the lead rail sits far below on mobile. */}
      {showStickyBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden bg-white/95 backdrop-blur border-t border-[#E4E8F2] shadow-[0_-4px_20px_rgba(5,17,80,0.12)] px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center gap-2">
          <div className="min-w-0 shrink">
            <div className="text-[11px] font-semibold text-gray-500 leading-none mb-1">מחיר מבוקש</div>
            <div dir="ltr" className="text-lg font-black text-[#051150] truncate text-start">
              {formatShekelPrice(property!.price)} ₪
            </div>
          </div>
          {stickyWhatsappLink && (
            <a
              href={stickyWhatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analytics.trackWhatsAppClick(propertyId)}
              aria-label="WhatsApp"
              className="inline-flex items-center justify-center w-12 h-12 shrink-0 rounded-xl bg-[#25D366] text-white shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
            >
              <FaWhatsapp size={24} aria-hidden="true" />
            </a>
          )}
          {telHref && (
            <a
              href={telHref}
              onClick={() => analytics.trackPhoneClick(propertyId)}
              aria-label="התקשרו אלינו"
              className="inline-flex flex-1 basis-0 items-center justify-center gap-1.5 h-12 min-w-0 rounded-xl border border-[#354AC4] bg-white text-[#354AC4] font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#354AC4] focus-visible:ring-offset-2"
            >
              <Phone size={18} aria-hidden="true" />
              <span>התקשרו</span>
            </a>
          )}
          <button
            type="button"
            onClick={scrollToForm}
            className="inline-flex flex-1 basis-0 items-center justify-center h-12 min-w-0 rounded-xl bg-[#354AC4] text-white font-black shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#354AC4] focus-visible:ring-offset-2"
          >
            צור קשר
          </button>
        </div>
      )}
    </div>
  );
}
