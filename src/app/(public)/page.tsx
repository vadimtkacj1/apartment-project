"use client";
import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { heroSlides } from '@/data/hero.data';
import Hero from '@/components/layout/Hero';
import Header from '@/components/layout/Header';
import Stats from '@/components/layout/Stats';
import HotPropositions from '@/components/layout/HotPropositions';
import AboutSection from '@/components/layout/AboutSection';
import FeaturedProperties from '@/components/layout/FeaturedProperties';
import ContactForm from '@/components/layout/ContactForm';

// Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';

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
      {/* Hero section with sticky positioning */}
      <div className="h-screen w-full sticky top-0 z-0">
        <Swiper
          spaceBetween={0}
          speed={2500}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          effect={"fade"}
          fadeEffect={{ crossFade: true }}
          modules={[Autoplay, EffectFade]}
          className="h-full w-full"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <Hero
                img={slide.img}
                mainText=""
                subText="הנכס שלכם שווה יותר. אנחנו נדאג למצוא את הקונה המתאים במחיר המקסימלי."
                staticTitle="מכירת דירות"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Content that scrolls over the hero */}
      <div className="relative z-10 bg-white">
        <HotPropositions />
        <Stats />
        <AboutSection />
        <FeaturedProperties />
        <ContactForm />
      </div>
    </>
  );
}