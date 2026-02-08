'use client';

import './about.css';
import SkewedSlider from '@/components/layout/SkewedSlider';
import AboutHero from '@/components/about/AboutHero';
import AboutStory from '@/components/about/AboutStory';
import AboutOwners from '@/components/about/AboutOwners';
import AboutTeam from '@/components/about/AboutTeam';
import AboutCTA from '@/components/about/AboutCTA';

export default function AboutPage() {
  return (
    <div className="about-page" dir="rtl">
      {/* Skewed Slider Section */}
      <section className="slider-section">
        <SkewedSlider />
      </section>

      {/* Hero Section */}
      <AboutHero />

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
