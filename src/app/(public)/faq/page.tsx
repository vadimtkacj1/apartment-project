'use client';
import React from 'react';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FAQ from '@/components/layout/FAQ';

export default function FAQPage() {
  return (
    <>
      <SecondaryHero
        img="/7.jpg"
        title="שאלות ותשובות"
        centered={true}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      <main className="min-h-screen bg-warm">
        <FAQ />
      </main>
    </>
  );
}
