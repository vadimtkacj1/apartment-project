"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';
import ContactFormFields from './ContactFormFields';
import dynamic from 'next/dynamic';

// Dynamically import ContactMap with SSR disabled
const ContactMap = dynamic(() => import('./ContactMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '100%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span>טוען מפה...</span>
    </div>
  )
});

interface ContactInfo {
  phone: string;
  phoneLink: string;
  email: string;
  emailLink: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  mapUrl: string | null;
  weekdayHours: string;
  fridayHours: string;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
}

const ContactForm: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/contact-info', {
        cache: 'no-store',
      });
      if (response.ok) {
        const data = await response.json();
        setContactInfo(data);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const phone = contactInfo?.phone || '03-123-4567';
  const phoneLink = contactInfo?.phoneLink || 'tel:+97231234567';
  const email = contactInfo?.email || 'info@zamir-realestate.co.il';
  const emailLink = contactInfo?.emailLink || 'mailto:info@zamir-realestate.co.il';
  const address = contactInfo?.address || 'חולון';
  const city = contactInfo?.city || 'בת ים, ישראל';
  const latitude = contactInfo?.latitude ?? null;
  const longitude = contactInfo?.longitude ?? null;
  const mapLatitude = latitude ?? 32.01624;
  const mapLongitude = longitude ?? 34.73625;

  return (
    <section
      id="contact"
      dir="rtl"
      className="relative w-full py-14 md:py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--warm-sand)' }}
    >
      {/* ─── Decorative SVG Background Elements (matching site style) ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>

        {/* Top-left cluster: large circle + diagonal lines */}
        <svg
          className="absolute -top-10 -left-10"
          width="220" height="220"
          viewBox="0 0 220 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.65 }}
        >
          <circle cx="60" cy="60" r="50" stroke="#1c3664" strokeWidth="3" fill="none" />
          <circle cx="60" cy="60" r="12" fill="#1c3664" />
          <line x1="110" y1="60" x2="220" y2="60" stroke="#1c3664" strokeWidth="2" />
          <line x1="110" y1="60" x2="180" y2="130" stroke="#1c3664" strokeWidth="2" />
          <circle cx="220" cy="60" r="6" fill="#1c3664" />
          <circle cx="180" cy="130" r="6" fill="#1c3664" />
        </svg>

        {/* Top-right: connected dots with lines (like the screenshot) */}
        <svg
          className="absolute top-8 right-8"
          width="260" height="200"
          viewBox="0 0 260 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.65 }}
        >
          <circle cx="200" cy="40" r="40" stroke="#1c3664" strokeWidth="3" fill="none" />
          <circle cx="200" cy="40" r="10" fill="#1c3664" />
          <line x1="200" y1="80" x2="130" y2="150" stroke="#1c3664" strokeWidth="2" />
          <line x1="160" y1="40" x2="60" y2="40" stroke="#1c3664" strokeWidth="2" />
          <circle cx="130" cy="150" r="7" fill="#1c3664" />
          <circle cx="60" cy="40" r="7" fill="#1c3664" />
          <line x1="60" y1="40" x2="10" y2="100" stroke="#1c3664" strokeWidth="2" />
          <circle cx="10" cy="100" r="5" fill="#1c3664" />
        </svg>

        {/* Bottom-left: small scattered dots + diagonal line */}
        <svg
          className="absolute bottom-12 left-6"
          width="200" height="180"
          viewBox="0 0 200 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.6 }}
        >
          <circle cx="30" cy="150" r="28" stroke="#1c3664" strokeWidth="2.5" fill="none" />
          <circle cx="30" cy="150" r="8" fill="#1c3664" />
          <line x1="58" y1="150" x2="160" y2="50" stroke="#1c3664" strokeWidth="2" />
          <circle cx="160" cy="50" r="7" fill="#1c3664" />
          <line x1="160" y1="50" x2="195" y2="20" stroke="#1c3664" strokeWidth="2" />
          <circle cx="195" cy="20" r="5" fill="#1c3664" />
        </svg>

        {/* Bottom-right: medium circle with radiating lines */}
        <svg
          className="absolute -bottom-8 -right-8"
          width="240" height="240"
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.6 }}
        >
          <circle cx="180" cy="180" r="55" stroke="#1c3664" strokeWidth="3" fill="none" />
          <circle cx="180" cy="180" r="14" fill="#1c3664" />
          <line x1="125" y1="180" x2="30" y2="180" stroke="#1c3664" strokeWidth="2" />
          <line x1="180" y1="125" x2="100" y2="45" stroke="#1c3664" strokeWidth="2" />
          <circle cx="30" cy="180" r="6" fill="#1c3664" />
          <circle cx="100" cy="45" r="6" fill="#1c3664" />
          <line x1="100" y1="45" x2="40" y2="10" stroke="#1c3664" strokeWidth="2" />
          <circle cx="40" cy="10" r="5" fill="#1c3664" />
        </svg>

        {/* Center-left: subtle large faint circle */}
        <svg
          className="absolute top-1/2 -translate-y-1/2 -left-20"
          width="180" height="180"
          viewBox="0 0 180 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.35 }}
        >
          <circle cx="90" cy="90" r="85" stroke="#1c3664" strokeWidth="4" fill="none" />
        </svg>

        {/* Center-right: subtle large faint circle */}
        <svg
          className="absolute top-1/3 -right-16"
          width="150" height="150"
          viewBox="0 0 150 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.35 }}
        >
          <circle cx="75" cy="75" r="70" stroke="#1c3664" strokeWidth="4" fill="none" />
        </svg>

        {/* Mid-top: floating small dot chain */}
        <svg
          className="absolute top-20 left-1/3"
          width="120" height="60"
          viewBox="0 0 120 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.55 }}
        >
          <circle cx="10" cy="30" r="5" fill="#1c3664" />
          <line x1="15" y1="30" x2="55" y2="10" stroke="#1c3664" strokeWidth="1.5" />
          <circle cx="60" cy="8" r="5" fill="#1c3664" />
          <line x1="65" y1="8" x2="110" y2="40" stroke="#1c3664" strokeWidth="1.5" />
          <circle cx="115" cy="42" r="5" fill="#1c3664" />
        </svg>

      </div>

      {/* Original soft blur blobs (kept, just slightly adjusted z-index) */}
      <div className="absolute inset-0 opacity-5" style={{ zIndex: 0 }}>
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#1c3664] rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-[#1c3664] rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12" style={{ zIndex: 2 }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tight">
            בואו נדבר
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 font-semibold max-w-3xl mx-auto">
            השאירו פרטים ונחזור אליכם בהקדם האפשרי
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl p-6 md:p-8 lg:p-12 shadow-2xl border border-gray-100 lg:order-2"
          >
            <ContactFormFields idPrefix="contact-" />
          </motion.div>

          {/* Left Column - Map & Contact Info */}
          <div className="flex flex-col space-y-6 md:space-y-8 lg:order-1">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 h-[300px] md:h-[400px] lg:flex-1 lg:min-h-[500px] relative"
              style={{ zIndex: 0, isolation: 'isolate' }}
            >
              <ContactMap
                latitude={mapLatitude}
                longitude={mapLongitude}
                address={address}
                city={city}
              />
            </motion.div>

            {/* Contact Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 space-y-4 md:space-y-6"
            >
              <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">
                פרטי התקשרות
              </h3>

              {/* Phone */}
              <div className="flex items-start gap-4 group">
                <div className="bg-[#1c3664]/10 p-4 rounded-2xl group-hover:bg-[#1c3664] transition-all duration-300">
                  <Phone size={24} className="text-[#1c3664] group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-semibold mb-1">טלפון</p>
                  <a href={phoneLink} className="text-lg font-bold text-gray-900 hover:text-[#1c3664] transition-colors">
                    {phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 group">
                <div className="bg-[#1c3664]/10 p-4 rounded-2xl group-hover:bg-[#1c3664] transition-all duration-300">
                  <Mail size={24} className="text-[#1c3664] group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-semibold mb-1">דוא״ל</p>
                  <a href={emailLink} className="text-lg font-bold text-gray-900 hover:text-[#1c3664] transition-colors break-all">
                    {email}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4 group">
                <div className="bg-[#1c3664]/10 p-4 rounded-2xl group-hover:bg-[#1c3664] transition-all duration-300">
                  <MapPin size={24} className="text-[#1c3664] group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-semibold mb-1">כתובת</p>
                  <p className="text-lg font-bold text-gray-900">
                    {address}, {city}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;