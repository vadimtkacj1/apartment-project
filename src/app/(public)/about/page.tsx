import SecondaryHero from '@/components/layout/SecondaryHero';
import { getActiveTheme } from '@/themes/server';
import MoonlitAbout from '@/themes/moonlit/MoonlitAbout';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import PersonSchema from '@/components/SEO/PersonSchema';
import AboutLocalExpertise from '@/components/about/AboutLocalExpertise';
import AboutServicesNew from '@/components/about/AboutServicesNew';
import AboutMarketing from '@/components/about/AboutMarketing';
import AboutStoryNew from '@/components/about/AboutStoryNew';
import AboutOwners from '@/components/about/AboutOwners';
import AboutTeam from '@/components/about/AboutTeam';
import AboutCTA from '@/components/about/AboutCTA';

// Metadata lives in ./layout.tsx (richer: keywords, OG image, twitter card).
// The weaker duplicate export that used to live here shadowed it — removed.

export default async function AboutPage() {
  const theme = await getActiveTheme();
  if (theme.family === 'moonlit') return <MoonlitAbout />;

  return (
    <div className="about-page bg-[#f5f7fb]" dir="rtl">
      <BreadcrumbSchema items={[{ name: 'אודות', path: '/about' }]} />
      <PersonSchema />
      <SecondaryHero
        img="/images/hero/about-hero.jpg"
        title="אודות"
        kicker="הכירו את Aiterra"
        subtitle="משרד תיווך בחולון · 24 שנות ניסיון מצטבר · מכירה, השכרה וניהול נכסים"
        centered={true}
      />
      <Breadcrumbs />
      <AboutLocalExpertise />
      <AboutServicesNew />
      <AboutMarketing />
      <AboutStoryNew />
      <AboutOwners />
      <AboutTeam />
      <AboutCTA />
    </div>
  );
}
