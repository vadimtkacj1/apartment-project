import Link from 'next/link';
import { Home, Key, HelpCircle, FileText, ArrowLeft } from 'lucide-react';

// Compact internal-link band (server component — plain crawlable <Link>s in the
// SSR HTML). Keeps the homepage-body crawl links to the guide/knowledge pages —
// most sit at "Discovered – not indexed" in GSC and the indexed homepage is the
// strongest repo-side crawl nudge — but without the large card section that used
// to dominate the page. The same slugs also live in the footer site-wide.

// Primary navigation hubs — emphasized (navy-filled) pills.
const hubLinks = [
  { href: '/buying-apartment', icon: Home, title: 'קונים דירה' },
  { href: '/selling-apartment', icon: Key, title: 'מוכרים דירה' },
  { href: '/faq', icon: HelpCircle, title: 'שאלות ותשובות' },
];

// Cornerstone guides surfaced as DIRECT slug links (lighter pills).
const featuredGuides = [
  { href: '/articles/mortgage-guide', title: 'מדריך משכנתא מלא' },
  { href: '/articles/purchase-tax-guide', title: 'מס רכישה' },
  { href: '/articles/pre-purchase-checklist', title: 'צ׳קליסט בדיקות לפני קנייה' },
  { href: '/articles/holon-neighborhoods', title: 'שכונות חולון' },
  { href: '/articles/first-apartment-guide', title: 'מדריך לדירה ראשונה' },
  { href: '/articles/urban-renewal-holon', title: 'התחדשות עירונית' },
];

export default function GuidesSection() {
  return (
    <section dir="rtl" className="w-full py-10 md:py-12 bg-warm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-350">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-black text-[#1c3664]">
            מדריכים ומידע שימושי
          </h2>

          {/* Hub + guide links in one wrapped pill row */}
          <ul className="flex flex-wrap justify-center gap-2.5">
            {hubLinks.map(({ href, icon: Icon, title }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1c3664] text-white font-semibold text-sm hover:bg-[#c5a357] hover:text-[#1c3664] transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {title}
                </Link>
              </li>
            ))}
            {featuredGuides.map(({ href, title }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#1c3664]/10 text-[#1c3664] font-semibold text-sm hover:border-[#c5a357] hover:bg-[#faf7f2] transition-all"
                >
                  <FileText className="w-4 h-4 text-[#c5a357]" />
                  {title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Link to the full guides hub */}
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-[#c5a357] font-bold hover:text-[#1c3664] transition-colors"
          >
            כל המדריכים
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
