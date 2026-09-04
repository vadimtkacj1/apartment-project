'use client';

import Link from 'next/link';
import { m } from 'framer-motion';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ContactForm from '@/components/layout/ContactForm';
import FAQ from '@/components/ui/FAQ';
import PropertyCard from '@/components/properties/PropertyCard';
import type { CityLanding } from '@/data/city-landings';
import type { DealType, PropertyType } from '@/types/property.types';

export interface CityProperty {
  id: number;
  title: string;
  location: string;
  price: string;
  area: number;
  image?: string;
  images?: string[];
  rooms?: string;
  bedrooms?: string;
  bathrooms?: number;
  dealType?: DealType;
  category?: string;
  status?: string;
  isSold?: boolean;
  floor?: number;
  totalFloors?: number;
  neighborhood?: string;
  propertyType?: PropertyType;
}

interface CityLandingContentProps {
  city: CityLanding;
  properties: CityProperty[];
}

export default function CityLandingContent({ city, properties }: CityLandingContentProps) {
  return (
    <div dir="rtl" className="min-h-screen bg-warm">
      <SecondaryHero img={city.heroImage} title={city.h1} centered={true} />
      <Breadcrumbs />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <m.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xl md:text-2xl text-gray-700 font-semibold max-w-4xl leading-relaxed"
        >
          {city.lede}
        </m.p>

        {city.blocks.map((block, index) => (
          <m.section
            key={block.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            className="mt-14"
          >
            <h2 className="text-2xl md:text-3xl font-black text-[#1c3664] mb-4">{block.title}</h2>
            <div className="space-y-4 text-lg leading-relaxed text-gray-700 max-w-4xl">
              {block.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </m.section>
        ))}

        <m.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mt-14"
        >
          <h2 className="text-2xl md:text-3xl font-black text-[#1c3664] mb-4">
            השכונות שאנחנו עובדים בהן {city.nameIn}
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 max-w-4xl mb-6">
            {city.neighborhoodsNote}
          </p>
          <ul className="flex flex-wrap gap-2 list-none p-0">
            {city.neighborhoods.map((n) => (
              <li
                key={n}
                className="rounded-full bg-white border border-[#1c3664]/15 px-4 py-2 text-sm font-semibold text-[#1c3664]"
              >
                {n}
              </li>
            ))}
          </ul>
        </m.section>

        {properties.length > 0 && (
          <m.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mt-16"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
              <h2 className="text-2xl md:text-3xl font-black text-[#1c3664]">
                נכסים {city.nameIn} מהמאגר שלנו
              </h2>
              <Link
                href="/apartments"
                className="text-[#1c3664] font-bold underline underline-offset-4"
              >
                לכל הנכסים
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property, index) => (
                <PropertyCard key={property.id} {...property} index={index} />
              ))}
            </div>
          </m.section>
        )}

        <div className="mt-16">
          <FAQ items={city.faq} title={`שאלות נפוצות על תיווך ${city.nameIn}`} />
        </div>

        <m.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12"
          id="contact"
        >
          <ContactForm />
        </m.section>
      </main>
    </div>
  );
}
