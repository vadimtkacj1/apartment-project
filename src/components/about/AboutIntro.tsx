'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

const stats = [
  { 
    icon: '/3d-render-hand-throw-paper-plane.svg', 
    value: '20+', 
    label: 'שנות ניסיון' 
  },
  { 
    icon: '/3d-render-handshake-icon.svg', 
    value: '1000+', 
    label: 'לקוחות מרוצים' 
  },
  { 
    icon: '/3d-hand-hold-money-bag-sack.svg', 
    value: '500M+', 
    label: 'שווי עסקאות' 
  },
  { 
    icon: '/3d-render-thumb-up-sign.svg', 
    value: '98%', 
    label: 'שביעות רצון' 
  }
];

export default function AboutIntro() {
  const introRef = useRef(null);
  const introInView = useInView(introRef, { once: true, amount: 0.3 });

  return (
    <motion.section
      ref={introRef}
      className="intro-section"
      initial={{ opacity: 0 }}
      animate={introInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
    >
      <div className="intro-container">
        
        {/* Main Text Content */}
        <motion.div
          className="intro-content"
          initial={{ y: 30, opacity: 0 }}
          animate={introInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="intro-title">רם נכסים חיים ענבי</h1>
          <p className="intro-subtitle">
            משרד תיווך ושיווק נדל"ן המתמחה בשיווק, מכירה והשכרה של דירות ונכסים בחולון והסביבה
          </p>
          <p className="intro-description">
            עם ניסיון מצטבר של למעלה מ-20 שנה בעולם הנדל"ן, הכרות עמוקה עם השוק המקומי ושיטות עבודה מוכחות,
            אנחנו מלווים כל לקוח באופן אישי ומקצועי עד להשלמת עסקה בתנאים הטובים ביותר.
          </p>
        </motion.div>

        {/* Stats Grid - Icons without background cards */}
        <motion.div
          className="stats-grid"
          initial={{ y: 30, opacity: 0 }}
          animate={introInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
            marginTop: '4rem'
          }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={introInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              // Inline styles to ensure no background card
              style={{
                background: 'transparent',
                boxShadow: 'none',
                border: 'none',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {/* Icon Container */}
              <div 
                className="stat-icon" 
                style={{ 
                    width: '140px', 
                    height: '140px', 
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
              >
                <Image 
                  src={stat.icon} 
                  alt={stat.label} 
                  width={140} 
                  height={140} 
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}