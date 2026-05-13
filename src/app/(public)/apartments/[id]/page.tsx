"use client";
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Check } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import SimilarProperties from '@/components/properties/SimilarProperties';
import { usePropertyData } from '@/hooks/usePropertyData';
import {
  LoadingState,
  ErrorState,
  PropertyGallery,
  PropertyAgentBlock,
  PropertyDescription,
  PropertyAmenities,
  PropertySpecs,
  PropertyMap,
  PriceCard,
  ContactForm,
  PropertyNavigation
} from '@/components/apartment-detail';

export default function ApartmentDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const { property, loading, error } = usePropertyData(propertyId);
  const [previousId, setPreviousId] = useState<number | null>(null);
  const [nextId, setNextId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Fetch all property IDs to determine previous/next navigation
  useEffect(() => {
    const fetchPropertyIds = async () => {
      try {
        const response = await fetch('/api/properties');
        if (!response.ok) return;

        const properties = await response.json();
        const propertyIds = properties.map((p: any) => p.id);

        const currentIndex = propertyIds.indexOf(Number(propertyId));
        if (currentIndex !== -1) {
          setPreviousId(currentIndex > 0 ? propertyIds[currentIndex - 1] : null);
          setNextId(currentIndex < propertyIds.length - 1 ? propertyIds[currentIndex + 1] : null);
        }
      } catch (err) {
        console.error('Error fetching property IDs:', err);
      }
    };

    if (propertyId) {
      fetchPropertyIds();
    }
  }, [propertyId]);

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error || !property) {
    return <ErrorState error={error || undefined} />;
  }

  const isSold = property.isSold || false;

  return (
    <div className="min-h-screen bg-warm pt-32 pb-16 relative" dir="rtl">
      {/* Copy toast */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: copied ? 1 : 0, y: copied ? 0 : 20 }}
        transition={{ duration: 0.25 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      >
        <div className="flex items-center gap-2 bg-[#1c3664] text-white px-5 py-3 rounded-full shadow-lg text-sm font-medium">
          <Check size={16} />
          <span>הקישור הועתק ללוח!</span>
        </div>
      </motion.div>
      <div className="w-full">
        {/* Back to apartments link + Share button */}
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

        {/* Property Navigation */}
        <div className="w-full px-6 lg:px-12">
          <PropertyNavigation previousId={previousId} nextId={nextId} isSold={false} />
        </div>

        {/* Property Title - always show at top */}
        <h1 className="w-full px-6 lg:px-12 text-2xl md:text-3xl font-bold text-[#1c3664] mb-6 text-center md:text-right" dir="rtl">
          {property.title?.trim() || property.location || `דירה ${property.dealType === 'rent' ? 'להשכרה' : 'למכירה'}`}
        </h1>

        <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:px-12">
          {/* Right Side - Gallery & Description */}
          <div className="lg:col-span-2">
            <div className="-mx-6 lg:mx-0">
              <PropertyGallery images={property.images} isSold={isSold} dealType={property.dealType} />
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
              <PropertyMap
                isSold={isSold}
                latitude={property.latitude}
                longitude={property.longitude}
                location={property.location}
              />
            </div>
          </div>

          {/* Left Side - Contact Form */}
          <div className="lg:col-span-1 px-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-24"
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
            </motion.div>
          </div>
        </div>

        {/* Similar Properties Section */}
        <SimilarProperties currentPropertyId={property.id} limit={3} />
      </div>
    </div>
  );
}
