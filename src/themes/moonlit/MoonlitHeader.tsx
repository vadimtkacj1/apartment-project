'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { MoonlitContact } from './data';
import type { NavItemContent } from './content';

interface Props {
  /** Admin-managed contact block (/admin/contact/contact-info). */
  contact: MoonlitContact;
  /** Admin-managed menu (/admin/design). */
  nav: NavItemContent[];
}

/**
 * The template's `header__top` + `main__header header__function` pair, 1:1 —
 * same classes, same three-part wrapper (nav / centred logo / actions).
 * main.js adds `.is__sticky` past 150px; that's the only behaviour ported.
 */
export default function MoonlitHeader({ contact, nav }: Props) {
  const { phone, email, address } = contact;
  const pathname = usePathname();
  const [sticky, setSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 150);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const telHref = contact.phoneLink ?? (phone ? `tel:${phone.replace(/[^0-9+]/g, '')}` : null);
  const MOONLIT_NAV = nav;
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      {/* header area */}
      <div className="header__top">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-6 col-md-6">
              <div className="social__links">
                {phone && (
                  <a className="link__item gap-10" href={telHref!}>
                    <i className="flaticon-phone-flip" />
                    <span className="ltr">{phone}</span>
                  </a>
                )}
                {email && (
                  <a className="link__item gap-10" href={contact.emailLink ?? `mailto:${email}`}>
                    <i className="flaticon-envelope" />
                    <span className="ltr">{email}</span>
                  </a>
                )}
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="location">
                <span className="link__item gap-10">
                  <i className="flaticon-marker" />
                  {address ?? 'חולון · בת ים · ראשון לציון והמרכז'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className={`main__header header__function${sticky ? ' is__sticky' : ''}`}>
        <div className="container">
          <div className="row">
            <div className="main__header__wrapper">
              <div className="main__nav">
                <div className="navigation d-none d-lg-block">
                  <nav className="navigation__menu" id="main__menu" aria-label="ניווט ראשי">
                    <ul className="list-unstyled">
                      {MOONLIT_NAV.map((link) =>
                        link.submenu ? (
                          <li
                            key={link.label}
                            className={`navigation__menu--item has-child has-arrow${
                              link.submenu.some((s) => isActive(s.href)) ? ' active' : ''
                            }`}
                          >
                            <a href="#" className="navigation__menu--item__link" onClick={(e) => e.preventDefault()}>
                              {link.label}
                            </a>
                            <ul className="submenu sub__style" role="menu">
                              {link.submenu.map((sub) => (
                                <li role="menuitem" key={sub.href}>
                                  <Link href={sub.href}>{sub.label}</Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ) : (
                          <li
                            key={link.href}
                            className={`navigation__menu--item${isActive(link.href) ? ' active' : ''}`}
                          >
                            <Link href={link.href} className="navigation__menu--item__link">
                              {link.label}
                            </Link>
                          </li>
                        )
                      )}
                    </ul>
                  </nav>
                </div>
              </div>

              <div className="main__logo">
                <Link href="/" aria-label="Aiterra — דף הבית">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="logo__class" src="/aiterra-dark-logo.png" alt="Aiterra" height={38} />
                </Link>
              </div>

              <div className="main__right">
                <Link href="/apartments" className="theme-btn btn-style sm-btn border d-none d-lg-block">
                  <span>הנכסים שלנו</span>
                </Link>
                {telHref && (
                  <a href={telHref} className="theme-btn btn-style sm-btn fill" aria-label="התקשרו אלינו">
                    <span className="ltr">{phone}</span>
                  </a>
                )}
                <button
                  type="button"
                  className="theme-btn btn-style sm-btn fill menu__btn d-lg-none"
                  aria-label="פתיחת תפריט"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen(true)}
                >
                  <span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/moonlit/images/icon/menu-icon.svg" alt="" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* mobile drawer — meanmenu is a jQuery plugin, so this is our own
          offcanvas using the template's menu styling */}
      {menuOpen && (
        <div className="moonlit__offcanvas">
          <button
            type="button"
            aria-label="סגירת תפריט"
            className="moonlit__offcanvas__backdrop"
            onClick={() => setMenuOpen(false)}
          />
          <div className="moonlit__offcanvas__panel">
            <div className="moonlit__offcanvas__head">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/aiterra-dark-logo.png" alt="Aiterra" height={32} />
              <button type="button" aria-label="סגירת תפריט" onClick={() => setMenuOpen(false)}>
                ✕
              </button>
            </div>
            <ul className="list-unstyled moonlit__offcanvas__menu">
              {MOONLIT_NAV.map((link) =>
                link.submenu ? (
                  <li key={link.label}>
                    <button
                      type="button"
                      aria-expanded={openGroup === link.label}
                      onClick={() => setOpenGroup(openGroup === link.label ? null : link.label)}
                    >
                      {link.label}
                      <span aria-hidden="true">{openGroup === link.label ? '−' : '+'}</span>
                    </button>
                    {openGroup === link.label && (
                      <ul className="list-unstyled">
                        {link.submenu.map((sub) => (
                          <li key={sub.href}>
                            <Link href={sub.href}>{sub.label}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ) : (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                )
              )}
            </ul>
            {telHref && (
              <a href={telHref} className="theme-btn btn-style fill w-100">
                <span className="ltr">{phone}</span>
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
