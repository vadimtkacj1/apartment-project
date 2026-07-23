"use client";
import React, { useState, useEffect, useRef } from 'react';
import { m, useInView } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';
import ContactFormFields from './ContactFormFields';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import dynamic from 'next/dynamic';

const MapPlaceholder = () => (
  <div style={{ height: '100%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <span>טוען מפה...</span>
  </div>
);

// Dynamically import ContactMap with SSR disabled
const ContactMap = dynamic(() => import('./ContactMap'), {
  ssr: false,
  loading: MapPlaceholder,
});

interface Owner {
  id: number;
  name: string;
  title: string;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
}

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
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);

  // Mount the Google Map only when the section approaches the viewport — the
  // Maps API is ~190KB of JS and was loading (and executing) on initial page
  // load even though the map sits at the bottom of the page.
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapNearViewport = useInView(mapContainerRef, { once: true, margin: '600px 0px' });

  useEffect(() => {
    fetchContactInfo();
    fetchOwners();
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

  const fetchOwners = async () => {
    try {
      const response = await fetch('/api/owners', {
        cache: 'no-store',
      });
      if (response.ok) {
        const data = await response.json();
        setOwners(data);
      }
    } catch (error) {
      console.error('Error fetching owners:', error);
    }
  };

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
      className="relative w-full py-16 md:py-20 bg-white"
    >
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 z-10">
        {/* Section Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <SectionEyebrow>צרו קשר</SectionEyebrow>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-[#051150] mb-6" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>
            בואו נדבר
          </h2>
          <p className="text-xl md:text-2xl text-slate-500 font-semibold max-w-3xl mx-auto">
            השאיר פרטים ונחזור אליכם בהקדם האפשרי
          </p>
        </m.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Right Column - Contact Form */}
          <m.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl p-6 md:p-8 lg:p-12 shadow-elev-1 border border-slate-200 lg:order-2 lg:self-start"
          >
            <ContactFormFields idPrefix="contact-" />
          </m.div>

          {/* Left Column - Map & Contact Info */}
          <div className="flex flex-col space-y-6 md:space-y-8 lg:order-1">
            {/* Map */}
            <m.div
              ref={mapContainerRef}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl overflow-hidden shadow-elev-1 border border-slate-200 h-[300px] md:h-[400px] lg:flex-1 lg:min-h-[500px] relative"
              style={{ isolation: 'isolate' }}
            >
              {mapNearViewport ? (
                <ContactMap
                  latitude={mapLatitude}
                  longitude={mapLongitude}
                  address={address}
                  city={city}
                />
              ) : (
                <MapPlaceholder />
              )}
            </m.div>

            {/* Contact Info Cards */}
            <m.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-elev-1 border border-slate-200 space-y-6"
            >
              <h3 className="text-2xl font-black text-[#051150] mb-6" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>
                פרטי התקשרות
              </h3>

              {/* Display all owners */}
              {owners.length > 0 ? (
                owners.map((owner, index) => (
                  <div key={owner.id} className={`space-y-4 ${index > 0 ? 'pt-6 border-t border-slate-200' : ''}`}>
                    {/* Owner Name */}
                    <div className="mb-2">
                      <p className="text-lg font-bold text-[#051150]">{owner.name}</p>
                      {owner.title && <p className="text-sm text-slate-600">{owner.title}</p>}
                    </div>

                    {/* Phone */}
                    {owner.phone && (
                      <div className="flex items-start gap-4 group">
                        <div className="bg-[#354ac4]/10 p-3 rounded-xl group-hover:bg-[#354ac4] transition-all duration-300">
                          <Phone size={24} className="text-[#354ac4] group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-600 font-semibold mb-1">טלפון</p>
                          <a
                            href={`tel:${owner.phone.replace(/[^0-9+]/g, '')}`}
                            className="text-lg font-bold text-gray-900 hover:text-[#354ac4] transition-colors underline decoration-gray-400 hover:decoration-[#354ac4] underline-offset-2"
                          >
                            <span dir="ltr">{owner.phone}</span>
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    {owner.email && (
                      <div className="flex items-start gap-4 group">
                        <div className="bg-[#354ac4]/10 p-3 rounded-xl group-hover:bg-[#354ac4] transition-all duration-300">
                          <Mail size={24} className="text-[#354ac4] group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-600 font-semibold mb-1">דוא״ל</p>
                          <a
                            href={`mailto:${owner.email}`}
                            className="text-lg font-bold text-gray-900 hover:text-[#354ac4] transition-colors break-all underline decoration-gray-400 hover:decoration-[#354ac4] underline-offset-2"
                          >
                            <span dir="ltr">{owner.email}</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-600">טוען פרטי התקשרות...</p>
              )}

              {/* Address - Same for all */}
              <div className="flex items-start gap-4 group pt-6 border-t border-slate-200">
                <div className="bg-[#354ac4]/10 p-3 rounded-xl group-hover:bg-[#354ac4] transition-all duration-300">
                  <MapPin size={24} className="text-[#354ac4] group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-600 font-semibold mb-1">כתובת</p>
                  <p className="text-lg font-bold text-gray-900">
                    {address}, {city}
                  </p>
                </div>
              </div>
            </m.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;