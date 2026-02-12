'use client';

import Hero from '@/components/layout/Hero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Calculator } from 'lucide-react'; 

export default function LinksPage() {
  const links = [
    {
      id: 1,
      title: 'מדד תשומות הבנייה',
      url: 'https://www.cbs.gov.il/he/subjects/Pages/%D7%9E%D7%93%D7%93-%D7%9E%D7%97%D7%99%D7%A8%D7%99-%D7%AA%D7%A9%D7%95%D7%9E%D7%94-%D7%91%D7%91%D7%A0%D7%99%D7%99%D7%94-%D7%9C%D7%9E%D7%92%D7%95%D7%A8%D7%99%D7%9D.aspx',
    },
    {
      id: 2,
      title: 'מדד המחירים לצרכן',
      url: 'https://www.cbs.gov.il/he/subjects/Pages/%D7%9E%D7%93%D7%93-%D7%94%D7%9E%D7%97%D7%99%D7%A8%D7%99%D7%9D-%D7%9C%D7%A6%D7%A8%D7%9B%D7%9F.aspx',
    },
    {
      id: 3,
      title: 'מחשבון משכנתא',
      url: 'https://www.mizrahi-tefahot.co.il/mortgages/calculator/',
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen text-right bg-warm">
      <Hero
        img="/images/hero/other-hero.jpeg"
        staticTitle="קישורים שימושיים"
        centered={true}
      />

      <Breadcrumbs />

      <main className="max-w-4xl mx-auto px-6 lg:px-12 py-16 ">
        <ul className="flex flex-col items-start gap-4"> 
          {links.map((link) => (
            <li key={link.id} className="w-full">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-row-reverse items-center gap-3 py-2 hover:opacity-80 transition-opacity"
              >
                <span className="text-lg font-medium text-gray-900">
                  {link.title}
                </span>
                <Calculator size={20} className="text-[#1c3664] shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}