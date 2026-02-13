'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

export default function AboutExpertise() {
  const expertiseRef = useRef(null);
  const expertiseInView = useInView(expertiseRef, { once: true, amount: 0.3 });

  return (
    <motion.section
      ref={expertiseRef}
      className="expertise-section"
      initial={{ opacity: 0 }}
      animate={expertiseInView ? { opacity: 1 } : {}}
    >
      <div className="expertise-container">
        <div className="expertise-grid">
          {/* Text Content */}
          <motion.div
            className="expertise-content"
            initial={{ x: 50, opacity: 0 }}
            animate={expertiseInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">מומחים בנדל"ן בחולון</h2>
            <div className="expertise-text">
              <p>
                המשרד שלנו פועל בלב חולון ומתמחה בשיווק נדל"ן בחולון בלבד. ההכרות העמוקה עם השכונות, סוגי הבניינים, מחירי השוק והביקושים מאפשרת לנו לבצע תמחור מדויק ולהביא את הנכס לקהל היעד המתאים.
              </p>
              <p>
                אנחנו עובדים יום-יום עם מוכרים, קונים, משכירים ושוכרים בעיר, ולכן מכירים את השוק מבפנים – החל מדירות יד שנייה, דרך דירות חדשות ועד נכסים להשקעה. הניסיון המקומי שלנו מאפשר לנו להוביל עסקאות בצורה חכמה, מהירה ומדויקת יותר.
              </p>
              <p>
                אם אתם מחפשים דירה למכירה בחולון, דירה להשכרה בחולון או רוצים למכור נכס בעיר – אתם צריכים צוות שמכיר כל רחוב, כל שכונה וכל הזדמנות.
              </p>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            className="expertise-image"
            initial={{ x: -50, opacity: 0 }}
            animate={expertiseInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Image
              src="/7.png"
              alt="מומחיות מקומית בחולון"
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
