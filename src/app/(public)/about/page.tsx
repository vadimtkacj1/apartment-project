'use client';

import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import AboutMainIntro from '@/components/about/AboutMainIntro';
import AboutLocalExpertise from '@/components/about/AboutLocalExpertise';
import AboutServicesNew from '@/components/about/AboutServicesNew';
import AboutMarketing from '@/components/about/AboutMarketing';
import AboutStoryNew from '@/components/about/AboutStoryNew';
import AboutOwners from '@/components/about/AboutOwners';
import AboutTeam from '@/components/about/AboutTeam';

export default function AboutPage() {
  return (
    <div className="about-page" dir="rtl">
      {/* Hero with Background Image */}
      <SecondaryHero
        img="/7.jpg"
        title="אודות"
        centered={true}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Main Intro: רם וחיים שיווק נכסים */}
      <AboutMainIntro />

      {/* Local Expertise: מומחיות מקומית בחולון */}
      <AboutLocalExpertise />

      {/* Services: השכרה, מכירה וניהול נכסים */}
      <AboutServicesNew />

      {/* Marketing: שיווק נדל"ן בגישה מתקדמת */}
      <AboutMarketing />

      {/* Story: הסיפור שלנו */}
      <AboutStoryNew />

      {/* Founders: המייסדים שלנו */}
      <AboutOwners />

      {/* Team: הצוות המקצועי */}
      <AboutTeam />
    </div>
  );
}
