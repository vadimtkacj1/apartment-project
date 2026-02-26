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
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('דירה ללא עמלת תיווך');

  useEffect(() => {
    const fetchNoCommissionProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch title (non-blocking - if it fails, just use default)
        try {
          const titlesResponse = await fetch('/api/homepage-titles', {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache'
            }
          });
          if (titlesResponse.ok) {
            const titlesData = await titlesResponse.json();
            if (titlesData.noCommissionTitle) {
              setTitle(titlesData.noCommissionTitle);
            }
          }
        } catch (titleError) {
          console.warn('Could not load custom title, using default:', titleError);
        }

        const response = await fetch('/api/properties?noCommission=true&limit=1', {
          next: { revalidate: 300 }
        });

        if (!response.ok) {
          throw new Error('שגיאה בטעינת הנכסים');
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
        setError(error instanceof Error ? error.message : 'אירעה שגיאה בטעינת הנכסים');
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };
    fetchNoCommissionProperty();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section
        className="relative py-16 md:py-20 w-full overflow-hidden"
        dir="rtl"
        style={{ background: 'rgb(42, 74, 138)' }}
      >
        <div className="container mx-auto px-4 md:px-8 2xl:px-16 relative z-10" style={{ maxWidth: '1200px' }}>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            <p className="text-white mt-4 text-lg">טוען...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error or no property - don't show section
  if (error || !property) return null;

  return (
    <section
      className="relative py-16 md:py-24 w-full overflow-hidden"
      dir="rtl"
      style={{ background: 'linear-gradient(135deg, rgb(42, 74, 138) 0%, rgb(35, 62, 115) 100%)' }}
    >
      <style>{`
        @keyframes goldGlow {
          0%, 100% { box-shadow: 0 0 30px 3px rgba(212,168,67,0.4), 0 8px 24px rgba(0,0,0,0.3); }
          50%       { box-shadow: 0 0 50px 10px rgba(212,168,67,0.7), 0 8px 32px rgba(0,0,0,0.3); }
        }
        @keyframes shineSwipe {
          0%   { transform: translateX(-200%) skewX(-20deg); }
          100% { transform: translateX(400%) skewX(-20deg); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .btn-no-commission:hover .btn-shine {
          animation: shineSwipe 0.6s ease forwards;
        }
        .btn-no-commission {
          animation: goldGlow 3s ease-in-out infinite;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-no-commission:hover {
          transform: scale(1.05) translateY(-4px);
          box-shadow: 0 0 60px 15px rgba(212,168,67,0.8), 0 12px 40px rgba(0,0,0,0.4);
        }
        .btn-no-commission:active {
          transform: scale(0.98);
        }
        .no-commission-card {
          overflow: hidden;
          animation: fadeInUp 0.6s ease-out;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .no-commission-card:hover {
          transform: translateY(-8px);
        }
        .no-commission-card:hover .property-image {
          transform: scale(1.1);
        }
        .property-image {
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .feature-tag {
          backdrop-filter: blur(10px);
          transition: all 0.2s ease;
        }
        .feature-tag:hover {
          background: rgba(255,255,255,0.12) !important;
        }
      `}</style>

      <div
        className="container mx-auto px-4 md:px-8 2xl:px-16 relative z-10"
        style={{ maxWidth: '1200px' }}
      >
        {/* Header */}
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-2 md:mb-3 uppercase tracking-tight" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>
            {title}
          </h2>
          <p className="text-xl md:text-2xl font-semibold max-w-3xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            חסכו אלפי שקלים — קנו ישירות ללא עמלה
          </p>
        </div>

        {/* Card */}
        <Link href={`/apartments/${property.id}`}>
          <div className="no-commission-card transition-all duration-300 max-w-2xl mx-auto">
            <div className="grid md:grid-cols-5 gap-0 md:min-h-48">

              {/* Image — 3/5 width */}
              <div className="md:col-span-3 relative h-36 md:h-full overflow-hidden rounded-2xl" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                <img
                  src={property.image}
                  alt={property.title}
                  className="property-image w-full h-full object-cover transition-transform duration-700 rounded-2xl"
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

              {/* Info — 2/5 width, centered */}
              <div
                className="md:col-span-2 p-5 md:p-6 flex flex-col justify-center items-center text-center"
                style={{ background: 'transparent' }}
              >
                {/* Property Type Badge */}
                <span
                  className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
                  style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', letterSpacing: '0.06em' }}
                >
                  {property.propertyType === 'apartment' ? 'דירה' :
                   property.propertyType === 'penthouse' ? 'פנטהאוז' :
                   property.propertyType === 'garden-apartment' ? 'דירת גן' :
                   property.propertyType === 'cottage' ? 'קוטג׳' : 'נכס'}
                </span>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                  {property.title}
                </h3>

                {/* Location */}
                <div className="flex items-center justify-center gap-1.5 mb-3">
                  <svg className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>{property.location}</p>
                </div>

                {/* Price */}
                <p className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#D4AF37' }}>
                  {property.price}
                </p>

                {/* Property Details Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4 w-full max-w-xs">
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
                      className="text-center p-2 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    >
                      <svg className="w-4 h-4 mx-auto mb-1" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {item.icon}
                      </svg>
                      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.65rem', marginBottom: '2px' }}>{item.label}</p>
                      <p className="text-white text-base font-bold">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Description */}
                {property.description && (
                  <p
                    className="mb-3 leading-relaxed line-clamp-2"
                    style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', maxWidth: '380px' }}
                  >
                    {property.description}
                  </p>
                )}

                {/* Features */}
                {(property.hasAirConditioning || property.hasElevator || property.hasStorage || property.hasSafeRoom || property.hasSunBalcony) && (
                  <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                    {property.hasAirConditioning && (
                      <span className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)' }}>מיזוג</span>
                    )}
                    {property.hasElevator && (
                      <span className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)' }}>מעלית</span>
                    )}
                    {property.hasStorage && (
                      <span className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)' }}>מחסן</span>
                    )}
                    {property.hasSafeRoom && (
                      <span className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)' }}>ממ״ד</span>
                    )}
                    {property.hasSunBalcony && (
                      <span className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)' }}>מרפסת שמש</span>
                    )}
                  </div>
                )}

                {/* CTA */}
                <div
                  className="btn-no-commission group relative text-center py-2.5 px-8 rounded-xl font-bold text-sm overflow-hidden cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #B8821E 0%, #F2C443 50%, #C8922A 100%)',
                    color: '#1C1000',
                    letterSpacing: '0.04em',
                    minWidth: '180px',
                  }}
                >
                  <span
                    className="btn-shine pointer-events-none absolute top-0 left-0 h-full w-1/3"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
                      transform: 'translateX(-200%) skewX(-20deg)',
                    }}
                  />
                  <span className="relative z-10" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>לפרטים נוספים ←</span>
                </div>

                <p className="text-xs font-semibold mt-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
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