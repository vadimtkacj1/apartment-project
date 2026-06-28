import Link from 'next/link';
import { Home, Key, BookOpen, HelpCircle, ArrowLeft, FileText } from 'lucide-react';

// Cornerstone guides surfaced as DIRECT slug links from the (indexed) homepage
// body. Most of these sit at "Discovered – not indexed" in GSC with no referring
// internal links: the existing cross-links form a closed loop among non-indexed
// pages, so a link from an indexed surface is the strongest repo-side crawl nudge.
const featuredGuides = [
  { href: '/articles/mortgage-guide', title: 'מדריך משכנתא מלא' },
  { href: '/articles/purchase-tax-guide', title: 'מס רכישה: המדריך המלא' },
  { href: '/articles/pre-purchase-checklist', title: 'צ׳קליסט בדיקות לפני קנייה' },
  { href: '/articles/holon-neighborhoods', title: 'שכונות חולון: איפה לגור ולהשקיע' },
  { href: '/articles/first-apartment-guide', title: 'מדריך לקניית דירה ראשונה' },
  { href: '/articles/urban-renewal-holon', title: 'התחדשות עירונית בחולון' },
];

// Server component (no "use client") — renders plain, crawlable <Link>s in the
// SSR HTML. Surfaces the guide/knowledge pages that were previously reachable
// only from the header/footer, giving them internal links from the homepage body.
const guides = [
  {
    href: '/buying-apartment',
    icon: Home,
    title: 'קונים דירה',
    description: 'המדריך המלא לרוכשי דירה — תקציב, משכנתא, בדיקות ומשא ומתן עד למפתח.',
  },
  {
    href: '/selling-apartment',
    icon: Key,
    title: 'מוכרים דירה',
    description: 'איך לתמחר נכון, לשווק את הנכס ולסגור עסקה בתנאים הטובים ביותר.',
  },
  {
    href: '/articles',
    icon: BookOpen,
    title: 'מאמרים ומדריכים',
    description: 'כל המדריכים על נדל״ן בחולון — מיסוי, התחדשות עירונית, השקעות ועוד.',
  },
  {
    href: '/faq',
    icon: HelpCircle,
    title: 'שאלות ותשובות',
    description: 'התשובות לשאלות הנפוצות ביותר על קנייה, מכירה והשכרת דירה.',
  },
];

export default function GuidesSection() {
  return (
    <section dir="rtl" className="relative w-full py-16 md:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 max-w-[1400px] relative z-10">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block mb-4 text-[#1c3664] font-bold text-lg uppercase tracking-wider">
            כל מה שצריך לדעת
          </span>
          <h2
            className="text-5xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tight"
            style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}
          >
            מדריכים ומידע שימושי
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 font-semibold max-w-3xl mx-auto">
            מדריכים מקצועיים שיעזרו לכם לקבל את ההחלטות הנכונות בעולם הנדל״ן
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map(({ href, icon: Icon, title, description }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col h-full p-7 bg-[#faf7f2] rounded-2xl border border-[#1c3664]/10 hover:border-[#c5a357] hover:shadow-xl transition-all"
            >
              <div className="mb-5 flex items-center justify-center w-14 h-14 rounded-xl bg-[#1c3664] text-[#c5a357] group-hover:bg-[#c5a357] group-hover:text-[#1c3664] transition-colors">
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-[#1c3664] mb-3">{title}</h3>
              <p className="text-base text-slate-600 leading-relaxed flex-1">{description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-[#1c3664] font-black group-hover:text-[#c5a357] transition-colors">
                למידע נוסף
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>

        {/* Featured guides — direct slug links so each guide is reachable from the
            indexed homepage (crawl-discovery nudge), not only the /articles hub. */}
        <div className="mt-12 pt-10 border-t border-[#1c3664]/10">
          <h3 className="text-center text-xl font-bold text-[#1c3664] mb-6">מדריכים מומלצים</h3>
          <ul className="flex flex-wrap justify-center gap-3">
            {featuredGuides.map(({ href, title }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#faf7f2] border border-[#1c3664]/10 text-[#1c3664] font-semibold text-sm hover:border-[#c5a357] hover:bg-white transition-all"
                >
                  <FileText className="w-4 h-4 text-[#c5a357]" />
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
