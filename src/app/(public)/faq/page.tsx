'use client';
import React from 'react';
import Hero from '@/components/layout/Hero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FAQ from '@/components/layout/FAQ';

export default function FAQPage() {
  return (
    <>
      <Hero
        img="/images/hero/other-hero.jpeg"
        staticTitle="שאלות ותשובות"
        centered={true}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      <main className="min-h-screen bg-white">
        <FAQ />
      </main>
    </>
  );
}
