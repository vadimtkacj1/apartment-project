"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, Autoplay } from 'swiper/modules';
import { Bed, Bath, Maximize, MapPin, Home, Calendar, CheckCircle2, Send, ArrowRight, Phone } from 'lucide-react';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

export default function ApartmentDetailPage() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  // Sample property data
  const property = {
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
    features: [
      "ברחוב החשמונאים 15, שכונת גינר ושם, חולון",
      "דירת גג 4.5 חדרים",
      "מפלס א' – 2.5 חדרים",
      "מפלס ב' – 2 חדרים",
      "גודל במ״ר: 94",
      "שכונה: גינר",
      "קומת בבנין: 4",
      "קומה: 4",
      "כיווני אוויר: דרום, מערב"
    ],
    description: `ברחוב החשמונאים 15, שכונת גינר ושם, חולון 💎

דירת גג 4.5 חדרים
- מפלס א׳ – 2.5 חדרים
- מפלס ב׳ – 2 חדרים`
  };

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-16" dir="rtl">
      <div className="w-full">

        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <Link
            href="/apartments"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-[#C19A6B] font-bold mb-8 transition-colors"
          >
            <ArrowRight size={20} />
            <span>חזרה לנכסים</span>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 lg:px-12 max-w-7xl mx-auto">

          {/* Right Side - Gallery & Description */}
          <div className="lg:col-span-2">

            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              {/* Main Swiper */}
              <Swiper
                modules={[Navigation, Pagination, Thumbs, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: false,
                }}
                loop={true}
                speed={800}
                thumbs={{ swiper: thumbsSwiper && !(thumbsSwiper as any).destroyed ? thumbsSwiper : null }}
                className="rounded-2xl overflow-hidden mb-4 shadow-2xl property-slider"
                style={{ height: '85vh' }}
                dir="ltr"
              >
                {property.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative w-full h-full">
                      <img
                        src={image}
                        alt={`${property.title} - תמונה ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <style jsx global>{`
                .property-slider .swiper-button-prev,
                .property-slider .swiper-button-next {
                  color: white;
                  background: rgba(0, 0, 0, 0.5);
                  backdrop-filter: blur(10px);
                  width: 60px;
                  height: 60px;
                  border-radius: 12px;
                  transition: all 0.3s ease;
                }
                .property-slider .swiper-button-prev:hover,
                .property-slider .swiper-button-next:hover {
                  background: rgba(193, 154, 107, 0.95);
                  transform: scale(1.1);
                }
                .property-slider .swiper-button-prev:after,
                .property-slider .swiper-button-next:after {
                  font-size: 22px;
                  font-weight: bold;
                }
                .property-slider .swiper-button-prev {
                  left: 30px;
                  right: auto;
                }
                .property-slider .swiper-button-next {
                  right: 30px;
                  left: auto;
                }
                .property-slider .swiper-pagination-bullet {
                  background: white;
                  opacity: 0.6;
                  width: 12px;
                  height: 12px;
                }
                .property-slider .swiper-pagination-bullet-active {
                  background: #C19A6B;
                  opacity: 1;
                  width: 32px;
                  border-radius: 6px;
                }
              `}</style>

              {/* Thumbnails */}
              <Swiper
                onSwiper={setThumbsSwiper as any}
                spaceBetween={10}
                slidesPerView={4}
                watchSlidesProgress
                className="rounded-xl"
              >
                {property.images.map((image, index) => (
                  <SwiperSlide key={index} className="cursor-pointer">
                    <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#C19A6B] transition-colors">
                      <img
                        src={image}
                        alt={`תמונה ממוזערת ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>

            {/* Property Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <div className="bg-white rounded-xl p-6 text-center border-2 border-gray-100 hover:border-[#C19A6B] transition-all">
                <Bed size={32} className="text-[#C19A6B] mx-auto mb-3" />
                <div className="text-2xl font-black text-gray-900 mb-1">{property.bedrooms}</div>
                <div className="text-sm font-semibold text-gray-600">חדרים</div>
              </div>

              <div className="bg-white rounded-xl p-6 text-center border-2 border-gray-100 hover:border-[#C19A6B] transition-all">
                <Bath size={32} className="text-[#C19A6B] mx-auto mb-3" />
                <div className="text-2xl font-black text-gray-900 mb-1">{property.bathrooms}</div>
                <div className="text-sm font-semibold text-gray-600">שירותים</div>
              </div>

              <div className="bg-white rounded-xl p-6 text-center border-2 border-gray-100 hover:border-[#C19A6B] transition-all">
                <Maximize size={32} className="text-[#C19A6B] mx-auto mb-3" />
                <div className="text-2xl font-black text-gray-900 mb-1">{property.area}</div>
                <div className="text-sm font-semibold text-gray-600">מ״ר</div>
              </div>

              <div className="bg-white rounded-xl p-6 text-center border-2 border-gray-100 hover:border-[#C19A6B] transition-all">
                <Home size={32} className="text-[#C19A6B] mx-auto mb-3" />
                <div className="text-2xl font-black text-gray-900 mb-1">{property.floor}</div>
                <div className="text-sm font-semibold text-gray-600">קומה</div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 mb-8 shadow-lg border border-gray-100"
            >
              <h2 className="text-3xl font-black text-gray-900 mb-6 uppercase">תיאור הנכס</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line font-semibold">
                  {property.description}
                </p>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <h2 className="text-3xl font-black text-gray-900 mb-6 uppercase">מאפיינים</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-[#C19A6B] mt-1 flex-shrink-0" />
                    <span className="text-gray-700 font-semibold">{feature}</span>
                  </div>
                ))}
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
                  ₪{property.price}
                </div>
                {property.originalPrice && (
                  <div className="text-lg font-semibold opacity-75">
                    מחיר מקורי: ₪{property.originalPrice}
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
                    <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
                      שם מלא *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all"
                      placeholder="הזן שם מלא"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-900 mb-2">
                      טלפון *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all"
                      placeholder="050-123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-2">
                      הודעה
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all resize-none"
                      placeholder="ספר לנו עוד..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-4 bg-[#C19A6B] text-white font-black text-lg uppercase rounded-xl shadow-lg hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
                  >
                    <span>שלח הודעה</span>
                    <Send size={20} className="transform rotate-180" />
                  </motion.button>
                </form>

                {/* Direct Contact */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600 mb-2">או התקשר ישירות:</p>
                    <a
                      href="tel:+972123456789"
                      className="inline-flex items-center gap-2 text-xl font-black text-[#C19A6B] hover:text-gray-900 transition-colors"
                    >
                      <Phone size={20} />
                      <span>03-123-4567</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 rounded-2xl p-6 mt-6 border border-gray-200">
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-600">סוג נכס:</span>
                    <span className="font-bold text-gray-900">{property.buildingType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-600">זמין מ:</span>
                    <span className="font-bold text-gray-900">{property.availableFrom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-600">מיקום:</span>
                    <span className="font-bold text-gray-900">{property.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
