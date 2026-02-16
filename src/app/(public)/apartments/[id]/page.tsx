"use client";
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import SimilarProperties from '@/components/properties/SimilarProperties';
import { usePropertyData } from '@/hooks/usePropertyData';
import {
  LoadingState,
  ErrorState,
  SoldBadge,
  PropertyGallery,
  PropertyDescription,
  PropertyAmenities,
  PropertySpecs,
  PropertyMap,
  PriceCard,
  ContactForm
} from '@/components/apartment-detail';

export default function ApartmentDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const { property, loading, error } = usePropertyData(propertyId);

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
    <div className={`min-h-screen bg-warm pt-8 pb-16 relative ${isSold ? 'opacity-75' : ''}`} dir="rtl">
      <SoldBadge isSold={isSold} />

      <div className={`w-full ${isSold ? 'pointer-events-none' : ''}`}>
        {/* Back to apartments link */}
        <div className="w-full px-6 flex justify-end mb-8 px-6 lg:px-12">
          <Link
            href="/apartments"
            className="group inline-flex items-center gap-2 text-gray-600 hover:text-[#1c3664] transition-colors duration-300 font-bold text-lg"
          >
            <span>חזרה לנכסים</span>
            <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 lg:px-12">
          {/* Right Side - Gallery & Description */}
          <div className="lg:col-span-2">
            <PropertyGallery images={property.images} isSold={isSold} />
            <PropertyDescription
              description={property.description}
              bedrooms={property.bedrooms}
              floor={property.floor}
              area={property.area}
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

          {/* Left Side - Contact Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-32"
            >
              <PriceCard
                price={property.price}
                originalPrice={property.originalPrice}
                isSold={isSold}
              />
              <ContactForm propertyId={propertyId} isSold={isSold} />
            </motion.div>
          </div>
        </div>

        {/* Similar Properties Section */}
        <SimilarProperties currentPropertyId={property.id} limit={3} />
      </div>
    </div>
  );
}
