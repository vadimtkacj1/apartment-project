"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, Autoplay } from 'swiper/modules';
import {
  ArrowLeft,
  Send,
  Phone,
  Snowflake,
  Accessibility,
  Sun,
  Box,
  Flame,
  Shield,
  ArrowUpDown,
  Waves,
  Maximize,
  LayoutDashboard,
  ArrowUpFromLine,
  Wind,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import SimilarProperties from '@/components/properties/SimilarProperties';
import { analytics } from '@/lib/analytics';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

// --- Static Data ---

const ALL_AMENITIES = [
  { key: 'ac', label: 'מיזוג', icon: Snowflake },
  { key: 'handicap', label: 'גישה לנכה', icon: Accessibility },
  { key: 'solarHeater', label: 'דוד שמש', icon: Sun },
  { key: 'storage', label: 'מחסן', icon: Box },
  { key: 'sunBalcony', label: 'מרפסת שמש', icon: Waves },
  { key: 'boiler', label: 'דוד', icon: Flame },
  { key: 'mamad', label: 'ממ״ד', icon: Shield },
  { key: 'elevator', label: 'מעלית', icon: ArrowUpDown }
];

interface PropertyData {
  id: number;
  title: string;
  location: string;
  price: string;
  originalPrice?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  floor?: number;
  totalFloors?: number;
  buildingType?: string;
  availableFrom?: string;
  images: string[];
  amenities: {
    ac: boolean;
    handicap: boolean;
    solarHeater: boolean;
    storage: boolean;
    sunBalcony: boolean;
    boiler: boolean;
    mamad: boolean;
    elevator: boolean;
  };
  specs: Array<{ label: string; value: string; icon: any }>;
  description: string;
  directions?: string[];
  isSold?: boolean;
}

export default function ApartmentDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  // Fetch property data from API
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/properties/${propertyId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch property');
        }

        const data = await response.json();

        // Map API data to component format
        const mappedProperty: PropertyData = {
          id: data.id,
          title: data.title,
          location: data.location,
          price: data.price,
          originalPrice: data.originalPrice,
          bedrooms: data.rooms,
          bathrooms: data.bathrooms,
          area: data.area,
          floor: data.floor,
          images: data.images && data.images.length > 0 ? data.images : ["/images/hero/sales.jpg"],
          description: data.description || 'אין תיאור זמין',
          isSold: data.isSold || false,
          amenities: {
            ac: data.hasAirConditioning || false,
            handicap: data.hasDisabledAccess || false,
            solarHeater: false, // Not in DB, keeping for compatibility
            storage: data.hasStorage || false,
            sunBalcony: data.hasSunBalcony || false,
            boiler: data.hasBoiler || false,
            mamad: data.hasSafeRoom || false,
            elevator: data.hasElevator || false,
          },
          specs: [
            {
              label: "קומה",
              value: data.floor ? `${data.floor}` : "לא צוין",
              icon: ArrowUpFromLine
            },
            {
              label: 'גודל במ"ר',
              value: `${data.area}`,
              icon: Maximize
            },
            {
              label: "חדרים",
              value: `${data.rooms}`,
              icon: LayoutDashboard
            },
            {
              label: "כיווני אוויר",
              value: data.directions && data.directions.length > 0
                ? data.directions.join(', ')
                : "לא צוין",
              icon: Wind
            },
          ],
          directions: data.directions || [],
        };

        setProperty(mappedProperty);
        setError(null);
        
        // Track property view
        analytics.trackPropertyView(propertyId);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('שגיאה בטעינת הנכס');
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Track contact form submission
    analytics.trackContactForm(propertyId);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-warm pt-8 pb-16" dir="rtl">
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600 text-xl">טוען נכס...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <div className="min-h-screen bg-warm pt-8 pb-16" dir="rtl">
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-gray-600 text-xl mb-4">{error || 'נכס לא נמצא'}</p>
          <Link
            href="/apartments"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1c3664] text-white font-bold rounded-xl hover:bg-[#152a4f] transition-colors"
          >
            <span>חזרה לנכסים</span>
            <ArrowLeft size={20} />
          </Link>
        </div>
      </div>
    );
  }

  const isSold = property.isSold || false;

  return (
    <div className={`min-h-screen bg-warm pt-8 pb-16 relative ${isSold ? 'opacity-75' : ''}`} dir="rtl">
      {/* Sold Overlay */}
      {isSold && (
        <div className="fixed inset-0 bg-gray-900/20 z-40 pointer-events-none"></div>
      )}
      
      {/* Sold Badge - Fixed Position */}
      {isSold && (
        <div className="fixed top-20 right-8 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-2 font-bold text-lg">
          <CheckCircle2 size={24} />
          <span>נמכר</span>
        </div>
      )}

      <div className={`w-full ${isSold ? 'pointer-events-none' : ''}`}>

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

            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Swiper
                modules={[Navigation, Pagination, Thumbs, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={isSold ? false : { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: false }}
                loop={true}
                speed={800}
                thumbs={{ swiper: thumbsSwiper && !(thumbsSwiper as any).destroyed ? thumbsSwiper : null }}
                className={`rounded-2xl overflow-hidden mb-4 shadow-2xl property-slider ${isSold ? 'grayscale opacity-60' : ''}`}
                style={{ height: '85vh' }}
                dir="ltr"
              >
                {property.images.map((image: string, index: number) => (
                  <SwiperSlide key={index}>
                    <div className="relative w-full h-full">
                      <img src={image} alt="Property" className={`w-full h-full object-cover ${isSold ? 'grayscale opacity-60' : ''}`} />
                      {isSold && <div className="absolute inset-0 bg-gray-900/30"></div>}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              <style jsx global>{`
                .property-slider { position: relative; }
                
                /* Стили кнопок слайдера - уменьшены */
                .property-slider .swiper-button-prev, .property-slider .swiper-button-next {
                  width: 30px; /* Было 32/48 */
                  height: 30px;
                  background-color: rgba(0, 0, 0, 0.4); 
                  color: white;
                  border-radius: 50%; 
                  backdrop-filter: blur(4px); 
                  transition: all 0.3s ease;
                  display: flex; 
                  align-items: center; 
                  justify-content: center; 
                  border: 1px solid rgba(255,255,255,0.1);
                }
                
                .property-slider .swiper-button-prev:hover, .property-slider .swiper-button-next:hover {
                  background-color: #1c3664; 
                  border-color: #1c3664; 
                  transform: scale(1.1);
                }
                
                /* Размер самой иконки стрелки - уменьшен */
                .property-slider .swiper-button-prev:after, .property-slider .swiper-button-next:after {
                  font-size: 10px !important; /* Было 12/20 - очень маленькая аккуратная стрелка */
                  font-weight: bold;
                }
                
                .property-slider .swiper-button-prev { left: 20px; }
                .property-slider .swiper-button-next { right: 20px; }
                
                .property-slider .swiper-pagination-bullet { background: white; opacity: 0.7; width: 8px; height: 8px; }
                .property-slider .swiper-pagination-bullet-active { background: #1c3664; opacity: 1; width: 24px; border-radius: 4px; }
              `}</style>

              <Swiper onSwiper={setThumbsSwiper as any} spaceBetween={10} slidesPerView={4} watchSlidesProgress className="rounded-xl">
                {property.images.map((image: string, index: number) => (
                  <SwiperSlide key={index} className={isSold ? 'cursor-not-allowed' : 'cursor-pointer'}>
                    <div className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                      isSold ? 'border-gray-300 opacity-60' : 'border-gray-200 hover:border-[#1c3664]'
                    }`}>
                      <img src={image} alt="Thumb" className={`w-full h-full object-cover ${isSold ? 'grayscale opacity-60' : ''}`} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`rounded-2xl p-8 mb-8 shadow-lg border ${
                isSold ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-100'
              }`}
            >
              <h2 className={`text-3xl font-black mb-6 uppercase ${
                isSold ? 'text-gray-500 line-through' : 'text-gray-900'
              }`}>תיאור הנכס</h2>
              
              <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-bold text-gray-700 border border-gray-100 flex items-center gap-2">
                  <LayoutDashboard size={16} className="text-[#1c3664]"/>
                  {property.bedrooms} חדרים
                </div>
                {property.floor && (
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-bold text-gray-700 border border-gray-100 flex items-center gap-2">
                    <ArrowUpFromLine size={16} className="text-[#1c3664]"/>
                    קומה {property.floor}
                  </div>
                )}
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-bold text-gray-700 border border-gray-100 flex items-center gap-2">
                  <Maximize size={16} className="text-[#1c3664]"/>
                  {property.area} מ״ר
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className={`text-lg leading-relaxed whitespace-pre-line font-medium ${
                  isSold ? 'text-gray-500' : 'text-gray-800'
                }`}>
                  {property.description}
                </p>
              </div>
            </motion.div>

            {/* Amenities Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`rounded-2xl p-8 shadow-lg border mb-8 ${
                isSold ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-100'
              }`}
            >
              <h2 className={`text-3xl font-black mb-6 uppercase ${
                isSold ? 'text-gray-500 line-through' : 'text-gray-900'
              }`}>תוספות</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                {ALL_AMENITIES.map((item) => {
                  const isAvailable = property.amenities[item.key as keyof typeof property.amenities];
                  const IconComponent = item.icon;

                  return (
                    <div key={item.key} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                        ${isAvailable 
                          ? 'text-[#1c3664] bg-[#1c3664]/10' 
                          : 'text-gray-300 bg-gray-50' 
                        }`}
                      >
                        <IconComponent size={20} strokeWidth={isAvailable ? 2 : 1.5} />
                      </div>
                      <span className={`font-bold text-sm ${
                        isAvailable ? 'text-[#1a1a1a]' : 'text-gray-400 line-through decoration-gray-300'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Features / Info Section */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.35 }}
               className={`rounded-2xl p-8 shadow-lg border mb-8 ${
                 isSold ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-100'
               }`}
            >
               <h2 className={`text-2xl font-black mb-6 ${
                 isSold ? 'text-gray-500 line-through' : 'text-gray-900'
               }`}>פרטים נוספים</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {property.specs.map((spec: { label: string; value: string; icon: any }, index: number) => {
                   const Icon = spec.icon;
                   return (
                     <div key={index} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                       isSold 
                         ? 'bg-gray-200 border-gray-300' 
                         : 'bg-gray-50 border-gray-100 hover:border-[#1c3664]/30'
                     }`}>
                       <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-full shadow-sm ${
                           isSold ? 'bg-gray-300 text-gray-500' : 'bg-white text-[#1c3664]'
                         }`}>
                           <Icon size={18} />
                         </div>
                         <span className={`font-semibold ${isSold ? 'text-gray-400' : 'text-gray-500'}`}>{spec.label}:</span>
                       </div>
                       <span className={`font-bold text-lg ${isSold ? 'text-gray-500' : 'text-gray-900'}`}>{spec.value}</span>
                     </div>
                   )
                 })}
               </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`rounded-2xl p-8 shadow-lg border ${
                isSold ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-100'
              }`}
            >
              <h2 className={`text-3xl font-black mb-6 uppercase ${
                isSold ? 'text-gray-500 line-through' : 'text-gray-900'
              }`}>מיקום</h2>
              <div className="rounded-xl overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.9441877937624!2d34.774577815081994!3d32.01615298119051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4b8b5c4e5e5d%3A0x5c5e5e5d5c4b8b5c!2z15fXldec15XXnw!5e0!3m2!1siw!2sil!4v1234567890123!5m2!1siw!2sil"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                />
              </div>
            </motion.div>
          </div>

          {/* Left Side - Contact Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-32"
            >
              {/* Price Card */}
              <div className={`rounded-2xl p-8 mb-6 shadow-2xl ${
                isSold 
                  ? 'bg-gray-400 text-white opacity-75' 
                  : 'bg-gradient-to-br from-[#1c3664] to-[#152a4f] text-white'
              }`}>
                <div className="text-sm font-bold mb-2 opacity-90">מחיר:</div>
                <div className={`text-4xl font-black mb-4 ${isSold ? 'line-through' : ''}`}>
                  {property.price}
                </div>
                {property.originalPrice && (
                  <div className="text-lg font-semibold opacity-75">
                    מחיר מקורי: {property.originalPrice}
                  </div>
                )}
                {isSold && (
                  <div className="mt-4 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
                    <CheckCircle2 size={20} />
                    <span>נמכר</span>
                  </div>
                )}
              </div>

              {/* Contact Form */}
              <div className={`rounded-2xl p-8 shadow-xl border ${
                isSold 
                  ? 'bg-gray-100 border-gray-300 opacity-75' 
                  : 'bg-white border-gray-100'
              }`}>
                <h3 className={`text-2xl font-black mb-6 uppercase ${
                  isSold ? 'text-gray-500 line-through' : 'text-gray-900'
                }`}>
                  מעוניין? צור קשר
                </h3>
                {isSold ? (
                  <div className="text-center py-8">
                    <div className="flex items-center justify-center gap-2 bg-red-100 text-red-700 px-6 py-4 rounded-lg font-bold mb-4">
                      <CheckCircle2 size={24} />
                      <span>הנכס נמכר</span>
                    </div>
                    <p className="text-gray-500">לא ניתן ליצור קשר לגבי נכס זה</p>
                  </div>
                ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">שם מלא *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#1c3664] focus:bg-white focus:outline-none transition-all" placeholder="הזן שם מלא" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">טלפון *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#1c3664] focus:bg-white focus:outline-none transition-all" placeholder="050-123-4567" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">הודעה</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#1c3664] focus:bg-white focus:outline-none transition-all resize-none" placeholder="ספר לנו עוד..." />
                  </div>
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full px-6 py-4 bg-[#1c3664] text-white font-black text-lg uppercase rounded-xl shadow-lg hover:bg-[#152a4f] transition-all flex items-center justify-center gap-2">
                    <span>שלח הודעה</span>
                    <Send size={20} className="transform rotate-180" />
                  </motion.button>
                </form>
                )}
                {!isSold && (
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm font-semibold text-gray-600 mb-2">או התקשר ישירות:</p>
                  <a 
                    href="tel:+972123456789" 
                    onClick={() => analytics.trackPhoneClick(propertyId)}
                    className="inline-flex items-center gap-2 text-xl font-black text-[#1c3664] hover:text-gray-900 transition-colors"
                  >
                    <Phone size={20} />
                    <span>03-123-4567</span>
                  </a>
                </div>
                )}
              </div>
            </motion.div>
          </div>

        </div>

        {/* Similar Properties Section */}
        <SimilarProperties currentPropertyId={property.id} limit={3} />
      </div>
    </div>
  );
}