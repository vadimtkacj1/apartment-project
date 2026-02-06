'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Award,
  Users,
  Building2,
  Star,
  Phone,
  Mail,
  CheckCircle2
} from 'lucide-react';
import './about.css';

// Stats for the company
const stats = [
  { icon: Award, value: '20+', label: 'שנות ניסיון' },
  { icon: Users, value: '1000+', label: 'לקוחות מרוצים' },
  { icon: Building2, value: '500M+', label: 'שווי עסקאות' },
  { icon: Star, value: '98%', label: 'שביעות רצון' }
];

// Owners
const owners = [
  {
    id: 1,
    name: 'דוד כהן',
    title: 'מייסד ומנכ"ל',
    image: '/images/owner1.jpg',
    phone: '*8851',
    email: 'david@example.com',
    description: 'עם ניסיון של למעלה מ-20 שנה בתחום הנדל"ן, דוד הקים את החברה מתוך חזון ליצור שירות מקצועי ואנושי שמעמיד את הלקוח במרכז.'
  },
  {
    id: 2,
    name: 'שרה לוי',
    title: 'שותפה ומנהלת מכירות',
    image: '/images/owner2.jpg',
    phone: '*8851',
    email: 'sarah@example.com',
    description: 'שרה מביאה ניסיון עשיר בניהול צוותים ומכירות, עם דגש על בניית קשרי לקוחות ארוכי טווח ושירות ברמה הגבוהה ביותר.'
  }
];

// Team members
const team = [
  {
    id: 1,
    name: 'מיכאל אברהם',
    role: 'סוכן נדל"ן בכיר',
    image: '/images/agent1.jpg',
    specialty: 'דירות יוקרה'
  },
  {
    id: 2,
    name: 'רחל ברק',
    role: 'סוכנת נדל"ן',
    image: '/images/agent2.jpg',
    specialty: 'דירות משפחתיות'
  },
  {
    id: 3,
    name: 'יוסי דהן',
    role: 'סוכן נדל"ן',
    image: '/images/agent3.jpg',
    specialty: 'השקעות נדל"ן'
  },
  {
    id: 4,
    name: 'תמר גולן',
    role: 'סוכנת נדל"ן',
    image: '/images/agent4.jpg',
    specialty: 'דירות סטודיו'
  },
  {
    id: 5,
    name: 'אורי הרץ',
    role: 'סוכן נדל"ן',
    image: '/images/agent5.jpg',
    specialty: 'פנטהאוזים'
  }
];

export default function AboutPage() {
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const ownersRef = useRef(null);
  const teamRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const storyInView = useInView(storyRef, { once: true, amount: 0.3 });
  const ownersInView = useInView(ownersRef, { once: true, amount: 0.2 });
  const teamInView = useInView(teamRef, { once: true, amount: 0.2 });

  return (
    <div className="about-page" dir="rtl">
      {/* Hero Section */}
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

      {/* Story Section */}
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

      {/* Owners Section */}
      <motion.section
        ref={ownersRef}
        className="owners-section"
        initial={{ opacity: 0 }}
        animate={ownersInView ? { opacity: 1 } : {}}
      >
        <div className="owners-container">
          <h2 className="section-title">המייסדים שלנו</h2>

          <div className="owners-grid">
            {owners.map((owner, index) => (
              <motion.div
                key={owner.id}
                className="owner-card"
                initial={{ y: 50, opacity: 0 }}
                animate={ownersInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <div className="owner-image-wrapper">
                  <Image
                    src={owner.image}
                    alt={owner.name}
                    width={400}
                    height={400}
                    className="owner-image"
                  />
                </div>
                <div className="owner-info">
                  <h3 className="owner-name">{owner.name}</h3>
                  <p className="owner-title">{owner.title}</p>
                  <p className="owner-description">{owner.description}</p>
                  <div className="owner-contact">
                    <a href={`tel:${owner.phone}`} className="contact-btn">
                      <Phone size={18} />
                      {owner.phone}
                    </a>
                    <a href={`mailto:${owner.email}`} className="contact-btn">
                      <Mail size={18} />
                      צור קשר
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        ref={teamRef}
        className="team-section"
        initial={{ opacity: 0 }}
        animate={teamInView ? { opacity: 1 } : {}}
      >
        <div className="team-container">
          <h2 className="section-title">הצוות המקצועי</h2>
          <p className="section-subtitle">
            סוכני הנדל"ן המומחים שלנו כאן כדי לעזור לכם בכל שלב
          </p>

          <div className="team-grid">
            {team.map((member, index) => (
              <motion.div
                key={member.id}
                className="team-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={teamInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="team-image-wrapper">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="team-image"
                  />
                  <div className="team-overlay">
                    <button className="team-contact-btn">
                      <Phone size={18} />
                      צור קשר
                    </button>
                  </div>
                </div>
                <div className="team-info">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <span className="team-specialty">
                    <CheckCircle2 size={16} />
                    {member.specialty}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
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

        <motion.div
          className="cta-container"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="cta-title">מוכנים למצוא את הנכס המושלם?</h2>
          <p className="cta-subtitle">
            הצוות שלנו כאן כדי להפוך את החלום שלכם למציאות
          </p>
          <div className="cta-buttons">
            <Link href="/apartments">
              <motion.button
                className="cta-btn primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Building2 size={22} strokeWidth={2.5} />
                צפה בנכסים
              </motion.button>
            </Link>
            <Link href="/#contact">
              <motion.button
                className="cta-btn secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone size={22} strokeWidth={2.5} />
                צור קשר
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
