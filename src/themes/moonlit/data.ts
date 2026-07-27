import { prisma } from '@/lib/prisma';

/**
 * Everything the moonlit chrome + homepage show that an admin can edit.
 *
 * Contacts come from /admin/contact/contact-info (ContactInfo singleton) and
 * fall back to the first active owner, so the theme never shows placeholders.
 * Section headings come from /admin/homepage (HomepageSettings singleton) —
 * the same rows the classic theme uses, so switching themes keeps the copy.
 */

export interface MoonlitContact {
  phone: string | null;
  phoneLink: string | null;
  email: string | null;
  emailLink: string | null;
  address: string | null;
  hours: string | null;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  whatsapp: string | null;
}

/**
 * PLACEHOLDERS — while the moonlit theme is a preview it must not show the
 * office's real phone / e-mail / opening hours. The rows stay in place (same
 * markup, same icons), only the values are dummies.
 *
 *   ➡ To go live with the real, admin-managed values: set this to false.
 */
const USE_PLACEHOLDER_CONTACTS = true;

const PLACEHOLDER_CONTACT = {
  phone: '050-000-0000',
  phoneLink: 'tel:0500000000',
  email: 'mail@example.com',
  emailLink: 'mailto:mail@example.com',
  hours: 'א׳–ה׳ 00:00–00:00',
};

const EMPTY_CONTACT: MoonlitContact = {
  phone: null, phoneLink: null, email: null, emailLink: null, address: null,
  hours: null, facebook: null, instagram: null, linkedin: null, whatsapp: null,
};

export async function getMoonlitContact(): Promise<MoonlitContact> {
  const [info, owner] = await Promise.all([
    prisma.contactInfo.findFirst({ orderBy: { id: 'asc' } }).catch(() => null),
    prisma.owner
      .findFirst({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        select: { phone: true, email: true, whatsapp: true },
      })
      .catch(() => null),
  ]);

  const phone = info?.phone ?? owner?.phone ?? null;
  const email = info?.email ?? owner?.email ?? null;

  if (USE_PLACEHOLDER_CONTACTS) {
    return {
      ...EMPTY_CONTACT,
      ...PLACEHOLDER_CONTACT,
      address: info ? [info.address, info.city].filter(Boolean).join(', ') : null,
      facebook: info?.facebook ?? null,
      instagram: info?.instagram ?? null,
      linkedin: info?.linkedin ?? null,
      whatsapp: info?.whatsapp ?? owner?.whatsapp ?? null,
    };
  }

  return {
    ...EMPTY_CONTACT,
    phone,
    phoneLink: info?.phoneLink ?? (phone ? `tel:${phone.replace(/[^0-9+]/g, '')}` : null),
    email,
    emailLink: info?.emailLink ?? (email ? `mailto:${email}` : null),
    address: info ? [info.address, info.city].filter(Boolean).join(', ') : null,
    hours: info ? [info.weekdayHours, info.fridayHours].filter(Boolean).join(' · ') : null,
    facebook: info?.facebook ?? null,
    instagram: info?.instagram ?? null,
    linkedin: info?.linkedin ?? null,
    whatsapp: info?.whatsapp ?? owner?.whatsapp ?? null,
  };
}

export interface MoonlitTitles {
  about: string;
  facilities: string;
  listings: string;
  listingsSub: string;
  testimonials: string;
  offers: string;
}

const DEFAULT_TITLES: MoonlitTitles = {
  about: 'ברוכים הבאים ל־Aiterra נדל״ן',
  facilities: 'למה לבחור בנו?',
  listings: 'הנכסים שלנו',
  listingsSub: 'כל נכס במאגר נבדק על ידינו: מחיר, מצב הדירה, הבניין והסביבה.',
  testimonials: 'מה הלקוחות שלנו אומרים',
  offers: 'הצעות חמות',
};

export async function getMoonlitTitles(): Promise<MoonlitTitles> {
  const s = await prisma.homepageSettings.findFirst({ orderBy: { id: 'asc' } }).catch(() => null);
  if (!s) return DEFAULT_TITLES;

  return {
    about: s.aboutSectionTitle || DEFAULT_TITLES.about,
    facilities: s.valuesSectionTitle || DEFAULT_TITLES.facilities,
    listings: s.featuredPropertiesTitle || DEFAULT_TITLES.listings,
    listingsSub: s.featuredPropertiesSubtitle || DEFAULT_TITLES.listingsSub,
    testimonials: s.testimonialsTitle || DEFAULT_TITLES.testimonials,
    offers: s.hotPropositionsTitle || DEFAULT_TITLES.offers,
  };
}
