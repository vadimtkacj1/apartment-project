"use client";
import dynamic from 'next/dynamic';
import { m } from 'framer-motion';
import { ArrowLeft, Share2, Check } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import SimilarProperties from '@/components/properties/SimilarProperties';
import { PropertyGallery } from '@/components/apartment-detail/PropertyGallery';
import { usePropertyData } from '@/hooks/usePropertyData';
import { shareOrCopy, propertyShareUrl } from '@/lib/copy-to-clipboard';
import { analytics } from '@/lib/analytics';
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

  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  const handleShare = async () => {
    const url = propertyShareUrl(propertyId);
    const result = await shareOrCopy(displayTitle || 'נכס', url);

    if (result === 'shared') {
      analytics.trackButtonClick('share-property', propertyId);
      return;
    }
    if (result !== 'copied') return;

    analytics.trackButtonClick('copy-link-property', propertyId);
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2000);
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

  return (
    <div className="min-h-screen bg-warm pt-24 pb-16 relative" dir="rtl">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: copied ? 1 : 0, y: copied ? 0 : 20 }}
        transition={{ duration: 0.25 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      >
        <div className="flex items-center gap-2 bg-[#1c3664] text-white px-5 py-3 rounded-full shadow-lg text-sm font-medium">
          <Check size={16} />
          <span>הקישור הועתק ללוח!</span>
        </div>
      </m.div>
      <div className="w-full">
        <div className="w-full px-6 flex justify-between items-center mb-4 lg:px-12">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#1c3664] text-[#1c3664] hover:bg-[#1c3664] hover:text-white transition-all duration-200 text-sm font-medium"
          >
            {copied ? (
              <>
                <Check size={16} />
                <span>הקישור הועתק!</span>
              </>
            ) : (
              <>
                <Share2 size={16} />
                <span>שתף נכס</span>
              </>
            )}
          </button>
          <Link
            href="/apartments"
            className="group inline-flex items-center gap-2 text-gray-600 hover:text-[#1c3664] transition-colors duration-300 font-bold text-lg"
          >
            <span>חזרה לנכסים</span>
            <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {property && (
          <div className="w-full px-6 lg:px-12">
            <PropertyNavigation previousId={previousId} nextId={nextId} isSold={false} />
          </div>
        )}

        {displayTitle && (
          <h1 className="w-full px-6 lg:px-12 text-2xl md:text-3xl font-bold text-[#1c3664] mb-6 text-center md:text-right" dir="rtl">
            {displayTitle}
          </h1>
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
                </div>
              </div>

              <div className="lg:col-span-1 px-6">
                <m.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="top-24 lg:[@media(min-height:1150px)]:sticky"
                >
                  <PriceCard
                    price={property.price}
                    originalPrice={property.originalPrice}
                    isSold={isSold}
                    dealType={property.dealType}
                  />
                  <ContactForm
                    propertyId={propertyId}
                    isSold={isSold}
                    owners={property.owners ?? []}
                    dealType={property.dealType}
                  />
                </m.div>
              </div>
            </div>

            <SimilarProperties currentPropertyId={property.id} limit={3} />
          </>
        )}
      </div>
    </div>
  );
}
