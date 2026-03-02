"use client";
import { useEffect, useState, Suspense, lazy } from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/layout/Hero';

// Lazy load heavy components below the fold
const NoCommissionSection = dynamic(() => import('@/components/layout/NoCommissionSection'), {
  loading: () => <div className="h-64 bg-warm animate-pulse" />,
});

const HotPropositions = dynamic(() => import('@/components/layout/HotPropositions'), {
  loading: () => <div className="h-96 bg-warm animate-pulse" />,
});

const AboutSection = dynamic(() => import('@/components/layout/AboutSection'), {
  loading: () => <div className="h-96 bg-warm animate-pulse" />,
});

const ValuesSection = dynamic(() => import('@/components/layout/ValuesSection'), {
  loading: () => <div className="h-96 bg-warm animate-pulse" />,
});

const Testimonials = dynamic(() => import('@/components/layout/Testimonials'), {
  loading: () => <div className="h-96 bg-warm animate-pulse" />,
});

const FeaturedProperties = dynamic(() => import('@/components/layout/FeaturedProperties'), {
  loading: () => <div className="h-96 bg-warm animate-pulse" />,
});

const ContactForm = dynamic(() => import('@/components/layout/ContactForm'), {
  loading: () => <div className="h-96 bg-warm animate-pulse" />,
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Handle hash navigation on page load
    if (window.location.hash === '#contact') {
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }

    // Hide loader when page is fully loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Полноэкранный спиннер */}
      {isLoading && (
        <div className="fixed inset-0 z-9999 bg-[#2A4A8A] flex items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-[#c5a357]/30 border-t-[#c5a357] rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* Hero section - scrolls normally */}
      <div className="w-full -mt-[70px]">
        <Hero
          img="/images/hero/main-hero.jpg"
        />
      </div>

      {/* Content below hero - lazy loaded */}
      <div className="relative bg-warm">
        <Suspense fallback={<div className="h-64 bg-warm animate-pulse" />}>
          <NoCommissionSection />
        </Suspense>
        <Suspense fallback={<div className="h-96 bg-warm animate-pulse" />}>
          <HotPropositions />
        </Suspense>
        <Suspense fallback={<div className="h-96 bg-warm animate-pulse" />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<div className="h-96 bg-warm animate-pulse" />}>
          <ValuesSection />
        </Suspense>
        <Suspense fallback={<div className="h-96 bg-warm animate-pulse" />}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<div className="h-96 bg-warm animate-pulse" />}>
          <FeaturedProperties />
        </Suspense>
        <Suspense fallback={<div className="h-96 bg-warm animate-pulse" />}>
          <ContactForm />
        </Suspense>
      </div>
    </>
  );
}