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
    <section
      className="relative py-16 w-full overflow-hidden"
      dir="rtl"
      style={{ background: 'rgb(42, 74, 138)' }}
    >
      <style>{`
        @keyframes goldGlow {
          0%, 100% { box-shadow: 0 0 20px 2px rgba(212,168,67,0.3), 0 4px 16px rgba(0,0,0,0.4); }
          50%       { box-shadow: 0 0 40px 8px rgba(212,168,67,0.65), 0 4px 24px rgba(0,0,0,0.4); }
        }
        @keyframes shineSwipe {
          0%   { transform: translateX(-200%) skewX(-20deg); }
          100% { transform: translateX(400%) skewX(-20deg); }
        }
        .btn-no-commission:hover .btn-shine {
          animation: shineSwipe 0.5s ease forwards;
        }
        .btn-no-commission {
          animation: goldGlow 2.5s ease-in-out infinite;
          transition: transform 0.2s ease;
        }
        .btn-no-commission:hover {
          transform: scale(1.02) translateY(-3px);
        }
        .btn-no-commission:active {
          transform: scale(0.97);
        }
        .no-commission-card {
          overflow: hidden;
        }
        .no-commission-card:hover .property-image {
          transform: scale(1.05);
        }
      `}</style>

      <div
        className="container mx-auto px-4 md:px-8 2xl:px-16 relative z-10"
        style={{ maxWidth: '1200px' }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            דירה ללא עמלת תיווך
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem' }}>
            חסכו אלפי שקלים — קנו ישירות ללא עמלה
          </p>
        </div>

        {/* Card */}
        <Link href={`/apartments/${property.id}`}>
          <div className="no-commission-card transition-all duration-300">
            <div className="grid md:grid-cols-5 gap-0 md:min-h-[500px]">

              {/* Image — 2/5 width */}
              <div className="md:col-span-2 relative h-[320px] md:h-full overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="property-image w-full h-full object-cover transition-transform duration-700"
                />
                {/* Badge */}
                <div className="absolute top-5 right-5 z-10">
                  <span
                    className="text-sm font-bold px-4 py-1.5 rounded-lg shadow-lg"
                    style={{ background: '#D4AF37', color: '#1C1000' }}
                  >
                    ללא עמלה
                  </span>
                </div>
              </div>

              {/* Info — 3/5 width, centered */}
              <div
                className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center items-center text-center"
                style={{ background: 'transparent' }}
              >
                {/* Property Type Badge */}
                <span
                  className="inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-5"
                  style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', letterSpacing: '0.06em' }}
                >
                  {property.propertyType === 'apartment' ? 'דירה' :
                   property.propertyType === 'penthouse' ? 'פנטהאוז' :
                   property.propertyType === 'garden-apartment' ? 'דירת גן' :
                   property.propertyType === 'cottage' ? 'קוטג׳' : 'נכס'}
                </span>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                  {property.title}
                </h3>

                {/* Location */}
                <div className="flex items-center justify-center gap-2 mb-5">
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem' }}>{property.location}</p>
                </div>

                {/* Price */}
                <p className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#D4AF37' }}>
                  {property.price}
                </p>

                {/* Property Details Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6 w-full max-w-sm">
                  {[
                    {
                      icon: (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      ),
                      label: 'חדרים',
                      value: property.rooms,
                    },
                    {
                      icon: (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      ),
                      label: 'שירותים',
                      value: property.bathrooms || 1,
                    },
                    {
                      icon: (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      ),
                      label: 'שטח',
                      value: property.area,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="text-center p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    >
                      <svg className="w-5 h-5 mx-auto mb-1.5" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {item.icon}
                      </svg>
                      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem', marginBottom: '2px' }}>{item.label}</p>
                      <p className="text-white text-lg font-bold">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Description */}
                {property.description && (
                  <p
                    className="mb-5 leading-relaxed line-clamp-2"
                    style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', maxWidth: '440px' }}
                  >
                    {property.description}
                  </p>
                )}

                {/* Features */}
                {(property.hasAirConditioning || property.hasElevator || property.hasStorage || property.hasSafeRoom || property.hasSunBalcony) && (
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {property.hasAirConditioning && (
                      <span className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)' }}>מיזוג</span>
                    )}
                    {property.hasElevator && (
                      <span className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)' }}>מעלית</span>
                    )}
                    {property.hasStorage && (
                      <span className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)' }}>מחסן</span>
                    )}
                    {property.hasSafeRoom && (
                      <span className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)' }}>ממ״ד</span>
                    )}
                    {property.hasSunBalcony && (
                      <span className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)' }}>מרפסת שמש</span>
                    )}
                  </div>
                )}

                {/* CTA */}
                <div
                  className="btn-no-commission group relative text-center py-3 px-10 rounded-xl font-bold text-base overflow-hidden cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #B8821E 0%, #F2C443 50%, #C8922A 100%)',
                    color: '#1C1000',
                    letterSpacing: '0.04em',
                    minWidth: '200px',
                  }}
                >
                  <span
                    className="btn-shine pointer-events-none absolute top-0 left-0 h-full w-1/3"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
                      transform: 'translateX(-200%) skewX(-20deg)',
                    }}
                  />
                  <span className="relative z-10">לפרטים נוספים ←</span>
                </div>

                <p className="text-sm font-semibold mt-4" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  חסכו את עמלת התיווך — קנו ישירות!
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

export default NoCommissionSection;