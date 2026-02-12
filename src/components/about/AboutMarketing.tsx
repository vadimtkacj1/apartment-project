'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Camera, Target, Users, Handshake } from 'lucide-react';

export default function AboutMarketing() {
  const marketingRef = useRef(null);
  const marketingInView = useInView(marketingRef, { once: true, amount: 0.3 });

  const features = [
    {
      icon: Camera,
      title: 'פרסום ממוקד באינטרנט וברשתות חברתיות',
      description: 'חשיפה מקסימלית לקהל היעד הרלוונטי'
    },
    {
      icon: Target,
      title: 'צילום מקצועי והצגת הנכס בצורה אטרקטיבית',
      description: 'מצגת איכותית שמושכת קונים ושוכרים'
    },
    {
      icon: Users,
      title: 'מאגר לקוחות פעילים המחפשים נכסים בחולון',
      description: 'התאמה ישירה לקונים ושוכרים רלוונטיים'
    },
    {
      icon: Handshake,
      title: 'ניהול משא ומתן מקצועי להשגת המחיר הטוב ביותר',
      description: 'ניסיון והתמחות בסגירת עסקאות מוצלחות'
    }
  ];

  return (
    <motion.section
      ref={marketingRef}
      className="marketing-section"
      initial={{ opacity: 0 }}
      animate={marketingInView ? { opacity: 1 } : {}}
    >
      <div className="marketing-container">
        <div className="marketing-grid">
          {/* Text Content */}
          <motion.div
            className="marketing-content"
            initial={{ x: 50, opacity: 0 }}
            animate={marketingInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">שיווק נדל&quot;ן בגישה מתקדמת</h2>
            <p className="marketing-intro">
              שיווק נכס היום דורש הרבה יותר מלוח מודעות. אנחנו משלבים שיטות שיווק מתקדמות כדי להגיע לקונים ולשוכרים המתאימים:
            </p>

            <div className="marketing-features">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="marketing-feature"
                  initial={{ y: 20, opacity: 0 }}
                  animate={marketingInView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <div className="feature-icon">
                    <feature.icon size={28} />
                  </div>
                  <div className="feature-text">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="marketing-footer">
              השילוב בין ניסיון מקומי, שיווק חכם וליווי אישי יוצר תהליך יעיל שמוביל לעסקאות מוצלחות.
            </p>
          </motion.div>

          {/* Image */}
          <motion.div
            className="marketing-image"
            initial={{ x: -50, opacity: 0 }}
            animate={marketingInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Image
              src="/images/hero/other-hero.jpeg"
              alt="שיווק נדלן בגישה מתקדמת"
              width={600}
              height={400}
              className="rounded-xl"
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
