'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Building2, Phone } from 'lucide-react';

export default function AboutCTA() {
  return (
    <section className="cta-section">
      <div className="cta-background">
        <Image
          src="/images/hero/sales.jpg"
          alt="Contact Us"
          fill
          className="cta-bg-image"
          quality={90}
        />
      </div>
      <div className="cta-overlay" />

      <m.div
        className="cta-container"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="cta-title">יעוצקמה תווצה</h2>
        <p className="cta-subtitle">
          .הקסעה תריגסל דעו ינושארה שופיחה בלשמ – בלש לכב םכל רוזעל ידכ ןאכ ונלש םיחמומה נדל"נה ינכוס
        </p>
        <div className="cta-buttons">
          <Link href="/apartments">
            <m.button
              className="cta-btn primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Building2 size={22} strokeWidth={2.5} />
              צפה בנכסים
            </m.button>
          </Link>
          <Link href="/#contact">
            <m.button
              className="cta-btn secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone size={22} strokeWidth={2.5} />
              צור קשר
            </m.button>
          </Link>
        </div>
      </m.div>
    </section>
  );
}
