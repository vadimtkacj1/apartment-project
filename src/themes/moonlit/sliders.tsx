'use client';

import React from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import type { MnProp } from './kit';
import { formatPrice } from './kit';

/*
 * The template drives every carousel with jQuery-era Swiper calls in
 * assets/js/main.js. These components keep the exact markup + the exact swiper
 * options from that file, re-expressed with swiper/react (already a project
 * dependency). Styling comes entirely from the template's own stylesheets.
 */

export interface BannerSlide {
  image: string;
  eyebrow: string;
  title: string;
  text: string;
  ctaHref: string;
  ctaLabel: string;
}

const NAV_ARROW_NEXT = (
  <svg width="40" height="22" viewBox="0 0 40 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.255 9.75546H39.0404C39.7331 9.75546 40.2927 10.3151 40.2927 11.0078C40.2927 11.7005 39.7331 12.2601 39.0404 12.2601H4.28018L11.8803 19.8603C12.3695 20.3495 12.3695 21.1439 11.8803 21.6331C11.3911 22.1223 10.5967 22.1223 10.1075 21.6331L0.366619 11.8923C0.00657272 11.5322 -0.0990982 10.9961 0.0965805 10.5264C0.292259 10.0607 0.750149 9.75546 1.255 9.75546Z"
      fill="#F1F1F1"
    />
    <path
      d="M11.0077 0.00274277C11.3286 0.00274277 11.6495 0.124063 11.8921 0.370618C12.3813 0.859813 12.3813 1.65426 11.8921 2.14346L2.13955 11.896C1.65036 12.3852 0.855906 12.3852 0.366712 11.896C-0.122483 11.4068 -0.122483 10.6124 0.366712 10.1232L10.1193 0.370618C10.3658 0.124063 10.6868 0.00274277 11.0077 0.00274277Z"
      fill="#F1F1F1"
    />
  </svg>
);

/** banner__slider — slidesPerView 1, loop, speed 1000, autoplay 5s. */
export function BannerSlider({ slides }: { slides: BannerSlide[] }) {
  return (
    <Swiper
      className="banner__slider overflow-hidden"
      modules={[Navigation, Autoplay]}
      slidesPerView={1}
      loop
      speed={1000}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      navigation={{ nextEl: '.banner__slider .next', prevEl: '.banner__slider .prev' }}
    >
      {slides.map((slide, i) => (
        <SwiperSlide key={slide.title}>
          <div className="banner__slider__image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slide.image} alt="" fetchPriority={i === 0 ? 'high' : 'auto'} />
          </div>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="banner__slide__content">
                  <span className="h6 subtitle__icon">{slide.eyebrow}</span>
                  <h1>{slide.title}</h1>
                  <p className="sub__text">{slide.text}</p>
                  <Link href={slide.ctaHref} className="theme-btn btn-style fill no-border">
                    <span>{slide.ctaLabel}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}

      <div slot="container-end" className="rts__slider__nav">
        <div className="rts__slide">
          <div className="next">{NAV_ARROW_NEXT}</div>
        </div>
        <div className="rts__slide">
          <div className="prev">{NAV_ARROW_NEXT}</div>
        </div>
      </div>
    </Swiper>
  );
}

/** main__room__slider — the template's room carousel, carrying real listings. */
export function RoomsSlider({ properties }: { properties: MnProp[] }) {
  return (
    <>
      <Swiper
        className="main__room__slider overflow-hidden"
        modules={[Pagination]}
        slidesPerView={4}
        spaceBetween={30}
        loop={properties.length > 4}
        speed={1000}
        pagination={{ el: '.rts-pagination', clickable: true }}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          992: { slidesPerView: 2.5 },
          1200: { slidesPerView: 3 },
          1400: { slidesPerView: 4 },
        }}
      >
        {properties.map((p) => (
          <SwiperSlide key={p.id}>
            <div className="room__slide__box radius-6">
              <div className="room__thumbnail jara-mask-2 jarallax">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img height="585" width="420" className="radius-6 jarallax-img" src={p.image} alt={p.title} />
              </div>
              <div className="room__content">
                <Link href={`/apartments/${p.id}`} className="room__title">
                  <h5>{p.title}</h5>
                </Link>
                <div className="room__content__meta">
                  {p.area != null && (
                    <span>
                      <i className="flaticon-construction" /> {p.area} מ״ר
                    </span>
                  )}
                  {p.rooms && (
                    <span>
                      <i className="flaticon-user" /> {p.rooms} חדרים
                    </span>
                  )}
                </div>
                <span className="h4 rent mb-0 mt-15 d-block ltr">
                  ₪{formatPrice(p.price)}
                  {p.dealType === 'rent' && <span className="price__period">לחודש</span>}
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="rts__pagination">
        <div className="rts-pagination" />
      </div>
    </>
  );
}

export interface MnTestimonial {
  text: string;
  author: string;
  context: string;
  /** Portrait shown in the template's `author__icon` badge. */
  avatar: string;
}

/** testimonial__slider — 1 slide, loop, nav via .button-next / .button-prev. */
export function TestimonialSlider({ items }: { items: MnTestimonial[] }) {
  return (
    <Swiper
      className="testimonial__slider overflow-hidden"
      modules={[Navigation]}
      slidesPerView={1}
      loop
      speed={1000}
      centeredSlides
      navigation={{ nextEl: '.testimonial .button-next', prevEl: '.testimonial .button-prev' }}
    >
      {items.map((item) => (
        <SwiperSlide key={item.author}>
          <div className="testimonial__item__content">
            <div className="author__icon">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.avatar} alt="" />
            </div>
            <div className="testimonial__content">
              <div className="single__slider__item">
                <div className="slider__rating mb-20">
                  <i className="flaticon-star" />
                  <i className="flaticon-star" />
                  <i className="flaticon-star" />
                  <i className="flaticon-star" />
                  <i className="flaticon-star-sharp-half-stroke" />
                </div>
                <span className="slider__text d-block">{item.text}</span>
                <div className="slider__author__info">
                  <div className="slider__author__info__content">
                    <h6 className="mb-0">{item.author}</h6>
                    <span>{item.context}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

/** insta__gallery__slider — the template's photo strip, fed with listing photos. */
export function GallerySlider({ images }: { images: string[] }) {
  return (
    <Swiper
      className="insta__gallery__slider overflow-hidden"
      modules={[Autoplay]}
      slidesPerView={6}
      spaceBetween={15}
      loop={images.length > 6}
      speed={1000}
      grabCursor
      autoplay={{ delay: 3000 }}
      breakpoints={{
        0: { slidesPerView: 1 },
        480: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 4 },
        1200: { slidesPerView: 6 },
      }}
    >
      {images.map((src, i) => (
        <SwiperSlide key={`${src}-${i}`}>
          <div className="gallery__item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} height="300" width="300" alt="" />
            <Link href="/apartments" className="gallery__popup" aria-label="לצפייה בנכסים">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/moonlit/images/icon/instagram.svg" height="40" width="40" alt="" />
            </Link>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
