'use client';

import React, { useState } from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  items: FAQItem[];
}

export default function FAQ({ title = 'שאלות נפוצות – דניאל ויואב עונים', items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-header">
        <h2 style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>{title}</h2>
        <div className="faq-subtitle">כל מה שרציתם לדעת במקום אחד</div>
      </div>

      <div className="faq-container">
        {items.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${openIndex === index ? 'active' : ''}`}
          >
            <button
              className="faq-question"
              onClick={() => toggleItem(index)}
              aria-expanded={openIndex === index}
            >
              <span className="question-text">{item.question}</span>
              <span className="faq-icon">
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </button>

            <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
              <div
                className="answer-content"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .faq-section {
          max-width: 800px;
          margin: 60px auto;
          padding: 0 20px;
          direction: rtl;
          font-family: var(--font-assistant), Arial, Helvetica, sans-serif;
        }

        .faq-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .faq-header h2 {
          font-size: 1.875rem; /* text-3xl */
          color: #111827;
          font-weight: 700;
          margin-bottom: 12px;
          letter-spacing: -0.025em;
          font-family: var(--font-caramel), cursive, sans-serif;
        }

        .faq-subtitle {
          font-size: 1.125rem;
          color: #6b7280;
        }

        .faq-container {
          border-top: 1px solid #e5e7eb;
        }

        .faq-item {
          border-bottom: 1px solid #e5e7eb;
          transition: background-color 0.2s ease;
        }

        .faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 0;
          background: none;
          border: none;
          cursor: pointer;
          text-align: right;
          gap: 20px;
        }

        .question-text {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          transition: color 0.2s ease;
        }

        .faq-item:hover .question-text {
          color: #354AC4; /* כחול עדין בריחוף */
        }

        .faq-icon {
          color: #9ca3af;
          transition: transform 0.3s ease, color 0.3s ease;
          display: flex;
          align-items: center;
        }

        .faq-item.active .faq-icon {
          transform: rotate(180deg);
          color: #354AC4;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
        }

        .faq-answer.open {
          max-height: 1000px;
          opacity: 1;
          padding-bottom: 24px;
        }

        .answer-content {
          color: #4b5563;
          font-size: 1rem;
          line-height: 1.6;
          padding-inline-end: 40px; /* רווח לאייקון (בצד ההפוך לטקסט) */
        }

        .answer-content :global(strong) {
          color: #051150;
          font-weight: 600;
        }

        @media (max-width: 640px) {
          .faq-header h2 {
            font-size: 1.875rem; /* text-3xl */
          }
          
          .question-text {
            font-size: 1rem;
          }
        }
      `}</style>
    </section>
  );
}