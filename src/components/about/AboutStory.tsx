'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function AboutStory() {
  const storyRef = useRef(null);
  const storyInView = useInView(storyRef, { once: true, amount: 0.3 });

  return (
    <motion.section
      ref={storyRef}
      className="story-section"
      initial={{ opacity: 0 }}
      animate={storyInView ? { opacity: 1 } : {}}
    >
      <div className="story-container">
        <motion.h2
          className="section-title"
          initial={{ y: 30, opacity: 0 }}
          animate={storyInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          הסיפור שלנו
        </motion.h2>
        <motion.div
          className="story-content"
          initial={{ y: 30, opacity: 0 }}
          animate={storyInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p>
            החלום התחיל לפני למעלה מעשרים שנה, כשהבנו שהשוק זקוק לגישה חדשה - שירות שמשלב
            מקצוענות ברמה הגבוהה ביותר עם יחס אישי ואנושי. היום, אנחנו גאים להיות אחת מחברות
            הנדל"ן המובילות בחולון ובת ים, עם מאות לקוחות מרוצים ומוניטין שנבנה עסקה אחר עסקה.
          </p>
          <p>
            הצוות שלנו מורכב ממומחי נדל"ן מנוסים, שכל אחד מהם מביא ידע ייחודי ותשוקה אמיתית
            לעזור ללקוחות למצוא את הבית המושלם או ההשקעה הנכונה. אנחנו לא רק מתווכים - אנחנו
            שותפים למסע שלכם.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
