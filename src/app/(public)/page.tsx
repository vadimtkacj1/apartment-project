import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
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
        {/* Service navigation links — static for SEO */}
        <nav aria-label="שירותי המשרד" className="bg-warm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-6" dir="rtl">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 justify-center text-sm font-semibold text-[#1c3664]">
              <li><Link href="/buying-apartment" className="hover:underline underline-offset-4">קניית דירה בחולון</Link></li>
              <li><Link href="/selling-apartment" className="hover:underline underline-offset-4">מכירת דירה בחולון</Link></li>
              <li><Link href="/apartments?dealType=rent" className="hover:underline underline-offset-4">דירות להשכרה בחולון</Link></li>
              <li><Link href="/apartments?dealType=sale" className="hover:underline underline-offset-4">דירות למכירה בחולון</Link></li>
              <li><Link href="/articles" className="hover:underline underline-offset-4">מדריכים ומאמרים</Link></li>
              <li><Link href="/faq" className="hover:underline underline-offset-4">שאלות ותשובות</Link></li>
              <li><Link href="/about" className="hover:underline underline-offset-4">אודות המשרד</Link></li>
            </ul>
          </div>
        </nav>

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