"use client";
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import SimilarProperties from '@/components/properties/SimilarProperties';
import { usePropertyData } from '@/hooks/usePropertyData';
import {
  LoadingState,
  ErrorState,
  PropertyGallery,
  PropertyDescription,
  PropertyAmenities,
  PropertySpecs,
  PropertyMap,
  PriceCard,
  ContactForm,
  PropertyNavigation
} from '@/components/apartment-detail';

interface Owner {
  id: number;
  name: string;
  phone: string;
}

export default function ApartmentDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const { property, loading, error } = usePropertyData(propertyId);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [previousId, setPreviousId] = useState<number | null>(null);
  const [nextId, setNextId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/owners')
      .then((res) => res.json())
      .then((data) => setOwners(data))
      .catch((err) => console.error('Error fetching owners:', err));
  }, []);

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
    <div className={`min-h-screen bg-warm pt-32 pb-16 relative ${isSold ? 'opacity-75' : ''}`} dir="rtl">
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

        {/* Property Navigation */}
        <div className="w-full px-6 lg:px-12">
          <PropertyNavigation previousId={previousId} nextId={nextId} isSold={isSold} />
        </div>

        <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:px-12">
          {/* Right Side - Gallery & Description */}
          <div className="lg:col-span-2">
            <div className="-mx-6 lg:mx-0">
              <PropertyGallery images={property.images} isSold={isSold} />
            </div>
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
              />
              <ContactForm propertyId={propertyId} isSold={isSold} owners={owners} />
            </motion.div>
          </div>
        </div>

        {/* Similar Properties Section */}
        <SimilarProperties currentPropertyId={property.id} limit={3} />
      </div>
    </div>
  );
}
