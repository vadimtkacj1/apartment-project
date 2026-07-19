'use client';

import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import Image from 'next/image';

export default function AboutHero() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });

  return (
    <m.section
      ref={heroRef}
      className="hero-section"
      initial={{ opacity: 0 }}
      animate={heroInView ? { opacity: 1 } : {}}
      transition={{ duration: 1 }}
    >
      <div className="hero-background">
        <Image
          src="/images/hero/aboutus.webp"
          alt="הצוות שלנו"
          fill
          className="hero-bg-image"
          priority
          quality={80}
        />
      </div>

      <div className="hero-overlay" />

      <div className="hero-content">
        <m.h1
          initial={{ y: 50, opacity: 0 }}
          animate={heroInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-title"
        >
          Aiterra
        </m.h1>
        <m.div
          initial={{ y: 50, opacity: 0 }}
          animate={heroInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hero-description"
        >
          <p>Aiterra הוא משרד תיווך ושיווק נדל"ן המתמחה בשיווק, מכירה והשכרה של דירות ונכסים בחולון והסביבה.</p>
          <p>עם ניסיון מצטבר של שנים בעולם הנדל"ן, הכרות עמוקה עם השוק המקומי ושיטות עבודה מוכחות, אנחנו מלווים כל לקוח באופן אישי ומקצועי עד להשלמת עסקה בתנאים הטובים ביותר.</p>
          <p>אם אתם מחפשים דירה למכירה בחולון, דירה להשכרה בחולון או רוצים למכור נכס בעיר – אתם צריכים צוות שמכיר כל רחוב, כל שכונה וכל הזדמנות.</p>
        </m.div>
      </div>
    </m.section>
  );
}
