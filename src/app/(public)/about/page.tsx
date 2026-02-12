'use client';

import Hero from '@/components/layout/Hero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import AboutIntro from '@/components/about/AboutIntro';
import AboutWhyUs from '@/components/about/AboutWhyUs';
import AboutServices from '@/components/about/AboutServices';
import AboutStory from '@/components/about/AboutStory';
import AboutOwners from '@/components/about/AboutOwners';
import AboutTeam from '@/components/about/AboutTeam';
import AboutCTA from '@/components/about/AboutCTA';

export default function AboutPage() {
  return (
    <div className="about-page" dir="rtl">
      {/* Hero with Background Image */}
      <Hero
        img="/images/hero/other-hero.jpeg"
        staticTitle="אודות"
        centered={true}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Intro Section - Compact intro with stats */}
      <AboutIntro />

      {/* Why Choose Us - Features and benefits */}
      <AboutWhyUs />

      {/* Services Section */}
      <AboutServices />

      {/* Story Section */}
      <AboutStory />

      {/* Owners Section */}
      <AboutOwners />

      {/* Team Section */}
      <AboutTeam />

      {/* CTA Section */}
      <AboutCTA />
    </div>
  );
}
