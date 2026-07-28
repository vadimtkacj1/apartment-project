import type { Metadata } from 'next';
import Link from 'next/link';
import SecondaryHero from '@/components/layout/SecondaryHero';
import { getActiveTheme } from '@/themes/server';
import MoonlitBlog from '@/themes/moonlit/MoonlitBlog';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import ArticlesGrid from './ArticlesGrid';
import './articles.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://go-apartsale.online';

// Company line (Organization schema): +972-52-384-7291.
const whatsappUrl = `https://wa.me/972523847291?text=${encodeURIComponent(
  'שלום, הגעתי דרך המאמרים ואשמח לקבל ייעוץ',
)}`;

export const metadata: Metadata = {
  title: 'מאמרים ומדריכים | נדל״ן בחולון',
  description: 'מדריכים מקצועיים בנושאי נדל״ן: רכישת דירה בישראל עבור תושבי חוץ, מכירת דירה עם מתווך לעומת עצמאית, ועוד טיפים ממומחי Aiterra.',
  alternates: {
    canonical: `${siteUrl}/articles`,
  },
  openGraph: {
    title: 'מאמרים ומדריכים | נדל״ן בחולון',
    description: 'מדריכים מקצועיים בנושאי נדל״ן מאת צוות Aiterra.',
    url: `${siteUrl}/articles`,
  },
};

export default async function ArticlesPage() {
  const theme = await getActiveTheme();
  if (theme.family === 'moonlit') return <MoonlitBlog />;

  return (
    <div className="articles-page" dir="rtl">
      <BreadcrumbSchema items={[{ name: 'מאמרים', path: '/articles' }]} />
      <SecondaryHero
        img="/7.jpg"
        title="מאמרים ומדריכים"
        centered={true}
      />
      <Breadcrumbs />
      <div className="articles-container">
        <p className="articles-subtitle">
          מדריכים מקצועיים, טיפים ותובנות מהשטח – כל מה שכדאי לדעת לפני שמוכרים, קונים או משכירים דירה בחולון ובבת ים.
        </p>

        <ArticlesGrid />

        <section className="articles-cta">
          <h2 className="font-caramel">יש לכם שאלה על נדל״ן בחולון?</h2>
          <p>הצוות שלנו כאן כדי לענות – בלי התחייבות. דברו איתנו ונעזור לכם לקבל את ההחלטה הנכונה.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-[#354AC4] font-bold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              צרו קשר
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#25D366] text-white font-bold shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#1fb855]"
            >
              וואטסאפ
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
