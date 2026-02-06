"use client";
import React, { useState } from 'react';
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
  Wind 
} from 'lucide-react';
import Link from 'next/link';

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

const SAMPLE_PROPERTY = {
  id: 1,
  title: "החשמונאים 15 חולון – למכירה דירת גג 4.5 חדרים – מחיר שיווק",
  location: "החשמונאים 15, חולון",
  price: "2,020,000",
  originalPrice: "2,020,000",
  bedrooms: 4.5,
  bathrooms: 2,
  area: 94,
  floor: 4,
  totalFloors: 4,
  buildingType: "גמיש",
  availableFrom: "מיידי",
  images: [
    "/images/hero/sales.jpg",
    "/images/hero/rentals.webp",
    "/images/hero/rent.png",
    "/images/hero/sales.jpg"
  ],
  amenities: {
    ac: true,
    handicap: false,
    solarHeater: true,
    storage: true,
    sunBalcony: true,
    boiler: true,
    mamad: true,
    elevator: false
  },
  specs: [
    { label: "קומה", value: "4 מתוך 4", icon: ArrowUpFromLine },
    { label: 'גודל במ"ר', value: "94", icon: Maximize },
    { label: "חדרים", value: "4.5", icon: LayoutDashboard },
    { label: "כיווני אוויר", value: "דרום, מערב", icon: Wind },
  ],
  description: `ברחוב החשמונאים 15, שכונת גינר ושם, חולון

דירת גג 4.5 חדרים משופצת ומושקעת.
מטבח חדש, צנרת חדשה, מזגנים בכל החדרים.
מיקום מעולה קרוב למוסדות חינוך, תחבורה ציבורית ומרכזי קניות.
נכס מניב עם תשואה גבוהה - שווה לראות!`
};

export default function ApartmentDetailPage() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-40 pb-16" dir="rtl">
      <div className="w-full">

        <div className="w-full px-6 flex justify-end mb-8 px-6 lg:px-12">
          <Link
            href="/apartments"
            className="group inline-flex items-center gap-2 text-gray-600 hover:text-[#C19A6B] transition-colors duration-300 font-bold text-lg"
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
                autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: false }}
                loop={true}
                speed={800}
                thumbs={{ swiper: thumbsSwiper && !(thumbsSwiper as any).destroyed ? thumbsSwiper : null }}
                className="rounded-2xl overflow-hidden mb-4 shadow-2xl property-slider"
                style={{ height: '85vh' }}
                dir="ltr"
              >
                {SAMPLE_PROPERTY.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative w-full h-full">
                      <img src={image} alt="Property" className="w-full h-full object-cover" />
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
                  background-color: #C19A6B; 
                  border-color: #C19A6B; 
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
                .property-slider .swiper-pagination-bullet-active { background: #C19A6B; opacity: 1; width: 24px; border-radius: 4px; }
              `}</style>

              <Swiper onSwiper={setThumbsSwiper as any} spaceBetween={10} slidesPerView={4} watchSlidesProgress className="rounded-xl">
                {SAMPLE_PROPERTY.images.map((image, index) => (
                  <SwiperSlide key={index} className="cursor-pointer">
                    <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#C19A6B] transition-colors">
                      <img src={image} alt="Thumb" className="w-full h-full object-cover" />
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
              className="bg-white rounded-2xl p-8 mb-8 shadow-lg border border-gray-100"
            >
              <h2 className="text-3xl font-black text-gray-900 mb-6 uppercase">תיאור הנכס</h2>
              
              <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-bold text-gray-700 border border-gray-100 flex items-center gap-2">
                  <LayoutDashboard size={16} className="text-[#C19A6B]"/>
                  {SAMPLE_PROPERTY.bedrooms} חדרים
                </div>
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-bold text-gray-700 border border-gray-100 flex items-center gap-2">
                  <ArrowUpFromLine size={16} className="text-[#C19A6B]"/>
                  קומה {SAMPLE_PROPERTY.floor}
                </div>
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-bold text-gray-700 border border-gray-100 flex items-center gap-2">
                  <Maximize size={16} className="text-[#C19A6B]"/>
                  {SAMPLE_PROPERTY.area} מ״ר
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-line font-medium">
                  {SAMPLE_PROPERTY.description}
                </p>
              </div>
            </motion.div>

            {/* Amenities Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8"
            >
              <h2 className="text-3xl font-black text-gray-900 mb-6 uppercase">תוספות</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                {ALL_AMENITIES.map((item) => {
                  const isAvailable = SAMPLE_PROPERTY.amenities[item.key as keyof typeof SAMPLE_PROPERTY.amenities];
                  const IconComponent = item.icon;

                  return (
                    <div key={item.key} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                        ${isAvailable 
                          ? 'text-[#C19A6B] bg-[#C19A6B]/10' 
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
               className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8"
            >
               <h2 className="text-2xl font-black text-gray-900 mb-6">פרטים נוספים</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {SAMPLE_PROPERTY.specs.map((spec, index) => {
                   const Icon = spec.icon;
                   return (
                     <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#C19A6B]/30 transition-colors">
                       <div className="flex items-center gap-3">
                         <div className="p-2 bg-white rounded-full shadow-sm text-[#C19A6B]">
                           <Icon size={18} />
                         </div>
                         <span className="text-gray-500 font-semibold">{spec.label}:</span>
                       </div>
                       <span className="text-gray-900 font-bold text-lg">{spec.value}</span>
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
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <h2 className="text-3xl font-black text-gray-900 mb-6 uppercase">מיקום</h2>
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
              <div className="bg-gradient-to-br from-[#C19A6B] to-[#A67C52] rounded-2xl p-8 mb-6 text-white shadow-2xl">
                <div className="text-sm font-bold mb-2 opacity-90">מחיר:</div>
                <div className="text-4xl font-black mb-4">
                  ₪{SAMPLE_PROPERTY.price}
                </div>
                {SAMPLE_PROPERTY.originalPrice && (
                  <div className="text-lg font-semibold opacity-75">
                    מחיר מקורי: ₪{SAMPLE_PROPERTY.originalPrice}
                  </div>
                )}
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase">
                  מעוניין? צור קשר
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">שם מלא *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all" placeholder="הזן שם מלא" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">טלפון *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all" placeholder="050-123-4567" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">הודעה</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all resize-none" placeholder="ספר לנו עוד..." />
                  </div>
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full px-6 py-4 bg-[#C19A6B] text-white font-black text-lg uppercase rounded-xl shadow-lg hover:bg-gray-900 transition-all flex items-center justify-center gap-2">
                    <span>שלח הודעה</span>
                    <Send size={20} className="transform rotate-180" />
                  </motion.button>
                </form>
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm font-semibold text-gray-600 mb-2">או התקשר ישירות:</p>
                  <a href="tel:+972123456789" className="inline-flex items-center gap-2 text-xl font-black text-[#C19A6B] hover:text-gray-900 transition-colors">
                    <Phone size={20} />
                    <span>03-123-4567</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}