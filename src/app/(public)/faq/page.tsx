import React from 'react';
import FAQ from '@/components/layout/FAQ';

export const metadata = {
  title: 'שאלות ותשובות | רם וחיים שיווק נכסים',
  description: 'שאלות נפוצות בתחום הנדל"ן - כל מה שרציתם לדעת על קניה, מכירה והשכרת דירות',
};

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white">
      <FAQ />
    </main>
  );
}
