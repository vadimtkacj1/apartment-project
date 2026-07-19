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
          <h2 className="text-2xl md:text-3xl font-black text-[#051150]">
            מדריכים ומידע שימושי
          </h2>

          {/* Hub + guide links in one wrapped pill row */}
          <ul className="flex flex-wrap justify-center gap-2.5">
            {hubLinks.map(({ href, icon: Icon, title }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#354ac4] text-white font-semibold text-sm hover:bg-[#5594f1] hover:text-[#051150] transition-colors"
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#354ac4]/10 text-[#354ac4] font-semibold text-sm hover:border-[#5594f1] hover:bg-[#f5f7fb] transition-all"
                >
                  <FileText className="w-4 h-4 text-[#5594f1]" />
                  {title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Link to the full guides hub */}
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-[#2a69c4] font-bold hover:text-[#354ac4] transition-colors"
          >
            כל המדריכים
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
