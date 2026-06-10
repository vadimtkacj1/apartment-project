import { Suspense } from 'react';
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
  return (
    <>
      {/* Hero section - scrolls normally */}
      <div className="w-full">
        <Hero />
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