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
      className="relative w-full py-14 md:py-32 bg-[#faf7f2]"
    >
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black text-[#1c3664] mb-6 uppercase tracking-tight">
            בואו נדבר
          </h2>
          <p className="text-xl md:text-2xl text-slate-500 font-semibold max-w-3xl mx-auto">
            השאיר פרטים ונחזור אליכם בהקדם האפשרי
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
            className="bg-white rounded-3xl p-6 md:p-8 lg:p-12 shadow-xl border border-slate-200 lg:order-2"
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
              className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200 h-[300px] md:h-[400px] lg:flex-1 lg:min-h-[500px] relative"
              style={{ isolation: 'isolate' }}
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
              className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 space-y-4 md:space-y-6"
            >
              <h3 className="text-2xl font-black text-[#1c3664] mb-6 uppercase tracking-tight">
                פרטי התקשרות
              </h3>

              {/* Phone */}
              <div className="flex items-start gap-4 group">
                <div className="bg-[#1c3664]/10 p-4 rounded-2xl group-hover:bg-[#1c3664] transition-all duration-300">
                  <Phone size={24} className="text-[#1c3664] group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-400 font-semibold mb-1">טלפון</p>
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
                  <p className="text-sm text-slate-400 font-semibold mb-1">דוא״ל</p>
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
                  <p className="text-sm text-slate-400 font-semibold mb-1">כתובת</p>
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