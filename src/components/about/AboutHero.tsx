'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

export default function AboutHero() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });

  return (
    <motion.section
      ref={heroRef}
      className="hero-section"
      initial={{ opacity: 0 }}
      animate={heroInView ? { opacity: 1 } : {}}
      transition={{ duration: 1 }}
    >
      <div className="hero-background">
        <Image
          src="/images/hero/aboutus.png"
          alt="Our Team"
          fill
          className="hero-bg-image"
          priority
          quality={90}
        />
      </div>

      <div className="hero-overlay" />

      <div className="hero-content">
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={heroInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-title"
        >
          אודות החברה
        </motion.h1>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={heroInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hero-description"
        >
          <p>מובילים את שוק הנדל״ן בחולון ובת ים</p>
          <p>עם 20+ שנות ניסיון, מקצוענות ושירות ללא פשרות</p>
        </motion.div>
      </div>
    </motion.section>
  );
}
