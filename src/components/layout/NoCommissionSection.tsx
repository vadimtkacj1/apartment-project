"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

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
  description?: string;
  propertyType?: string;
  parking?: string;
  furniture?: string;
  directions?: string[];
  hasAirConditioning?: boolean;
  hasElevator?: boolean;
  hasStorage?: boolean;
  hasSafeRoom?: boolean;
  hasSunBalcony?: boolean;
  hasBoiler?: boolean;
  vacancyDate?: string;
}

function NoCommissionSection() {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoCommissionProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/properties?noCommission=true&limit=1', {
          next: { revalidate: 300 }
        });
        if (!response.ok) throw new Error('Failed to fetch property');
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
            description: prop.description,
            propertyType: prop.propertyType,
            parking: prop.parking,
            furniture: prop.furniture,
            directions: prop.directions,
            hasAirConditioning: prop.hasAirConditioning,
            hasElevator: prop.hasElevator,
            hasStorage: prop.hasStorage,
            hasSafeRoom: prop.hasSafeRoom,
            hasSunBalcony: prop.hasSunBalcony,
            hasBoiler: prop.hasBoiler,
            vacancyDate: prop.vacancyDate,
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

  if (loading || !property) return null;

  return (
    <section className="relative pt-16 pb-16 w-full bg-warm" dir="rtl">
      <div className="container mx-auto px-4 md:px-8 2xl:px-16 relative z-10" style={{ maxWidth: '1800px' }}>
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            דירה ללא עמלת תיווך
          </h2>
          <p className="text-gray-500 text-base">
            חסכו אלפי שקלים - קנו ישירות ללא עמלה
          </p>
        </div>

        {/* Card */}
        <div className="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
          <Link href={`/apartments/${property.id}`}>
            <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

              {/* Image Container */}
              <div className="relative h-[200px] md:h-[280px] lg:h-[340px] overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                {/* Logo */}
                <div className="absolute top-4 left-4 z-10">
                  <img src="/images/logos.png" alt="Logo" className="w-20 h-auto object-contain drop-shadow" />
                </div>

                {/* Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-[#1e3a8a] text-white text-sm font-bold px-4 py-1.5 rounded-lg shadow-lg">
                    ללא עמלה
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10 text-right">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1 leading-snug">
                    {property.title}
                  </h3>
                  <p className="text-white/80 text-sm mb-3">{property.location}</p>
                  <div className="flex flex-wrap gap-2 justify-end">
                    <span className="bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1 rounded-lg">
                      {property.rooms} חדרים
                    </span>
                    <span className="bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1 rounded-lg">
                      {property.area} מ״ר
                    </span>
                    <span className="bg-[#1e3a8a] text-white text-xs font-bold px-3 py-1 rounded-lg">
                      {property.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-1.5 bg-[#1e3a8a] hover:bg-[#163070] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
                  <span>לפרטים</span>
                  <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#1e3a8a]">חסכו את עמלת התיווך!</p>
                  <p className="text-xs text-gray-400">לחצו לפרטים מלאים</p>
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