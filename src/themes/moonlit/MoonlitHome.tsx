import React from 'react';
import Link from 'next/link';

import { prisma } from '@/lib/prisma';
import type { MoonlitVariant } from '../registry';
import MoonlitSearchBar from './SearchBar';
import { allImages, formatPrice, toMnProp, type MnProp } from './kit';
import { getMoonlitTitles } from './data';
import { getMoonlitContent } from './content.server';
import { BannerSlider, GallerySlider, RoomsSlider, TestimonialSlider, type BannerSlide, type MnTestimonial } from './sliders';

/*
 * MOONLIT HOMEPAGE — a 1:1 port of the template's index.html anatomy:
 *
 *   banner slider → advance search → about → facilities → rooms slider →
 *   testimonial → video → special offer → instagram gallery
 *
 * Same sections, same class names, same order; hotel content swapped for the
 * agency's real data. `dark` renders the identical tree (index-dark.html is the
 * same page under [data-theme=dark], which MoonlitShell sets).
 */

interface HomeData {
  rooms: MnProp[];
  offers: MnProp[];
  gallery: string[];
  activeCount: number;
}

async function loadHomeData(): Promise<HomeData> {
  const select = {
    id: true, title: true, location: true, neighborhood: true, price: true,
    rooms: true, area: true, floor: true, dealType: true, category: true, images: true,
  };

  const [latestRaw, hotRaw, activeCount] = await Promise.all([
    prisma.property.findMany({
      where: { isActive: true, isSold: false },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      take: 8,
      select,
    }),
    prisma.property.findMany({
      where: { isActive: true, isSold: false, isHotProposition: true },
      orderBy: { updatedAt: 'desc' },
      take: 3,
      select,
    }),
    prisma.property.count({ where: { isActive: true, isSold: false } }).catch(() => 0),
  ]);

  const latest = latestRaw.map(toMnProp);
  const hot = hotRaw.map(toMnProp);

  // Gallery strip: every photo we can find on the newest listings.
  const gallery = latestRaw
    .flatMap((p) => allImages(p.images))
    .filter(Boolean)
    .slice(0, 10);

  return {
    rooms: latest,
    // The offer band needs three cards; fall back to the newest listings.
    offers: (hot.length >= 3 ? hot : [...hot, ...latest.filter((p) => !hot.some((h) => h.id === p.id))]).slice(0, 3),
    gallery,
    activeCount,
  };
}

/** One offer card — the template's `single__offer__card` (+ `is__flex` variant). */
function OfferCard({ property, flex = false }: { property: MnProp; flex?: boolean }) {
  const bullets = [
    property.rooms ? `${property.rooms} חדרים` : null,
    property.area != null ? `${property.area} מ״ר` : null,
    property.floor != null ? `קומה ${property.floor}` : null,
    property.neighborhood ? `שכונת ${property.neighborhood}` : property.location,
  ].filter(Boolean) as string[];

  return (
    <div className={`single__offer__card${flex ? ' is__flex' : ''}`}>
      <Link href={`/apartments/${property.id}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={property.image} alt={property.title} width={flex ? 265 : undefined} height={flex ? 310 : undefined} />
      </Link>
      <div className="single__offer__card__content">
        <Link href={`/apartments/${property.id}`} className={flex ? 'h5' : 'h4'}>
          {property.title}
        </Link>
        <ul className="offer__included list-unstyled">
          {bullets.map((b) => (
            <li key={b}>
              <i className="flaticon-check-circle" /> {b}
            </li>
          ))}
        </ul>
        {flex ? (
          <h4 className="offer__price mb-0 ltr">₪{formatPrice(property.price)}</h4>
        ) : (
          <h3 className="offer__price mb-0 ltr">₪{formatPrice(property.price)}</h3>
        )}
      </div>
    </div>
  );
}

export default async function MoonlitHome({ variant }: { variant: MoonlitVariant }) {
  const [{ rooms, offers, gallery, activeCount }, titles, content] = await Promise.all([
    loadHomeData(),
    getMoonlitTitles(),
    getMoonlitContent(),
  ]);
  void variant; // luxe and dark share this tree; the palette comes from data-theme

  return (
    <>
      {/* banner area */}
      <div className="rts__section banner__area is__home__one banner__height banner__center">
        <BannerSlider slides={content.bannerSlides} />
      </div>
      {/* banner area end */}

      {/* advance search */}
      <MoonlitSearchBar content={content} />
      {/* advance search end */}

      {/* about us */}
      <div className="rts__section about__area is__home__main section__padding">
        <div className="section__shape d-none d-xl-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/moonlit/images/about/section__shape.svg" alt="" />
        </div>
        <div className="container">
          <div className="row">
            <div className="about__wrapper">
              <div className="image">
                <div className="position-relative">
                  <div className="jara-mask-1 jarallax image-height">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={content.aboutImageMain} className="jarallax-img" alt="" />
                  </div>
                </div>
                <div className="image__card radius-10">
                  <div className="icon radius-10 center-item">
                    <i className="flaticon-people" />
                  </div>
                  <div className="content">
                    <span className="h5">{content.aboutBadgeValue}</span>
                    <p>{content.aboutBadgeLabel}</p>
                  </div>
                </div>
                <div className="image__card__image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={content.aboutImageInset} width="312" height="230" alt="" />
                </div>
              </div>
              <div className="content">
                <span className="h6 subtitle__icon__two d-block">על המשרד</span>
                <h2 className="content__title">{titles.about}</h2>
                <p className="content__subtitle">{content.aboutText}</p>
                <Link href="/about" className="theme-btn btn-style fill no-border">
                  <span>{content.aboutCtaLabel}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* about us end */}

      {/* facilities */}
      <div className="rts__section facilities__area has__background has__shape py-90">
        <div className="section__shape">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/moonlit/images/shape/facility-1.svg" alt="" />
        </div>
        <div className="container">
          <div className="row justify-content-center text-center mb-40">
            <div className="col-lg-6">
              <div className="section__topbar">
                <span className="h6 subtitle__icon__three mx-auto">השירות שלנו</span>
                <h2 className="section__title">{titles.facilities}</h2>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {content.facilities.map((f) => (
              <div className="col-xl-3 col-lg-6 col-md-6" key={f.title}>
                <div className="card rts__card no-border is__home radius-6">
                  <div className="card-body">
                    <div className="icon">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.icon} alt="" />
                    </div>
                    <a href="/about">
                      <h6 className="card-title h6 mb-15">{f.title}</h6>
                    </a>
                    <p className="card-text">{f.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* facilities end */}

      {/* our rooms → our listings */}
      {rooms.length > 0 && (
        <div className="rts__section pt-120">
          <div className="container">
            <div className="row">
              <div className="section__wrapper mb-40">
                <div className="section__content__left">
                  <span className="h6 subtitle__icon__two d-block">נכסים</span>
                  <h2 className="content__title h2 lh-1">{titles.listings}</h2>
                </div>
                <div className="section__content__right">
                  <p>
                    {activeCount > 0 ? `${activeCount} נכסים פעילים · ${titles.listingsSub}` : titles.listingsSub}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <RoomsSlider properties={rooms} />
          </div>
        </div>
      )}
      {/* our rooms end */}

      {/* client testimonial */}
      <div className="rts__section section__padding testimonial has__shape">
        <div className="container">
          <div className="row mb-40">
            <div className="d-flex align-items-center justify-content-between position-relative">
              <div className="section__content__left">
                <span className="h6 subtitle__icon__two d-block">המלצות</span>
                <h2 className="content__title h2 lh-1">{titles.testimonials}</h2>
              </div>
              <div className="slider__navigation">
                <div className="nav__btn button-next">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/moonlit/images/icon/arrow-left-short.svg" alt="" />
                </div>
                <div className="nav__btn button-prev">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/moonlit/images/icon/arrow-right-short.svg" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-11">
              <TestimonialSlider items={content.testimonials} />
            </div>
          </div>
        </div>
      </div>
      {/* client testimonial end */}

      {/* full-width image band (the template's video block, without a video) */}
      <div className="rts__section pb-120 video video__full">
        <div className="container-full">
          <div className="row">
            <div className="col-12">
              <div className="video__area position-relative">
                <div className="video__area__image jara-mask-2 jarallax rounded-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="radius-none jarallax-img" src={content.bandImage} alt="" />
                </div>
                <div className="video--spinner__wrapper">
                  <div className="rts__circle">
                    <svg className="spinner" viewBox="0 0 100 100">
                      <defs>
                        <path id="circle-2" d="M50,50 m-37,0a37,37 0 1,1 74,0a37,37 0 1,1 -74,0" />
                      </defs>
                      <text>
                        <textPath xlinkHref="#circle-2">
                          לצפייה בנכסים * לצפייה בנכסים * לצפייה בנכסים *
                        </textPath>
                      </text>
                    </svg>
                    <div className="rts__circle--icon">
                      <Link href="/apartments" className="video-play" aria-label="לצפייה בנכסים">
                        <i className="flaticon-play" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* band end */}

      {/* special offer → hot propositions */}
      {offers.length >= 3 && (
        <div className="rts__section offer__area is__home__one has__shape">
          <div className="container">
            <div className="row position-relative justify-content-center text-center mb-30">
              <div className="col-lg-6">
                <div className="section__topbar">
                  <span className="h6 subtitle__icon__three mx-auto">הצעות חמות</span>
                  <h2 className="section__title">{titles.offers}</h2>
                </div>
              </div>
            </div>
            <div className="row justify-content-center g-30">
              <div className="col-lg-10 col-xl-6 col-xxl-5">
                <OfferCard property={offers[0]} />
              </div>
              <div className="col-lg-10 col-xl-6 col-xxl-7">
                <div className="d-flex flex-column gap-30">
                  <OfferCard property={offers[1]} flex />
                  <OfferCard property={offers[2]} flex />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* special offer end */}

      {/* gallery */}
      <div className="rts__section is__home__main">
        <div className="container-fluid">
          <div className="row position-relative justify-content-center text-center mb-30">
            <div className="col-lg-6">
              <div className="section__topbar">
                <span className="h6 subtitle__icon__three mx-auto">גלריה</span>
                <h2 className="section__title">נכסים מהמאגר שלנו</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <GallerySlider images={gallery} />
          </div>
        </div>
      </div>
      {/* gallery end */}
    </>
  );
}
