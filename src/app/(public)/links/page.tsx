import type { Metadata } from 'next';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { FileText, Home, TrendingUp, DollarSign, Calculator, ExternalLink, LucideIcon } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: 'קישורים שימושיים | כלים לרכישה ומכירת נדל״ן',
  description: 'קישורים רשמיים לכלים חיוניים בעסקת נדל״ן: הפקת נסח טאבו, מסמכי בית משותף, מדד תשומות הבנייה, מדד המחירים לצרכן ומחשבון משכנתא.',
  alternates: {
    canonical: `${siteUrl}/links`,
  },
  openGraph: {
    title: 'קישורים שימושיים | כלים לרכישה ומכירת נדל״ן',
    description: 'כלים ומקורות מידע רשמיים לבדיקת נכסים ותכנון עסקאות נדל״ן.',
    url: `${siteUrl}/links`,
  },
};

interface Link {
  id: number;
  title: string;
  description: string;
  types?: string[];
  url: string;
  icon: LucideIcon;
}

export default function LinksPage() {
  const links: Link[] = [
    {
      id: 1,
      title: 'הפקת נסח טאבו מקוון',
      description: 'באמצעות המערכת הרשמית ניתן להוציא נסח טאבו עדכני ולבדוק את רישום הזכויות בנכס. הנסח מציג את בעלי הזכויות, הערות אזהרה, משכנתאות ושעבודים.',
      types: [
        'נסח מלא – מציג את כלל פרטי הרישום',
        'נסח היסטורי – כולל רישומים קודמים לאורך השנים',
        'נסח מרוכז – תמצית מידע לנכס בבית משותף'
      ],
      url: 'https://mekarkein-online.justice.gov.il/voucher/main',
      icon: FileText
    },
    {
      id: 2,
      title: 'הזמנת מסמכי בית משותף',
      description: 'במערכת זו ניתן לאתר ולהוריד תשריט בית משותף ומסמכי רישום נוספים מהטאבו. מסמכים אלו חשובים במיוחד לצורך בדיקת שטחי הדירה, הצמדות (חניה/מחסן) והתאמה בין מצב בפועל לרישום.',
      url: 'https://fileextractor.justice.gov.il/tabu',
      icon: Home
    },
    {
      id: 3,
      title: 'מדד תשומות הבנייה',
      description: 'מדד המשפיע בעיקר על דירות חדשות מקבלן ועל תשלומים הצמודים לחוזה רכישה. בדיקת המדד מאפשרת להבין כיצד עשוי להשתנות מחיר הדירה עד למסירה.',
      url: 'https://www.cbs.gov.il/he/subjects/Pages/%D7%9E%D7%93%D7%93-%D7%9E%D7%97%D7%99%D7%A8%D7%99-%D7%AA%D7%A9%D7%95%D7%9E%D7%94-%D7%91%D7%91%D7%A0%D7%99%D7%99%D7%94-%D7%9C%D7%9E%D7%92%D7%95%D7%A8%D7%99%D7%9D.aspx',
      icon: TrendingUp
    },
    {
      id: 4,
      title: 'מדד המחירים לצרכן',
      description: 'מדד המשמש להצמדת חוזים, תשלומים ומשכנתאות במסלולים מסוימים. מעקב אחר המדד מסייע להעריך את העלויות העתידיות של ההתחייבויות הפיננסיות.',
      url: 'https://www.cbs.gov.il/he/subjects/Pages/%D7%9E%D7%93%D7%93-%D7%94%D7%9E%D7%97%D7%99%D7%A8%D7%99%D7%9D-%D7%9C%D7%A6%D7%A8%D7%9B%D7%9F.aspx',
      icon: DollarSign
    },
    {
      id: 5,
      title: 'מחשבון משכנתא',
      description: 'כלי המאפשר לבצע סימולציה של החזר חודשי לפי סכום ההלוואה, ריבית ותקופת החזר. מומלץ להשתמש בו לפני חיפוש נכס כדי להבין את התקציב הריאלי לרכישה.',
      url: 'https://www.mizrahi-tefahot.co.il/mortgages/calculator/',
      icon: Calculator
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen text-right bg-warm">
      <SecondaryHero
        img="/7.jpg"
        title="קישורים שימושיים"
        centered={true}
      />

      <Breadcrumbs />

      <main className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
        <div className="mb-12">
          <p className="text-lg text-gray-700 leading-relaxed">
            בעסקת מכירה או רכישה חשוב להיעזר במידע רשמי, עדכני ואמין.
            ריכזנו עבורכם את הכלים והקישורים המרכזיים שיעזרו לכם לבדוק את מצב הנכס, להבין את העלויות הצפויות ולבצע החלטות מושכלות לאורך התהליך.
          </p>
        </div>

        <div className="space-y-6">
          {links.map((link) => {
            const IconComponent = link.icon;
            return (
              <div
                key={link.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                    <IconComponent size={24} className="text-[#1c3664]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {link.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {link.description}
                    </p>
                    {link.types && (
                      <ul className="mb-4 space-y-2">
                        {link.types.map((type: string, index: number) => (
                          <li key={index} className="text-gray-600 text-sm pr-4">
                            • {type}
                          </li>
                        ))}
                      </ul>
                    )}
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-row-reverse items-center gap-2 text-[#1c3664] hover:text-[#2a4a8a] font-medium transition-colors"
                    >
                      <span>למעבר לאתר</span>
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}