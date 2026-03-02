'use client';

import React from 'react';
import Link from 'next/link';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import './articles.css';

interface Article {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  readTime: string;
  tags: string[];
}

const articles: Article[] = [
  {
    id: 'foreign-investors',
    title: 'נדל"ן בשלט רחוק: כשאתם בחו"ל והלב רוצה',
    description: 'אין תחושה מתסכלת יותר מזו: אתם גרים מעבר לים, עובדים קשה, ורואים איך מחירי הנדל"ן בישראל ממשיכים לטוס למעלה בלעדיכם. אתם רוצים לקנות דירה להשקעה בחולון, דירה מול הים בבת ים, או ראשל"צ ולהבטיח את העתיד של הילדים, אבל המרחק משתק. איך אפשר לקנות דירה בלי לראות אותה? מי ישפץ אותה כשהקבלן יבריז? ומי ירדוף אחרי השוכר בראשון לחודש כשאתם נמצאים באזור זמן אחר לגמרי? באותו רגע, הפחד מניצול או מהונאה גובר על הרצון להשקיע. הכסף נשאר בבנק ונשחק. אז רגע לפני שאתם מוותרים על החלום לדירה בארץ - עצרו רגע. אנחנו במשרד מבינים את המצוקה הזו בדיוק. כבר שנים שאנחנו משמשים כ"עיניים והידיים" של תושבי חוץ ומשקיעים.',
    image: '/images/balconies-blue-sky-clouds-part-residential-building-israel-balconies-blue-sky-clouds-part-199519995.webp',
    date: '2026-01-15',
    category: 'משקיעים זרים',
    readTime: '8 דקות קריאה',
    tags: ['Israel Real Estate Investment', 'Foreign Investors', 'Property Management', 'תושבי חוץ']
  },
  {
    id: 'selling-alone',
    title: 'למכור לבד? כשה"חיסכון" בתיווך עולה לכם עשרות אלפי שקלים',
    description: 'אין תחושה מפתה יותר מזו: החלטתם למכור את הדירה, עשיתם חישוב מהיר במחשבון, ואמרתם לעצמכם: "למה שנשלם 2% למתווך? נעלה מודעה ליד2, נראה את הבית פעמיים בשבוע, והכסף יישאר בכיס שלנו". על הנייר? זה נשמע גאוני. בין אם אתם מוכרים דירה בקרית שרת בחולון או דירת גן בבת ים, המחשבה הראשונה היא תמיד לחסוך בפועל. זה הרגע שבו הסיוט מתחיל. הטלפון לא מפסיק לצלצל בשעות לא סבירות, אנשים קובעים ולא מגיעים, אלו שכן מגיעים זורקים הערות מעליבות על הנכס שלכם, וההצעות שאתם מקבלים רחוקות שנות אור ממה שחשבתם.',
    image: '/images/69ef77086aacb86d69234e7084c060e7.jpg',
    date: '2026-01-14',
    category: 'קניה ומכירה',
    readTime: '7 דקות קריאה',
    tags: ['מכירת דירה', 'תיווך נדל"ן', 'הערכת שווי נכס', 'מכירה עצמאית']
  }
];

export default function ArticlesPage() {
  return (
    <div className="articles-page" dir="rtl">
      {/* Hero with Background Image */}
      <SecondaryHero
        img="/7.jpg"
        title="מאמרים ומדריכים"
        centered={true}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      <div className="articles-container">
        {/* Articles Grid */}
        <div className="articles-grid">
          {articles.map((article, index) => (
            <article key={article.id} className="article-card" style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Decorative corner accent */}
              <div className="card-accent"></div>

              <Link href={`/articles/${article.id}`} className="article-image-container">
                <div className="image-overlay"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.image}
                  alt={article.title}
                  className="article-image"
                  loading="lazy"
                />
                <span className="category-badge">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="badge-icon">
                    <path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {article.category}
                </span>
              </Link>

              <div className="article-content">
                <div className="article-meta">
                  <span className="article-date">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="meta-icon">
                      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M7 3.5V7L9.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {new Date(article.date).toLocaleDateString('he-IL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="separator">•</span>
                  <span className="read-time">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="meta-icon">
                      <path d="M2 3h10a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M4 1v2M10 1v2M1 6h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {article.readTime}
                  </span>
                </div>

                <h2 className="article-title">
                  <Link href={`/articles/${article.id}`}>
                    {article.title}
                  </Link>
                </h2>

                <p className="article-description">
                  {article.description}
                </p>

                <div className="article-tags">
                  {article.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="tag-icon">
                        <path d="M2 2L6 1L10 2L11 6L10 10L6 11L2 10L1 6L2 2Z" stroke="currentColor" strokeWidth="1"/>
                      </svg>
                      {tag}
                    </span>
                  ))}
                </div>

                <Link href={`/articles/${article.id}`} className="read-more">
                  <span>קרא עוד</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="arrow-icon">
                    <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
