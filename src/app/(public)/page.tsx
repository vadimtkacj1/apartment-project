"use client";
import { useEffect } from 'react';
import Hero from '@/components/layout/Hero';
import Header from '@/components/layout/Header';
import Stats from '@/components/layout/Stats';
import HotPropositions from '@/components/layout/HotPropositions';
import AboutSection from '@/components/layout/AboutSection';
import ProcessSection from '@/components/layout/ProcessSection';
import Testimonials from '@/components/layout/Testimonials';
import FeaturedProperties from '@/components/layout/FeaturedProperties';
import ContactForm from '@/components/layout/ContactForm';
import ValuesSection from '@/components/layout/ValuesSection';
import MarketingMessage from '@/components/layout/MarketingMessage';

export default function Home() {
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
  }, []);

  return (
    <>
      {/* Hero section - full screen image */}
      <div className="h-screen w-full relative">
        <Hero
          img="/images/hero/main-hero.jpg"
        />
      </div>

      {/* Content that scrolls over the hero */}
      <div className="relative z-10 bg-warm">
        {/* <HotPropositions /> */}
        <AboutSection />
        <ValuesSection />
        {/* <Stats /> */}
        <Testimonials />
        <FeaturedProperties />
        <ContactForm />
      </div>
    </>
  );
}