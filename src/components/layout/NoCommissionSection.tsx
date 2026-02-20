"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// Type for apartment data
interface Property {
  id: number;
  title: string;
  price: string;
  rooms?: string;
  bedrooms?: string;
  bathrooms?: number;
  area: number;
  location: string;
  image?: string;
  images?: string[];
  status?: string;
  isSold?: boolean;
  floor?: number;
}

function NoCommissionSection() {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoCommissionProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/properties?dealType=sale&noCommission=true&limit=1', {
          next: { revalidate: 300 }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch property');
        }

        const data = await response.json();

        if (data && data.length > 0) {
          const prop = data[0];
          setProperty({
            id: prop.id,
            title: prop.title,
            price: prop.price,
            bedrooms: prop.rooms,
            rooms: prop.rooms,
            bathrooms: prop.bathrooms,
            area: prop.area,
            location: prop.location,
            image: prop.images && prop.images.length > 0 ? prop.images[0] : "/images/hero/sales.jpg",
            images: prop.images,
            status: prop.status,
            isSold: prop.isSold || false,
            floor: prop.floor,
          });
        } else {
          setProperty(null);
        }
      } catch (error) {
        console.error('Error fetching no commission property:', error);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNoCommissionProperty();
  }, []);

  if (loading) {
    return null;
  }

  if (!property) {
    return null;
  }

  return (
    <section className="relative py-16 md:py-20 lg:py-24 overflow-hidden w-full" dir="rtl">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <span className="font-semibold text-sm">הזדמנות מיוחדת</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            דירה ללא עמלת תיווך
          </h2>
          <p className="text-lg text-gray-600">
            חסכו אלפי שקלים - קנו ישירות ללא עמלה
          </p>
        </div>

        {/* Featured Property Card */}
        <div className="max-w-5xl mx-auto">
          <Link href={`/apartments/${property.id}`}>
            <div className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100">

              {/* Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-primary text-white px-5 py-2 rounded-lg font-bold text-sm shadow-lg">
                  ללא עמלה
                </div>
              </div>

              {/* Image Section */}
              <div className="relative h-[350px] md:h-[450px] overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                {/* Price Badge on Image */}
                <div className="absolute top-4 left-4">
                  <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg">
                    <div className="text-xs text-gray-500 mb-1">מחיר</div>
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">
                      {property.price}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {property.title}
                </h3>

                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg">{property.location}</span>
                </div>

                {/* Property Details */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span className="font-medium text-gray-700">{property.rooms} חדרים</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-gray-700">{property.area} מ״ר</span>
                  </div>
                  {property.bathrooms && (
                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                      <span className="font-medium text-gray-700">{property.bathrooms} חדרי רחצה</span>
                    </div>
                  )}
                  {property.floor && (
                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                      <span className="font-medium text-gray-700">קומה {property.floor}</span>
                    </div>
                  )}
                </div>

                {/* Call to Action */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <div>
                    <p className="text-lg font-bold text-primary mb-1">
                      חסכו את עמלת התיווך
                    </p>
                    <p className="text-sm text-gray-500">
                      קנו ישירות מהבעלים
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                    <span>לפרטים נוספים</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NoCommissionSection;
