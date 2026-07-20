'use client';

import { m } from 'framer-motion';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

// Company line (Organization schema): +972-52-384-7291.
const WHATSAPP_URL = `https://wa.me/972523847291?text=${encodeURIComponent(
  'שלום, אשמח לקבל מידע נוסף על שירותי התיווך שלכם',
)}`;

export default function AboutCTA() {
  return (
    <section className="relative py-20 md:py-24 w-full overflow-hidden bg-[#051150]" dir="rtl">
      <m.div
        className="relative z-10 max-w-3xl mx-auto px-6 text-center flex flex-col items-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >

        <h2 className="font-caramel text-3xl md:text-5xl font-black text-white mb-4">
          רוצים למכור, לקנות או להשכיר בחולון?
        </h2>

        <p className="text-lg md:text-xl text-white/85 leading-relaxed mb-10 max-w-2xl">
          הצוות המקצועי שלנו כאן כדי ללוות אתכם בכל שלב – משלב החיפוש הראשוני ועד לסגירת העסקה. דברו איתנו ונתחיל.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/#contact"
            className="flex items-center gap-3 px-8 py-4 rounded-full text-white font-bold shadow-lg transition-all hover:-translate-y-0.5"
            style={{ background: '#354AC4' }}
          >
            <Phone size={20} strokeWidth={2.5} />
            <span>צרו קשר</span>
          </Link>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-white font-bold shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#1fb855]"
          >
            <FaWhatsapp size={22} />
            <span>וואטסאפ</span>
          </a>
        </div>
      </m.div>
    </section>
  );
}
