'use client';

import React from 'react';
import Link from 'next/link';
import Hero from '@/components/layout/Hero';
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
    image: '/images/buildings.jpeg',
    date: '2024-02-15',
    category: 'משקיעים זרים',
    readTime: '8 דקות קריאה',
    tags: ['Israel Real Estate Investment', 'Foreign Investors', 'Property Management', 'תושבי חוץ']
  },
  {
    id: 'selling-alone',
    title: 'למכור לבד? כשה"חיסכון" בתיווך עולה לכם עשרות אלפי שקלים',
    description: 'אין תחושה מפתה יותר מזו: החלטתם למכור את הדירה, עשיתם חישוב מהיר במחשבון, ואמרתם לעצמכם: "למה שנשלם 2% למתווך? נעלה מודעה ליד2, נראה את הבית פעמיים בשבוע, והכסף יישאר בכיס שלנו". על הנייר? זה נשמע גאוני. בין אם אתם מוכרים דירה בקרית שרת בחולון או דירת גן בבת ים, המחשבה הראשונה היא תמיד לחסוך בפועל. זה הרגע שבו הסיוט מתחיל. הטלפון לא מפסיק לצלצל בשעות לא סבירות, אנשים קובעים ולא מגיעים, אלו שכן מגיעים זורקים הערות מעליבות על הנכס שלכם, וההצעות שאתם מקבלים רחוקות שנות אור ממה שחשבתם.',
    image: '/images/car.jpeg',
    date: '2024-02-14',
    category: 'קניה ומכירה',
    readTime: '7 דקות קריאה',
    tags: ['מכירת דירה', 'תיווך נדל"ן', 'הערכת שווי נכס', 'מכירה עצמאית']
  }
];

export default function ArticlesPage() {
  return (
    <div className="articles-page" dir="rtl">
      {/* Hero with Background Image */}
      <Hero
        img="/images/hero/second-hero.jpg"
        staticTitle="מאמרים ומדריכים"
        centered={true}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      <div className="articles-container">

        {/* <p className="articles-subtitle">
          ידע מקצועי ותובנות מעולם הנדל"ן בישראל
        </p>

        <div className="categories">
          <button className="category-btn active">הכל</button>
          <button className="category-btn">משקיעים זרים</button>
          <button className="category-btn">קניה ומכירה</button>
          <button className="category-btn">ניהול נכסים</button>
          <button className="category-btn">התחדשות עירונית</button>
        </div> */}

        {/* Articles Grid */}
        <div className="articles-grid">
          {articles.map((article) => (
            <article key={article.id} className="article-card">
              <Link href={`/articles/${article.id}`} className="article-image-container">
                <img
                  src={article.image}
                  alt={article.title}
                  className="article-image"
                />
                <span className="category-badge">{article.category}</span>
              </Link>

              <div className="article-content">
                <div className="article-meta">
                  <span className="article-date">
                    {new Date(article.date).toLocaleDateString('he-IL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="separator">•</span>
                  <span className="read-time">{article.readTime}</span>
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
                      {tag}
                    </span>
                  ))}
                </div>

                <Link href={`/articles/${article.id}`} className="read-more">
                  קרא עוד ←
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section
        <section className="articles-cta">
          <h2>רוצים לקבל מאמרים חדשים ישירות למייל?</h2>
          <p>הצטרפו לניוזלטר שלנו וקבלו תובנות ועדכונים מעולם הנדל"ן</p>
          <div className="newsletter-form">
            <input
              type="email"
              placeholder="הכניסו את כתובת המייל שלכם"
              className="newsletter-input"
            />
            <button className="newsletter-btn">הרשמה</button>
          </div>
        </section> */}
      </div>
    </div>
  );
}
