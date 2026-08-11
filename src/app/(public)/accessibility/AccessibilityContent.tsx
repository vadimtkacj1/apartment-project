'use client';

import React from 'react';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export default function AccessibilityContent() {
  return (
    <div className="article-page" dir="rtl">
      {/* Hero with Background Image */}
      <SecondaryHero
        img="/7.jpg"
        title="הצהרת נגישות"
        centered={true}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      <div className="accessibility-container">
        <article className="accessibility-content">
          {/* Main Content */}
          <div className="accessibility-body">

            {/* Introduction */}
            <section className="accessibility-section intro-section">
              <h2>הצהרת נגישות - רם שיווק נכסים & חיים ענבי</h2>
              <p className="lead-text">
                ב"רם שיווק נכסים & חיים ענבי", אנו רואים חשיבות עליונה במתן שירות שוויוני, מכבד ונגיש לכלל הלקוחות ובכלל זה לאנשים עם מוגבלויות. בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות תשנ"ח-1998 ולתקנות שהותקנו מכוחו, מושקעים מאמצים ומשאבים רבים בביצוע התאמות נגישות באתר האינטרנט במטרה לאפשר לכל גולש ולקוח להשתמש בשירותים המוצעים באופן עצמאי, נוח ושוויוני.
              </p>
              <p>
                אתר זה עומד בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג 2013. התאמות הנגישות בוצעו עפ"י המלצות התקן הישראלי (ת"י 5568) לנגישות תכנים באינטרנט ברמת AA ומסמך WCAG 2.1 הבינלאומי.
              </p>
            </section>

            {/* Accessibility Menu */}
            <section className="accessibility-section">
              <h2>תפריט הנגישות באתר</h2>
              <p>
                באתר מוטמע סרגל נגישות מתקדם המאפשר לגולשים להתאים את תצוגת האתר לצרכיהם האישיים. התפריט נפתח בלחיצה על אייקון הנגישות ומאפשר את הפעולות הבאות:
              </p>

              <div className="feature-box">
                <h3>התאמות תוכן וטקסט:</h3>
                <ul className="features-list">
                  <li>
                    <strong>שינוי גודל פונט:</strong> אפשרות להגדלה והקטנה של הטקסט באחוזים (עד 200%) מבלי לפגוע במבנה הדף.
                  </li>
                  <li>
                    <strong>פונט קריא:</strong> שינוי הגופן לגופן קריא וברור יותר המותאם לאנשים עם דיסלקציה או קשיי קריאה.
                  </li>
                  <li>
                    <strong>הדגשת רכיבים:</strong> הדגשת כותרות והדגשת קישורים לשיפור ההתמצאות.
                  </li>
                  <li>
                    <strong>ריווח:</strong> אפשרות לשינוי גובה שורה (Line Height) ומרווח בין אותיות (Letter Spacing) להקלה על הקריאה.
                  </li>
                  <li>
                    <strong>משקל הפונט:</strong> אפשרות לחיזוק והדגשת הטקסט.
                  </li>
                </ul>
              </div>

              <div className="feature-box">
                <h3>התאמות צבע ותצוגה:</h3>
                <ul className="features-list">
                  <li>
                    <strong>ניגודיות (קונטרסט):</strong> אפשרות לשינוי התצוגה ל"ניגודיות כהה", "ניגודיות בהירה" או "ניגודיות גבוהה" עבור לקויי ראייה.
                  </li>
                  <li>
                    <strong>התאמות צבע:</strong> אפשרות לשינוי רוויית הצבע (גבוהה/נמוכה) או מעבר לתצוגת "מונוכרום" (שחור-לבן).
                  </li>
                </ul>
              </div>
            </section>

            {/* Additional Features */}
            <section className="accessibility-section">
              <h2>פעולות נוספות לנגישות האתר</h2>
              <p>מעבר לתפריט הנגישות, האתר מותאם ומאפשר:</p>
              <ul className="simple-list">
                <li>ניווט מלא באמצעות מקלדת (Tab, Enter, חיצים).</li>
                <li>תמיכה בשימוש בקוראי מסך נפוצים.</li>
                <li>האתר רספונסיבי ומותאם לגלישה במכשירים ניידים (סמארטפונים) וטאבלטים.</li>
              </ul>
            </section>

            {/* Contact Methods */}
            <section className="accessibility-section">
              <h2>דרכי פנייה לבקשות והצעות לשיפור בנושא נגישות</h2>
              <p>
                אנו עושים את מירב המאמצים לשמור ולתחזק את האתר והשירות ברמה הטובה ביותר. יחד עם זאת, ייתכן ויתגלו חלקים באתר או תהליכים שטרם הונגשו בצורה מושלמת או שיש בהם תקלות טכניות. אם נתקלתם בבעיה, בקושי בגלישה או שיש לכם הצעה לשיפור, נשמח מאוד לשמוע מכם ולטפל בפנייה בהקדם.
              </p>
            </section>

            {/* Accessibility Coordinator */}
            <section className="accessibility-section contact-section">
              <h2>פרטי רכז הנגישות בארגון</h2>
              <div className="coordinator-details">
                <p><strong>שם בית העסק:</strong> רם שיווק נכסים & חיים ענבי</p>
                <p><strong>שם רכז הנגישות:</strong> רם מזרחי</p>
                <p><strong>דוא"ל:</strong> rammiz800@gmail.com</p>
                <p><strong>טלפון:</strong> 050-549-6626</p>
                <p><strong>כתובת:</strong> חנקין 83 חולון, ישראל</p>
              </div>
              <p className="contact-note">
                אנו זמינים לכל פנייה ונשתדל לתת מענה מתאים ומהיר ככל האפשר.
              </p>
            </section>

            {/* Declaration Date */}
            <section className="accessibility-section date-section">
              <p className="declaration-date">
                ההצהרה תקפה נכון לתאריך 17.02.2026
              </p>
            </section>

          </div>
        </article>
      </div>

      <style jsx>{`
        .accessibility-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 2rem 4rem;
          background: #faf7f2;
        }

        @media (min-width: 1920px) {
          .accessibility-container {
            max-width: 1600px;
            padding: 3rem 4rem 6rem;
          }
        }

        .accessibility-content {
          background: transparent;
          overflow: hidden;
        }

        .accessibility-body {
          padding: 0;
          direction: rtl;
          text-align: right;
          background: #faf7f2;
        }

        .accessibility-section {
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(28, 54, 100, 0.1);
        }

        .accessibility-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .intro-section {
          background: linear-gradient(135deg, rgba(28, 54, 100, 0.05) 0%, rgba(184, 130, 30, 0.05) 100%);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid rgba(28, 54, 100, 0.1);
        }

        .accessibility-section h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #1c3664;
          margin: 0 0 1.5rem 0;
          line-height: 1.3;
          font-family: var(--font-caramel), cursive, sans-serif;
        }

        .intro-section h2 {
          font-size: 2.25rem;
        }

        .accessibility-section h3 {
          font-size: 1.35rem;
          font-weight: 600;
          color: #1c3664;
          margin: 0 0 1rem 0;
          font-family: var(--font-caramel), cursive, sans-serif;
        }

        .accessibility-section p {
          font-size: 1.05rem;
          line-height: 1.85;
          color: #374151;
          margin-bottom: 1rem;
        }

        .lead-text {
          font-size: 1.15rem;
          line-height: 1.9;
          font-weight: 400;
          margin-bottom: 1.25rem;
        }

        .feature-box {
          background: rgba(255, 255, 255, 0.6);
          border-radius: 12px;
          padding: 1.75rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(28, 54, 100, 0.08);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        }

        .feature-box h3 {
          color: #B8821E;
          margin-top: 0;
          margin-bottom: 1.25rem;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .features-list li {
          font-size: 1.05rem;
          line-height: 1.85;
          color: #374151;
          margin-bottom: 1rem;
          padding-right: 1.5rem;
          position: relative;
        }

        .features-list li::before {
          content: "✓";
          color: #B8821E;
          font-weight: bold;
          font-size: 1.3rem;
          position: absolute;
          right: 0;
          top: -2px;
        }

        .features-list li:last-child {
          margin-bottom: 0;
        }

        .simple-list {
          list-style: none;
          padding: 0;
          margin: 1rem 0;
        }

        .simple-list li {
          font-size: 1.05rem;
          line-height: 1.85;
          color: #374151;
          margin-bottom: 1rem;
          padding-right: 1.5rem;
          position: relative;
        }

        .simple-list li::before {
          content: "•";
          color: #B8821E;
          font-weight: bold;
          font-size: 1.4rem;
          position: absolute;
          right: 0;
          top: -2px;
        }

        .contact-section {
          background: linear-gradient(135deg, rgba(28, 54, 100, 0.05) 0%, rgba(184, 130, 30, 0.05) 100%);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid rgba(28, 54, 100, 0.1);
        }

        .coordinator-details {
          margin: 1.5rem 0;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 10px;
        }

        .coordinator-details p {
          font-size: 1.1rem;
          margin-bottom: 0.75rem;
        }

        .coordinator-details p:last-child {
          margin-bottom: 0;
        }

        .contact-note {
          font-style: italic;
          color: #1c3664;
          margin-top: 1.5rem;
        }

        .date-section {
          text-align: center;
          border: none;
          padding-bottom: 0;
          margin-bottom: 0;
        }

        .declaration-date {
          font-size: 1rem;
          color: #6b7280;
          font-style: italic;
          margin: 0;
        }

        strong {
          color: #1c3664;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .accessibility-container {
            padding: 1.5rem 1rem 3rem;
          }

          .accessibility-section h2 {
            font-size: 1.6rem;
            margin-bottom: 1.25rem;
          }

          .intro-section h2 {
            font-size: 1.75rem;
          }

          .accessibility-section h3 {
            font-size: 1.2rem;
          }

          .accessibility-section p,
          .features-list li,
          .simple-list li {
            font-size: 1rem;
          }

          .feature-box,
          .intro-section,
          .contact-section {
            padding: 1.5rem;
          }

          .coordinator-details {
            padding: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .accessibility-section h2 {
            font-size: 1.4rem;
          }

          .intro-section h2 {
            font-size: 1.5rem;
          }

          .accessibility-section h3 {
            font-size: 1.1rem;
          }

          .features-list li,
          .simple-list li {
            padding-right: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
