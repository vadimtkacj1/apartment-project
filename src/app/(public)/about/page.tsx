import type { Metadata } from 'next';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import PersonSchema from '@/components/SEO/PersonSchema';
import AboutLocalExpertise from '@/components/about/AboutLocalExpertise';
import AboutServicesNew from '@/components/about/AboutServicesNew';
import AboutMarketing from '@/components/about/AboutMarketing';
import AboutStoryNew from '@/components/about/AboutStoryNew';
import AboutOwners from '@/components/about/AboutOwners';
import AboutTeam from '@/components/about/AboutTeam';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: 'אודות | רם נכסים חיים ענבי - תיווך נדל״ן בחולון',
  description: 'הכירו את צוות רם נכסים — משרד תיווך נדל״ן מוביל בחולון. מומחיות מקומית, שיווק מתקדם, ליווי מלא בקנייה ומכירה של דירות בחולון, בת ים וראשון לציון.',
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: 'אודות | רם נכסים חיים ענבי - תיווך נדל״ן בחולון',
    description: 'הכירו את צוות רם נכסים — משרד תיווך נדל״ן מוביל בחולון עם מומחיות מקומית וניסיון מצטבר.',
    url: `${siteUrl}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="about-page bg-[#faf7f2]" dir="rtl">
      <BreadcrumbSchema items={[{ name: 'אודות', path: '/about' }]} />
      <PersonSchema />
      <SecondaryHero
        img="/images/hero/about-hero.jpg"
        title="אודות"
        centered={true}
      />
      <Breadcrumbs />
      <AboutLocalExpertise />
      <AboutServicesNew />
      <AboutMarketing />
      <AboutStoryNew />
      <AboutOwners />
      <AboutTeam />
    </div>
  );
}
