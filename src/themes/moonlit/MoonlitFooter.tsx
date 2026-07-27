import React from 'react';
import Link from 'next/link';

import NewsletterForm from './NewsletterForm';
import type { MoonlitContact } from './data';
import type { MoonlitContentData } from './content';

interface Props {
  /** Admin-managed contact block (/admin/contact/contact-info). */
  contact: MoonlitContact;
  /** Admin-managed footer copy + link columns (/admin/design). */
  content: Pick<MoonlitContentData, 'newsletterTitle' | 'footerAbout' | 'footerColumns'>;
}

/** The template's `rts__footer is__common__footer footer__background has__shape`. */
export default function MoonlitFooter({ contact, content }: Props) {
  const { phone, email, address, hours } = contact;
  const telHref = contact.phoneLink ?? (phone ? `tel:${phone.replace(/[^0-9+]/g, '')}` : null);
  const socials = [
    contact.facebook ? { label: 'Facebook', href: contact.facebook } : null,
    contact.instagram ? { label: 'Instagram', href: contact.instagram } : null,
    contact.linkedin ? { label: 'LinkedIn', href: contact.linkedin } : null,
    contact.whatsapp
      ? { label: 'WhatsApp', href: `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}` }
      : null,
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="rts__section rts__footer is__common__footer footer__background has__shape">
      <div className="section__shape">
        <div className="shape__1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/moonlit/images/footer/shape-1.svg" alt="" />
        </div>
        <div className="shape__2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/moonlit/images/footer/shape-2.svg" alt="" />
        </div>
        <div className="shape__3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/moonlit/images/footer/shape-3.svg" alt="" />
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="footer__newsletter">
            <span className="h2">{content.newsletterTitle}</span>
            <NewsletterForm />
          </div>
        </div>

        <div className="row">
          <div className="footer__widget__wrapper">
            <div className="rts__widget">
              <Link href="/">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="footer__logo" src="/aiterra-dark-logo.png" alt="Aiterra" height={34} />
              </Link>
              <p className="font-sm max-290 mt-20">{content.footerAbout}</p>
            </div>

            {content.footerColumns.map((col) => (
              <div className="rts__widget" key={col.title}>
                <span className="widget__title">{col.title}</span>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} aria-label="footer__link">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="rts__widget">
              <span className="widget__title">צרו קשר</span>
              <ul>
                {telHref && (
                  <li>
                    <a aria-label="footer__contact" href={telHref}>
                      <i className="flaticon-phone-flip" /> <span className="ltr">{phone}</span>
                    </a>
                  </li>
                )}
                {email && (
                  <li>
                    <a aria-label="footer__contact" href={contact.emailLink ?? `mailto:${email}`}>
                      <i className="flaticon-envelope" /> <span className="ltr">{email}</span>
                    </a>
                  </li>
                )}
                <li>
                  <span>
                    <i className="flaticon-marker" /> {address ?? 'חולון · בת ים · והמרכז'}
                  </span>
                </li>
                {hours && (
                  <li>
                    <span>
                      <i className="flaticon-clock" /> {hours}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="copyright__text">
        <div className="container">
          <div className="row">
            <div className="copyright__wrapper">
              <p className="mb-0">© {new Date().getFullYear()} Aiterra נדל״ן · כל הזכויות שמורות</p>
              <div className="footer__social__link">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="footer__social"
                    className="link__item"
                  >
                    {s.label}
                  </a>
                ))}
                <Link href="/privacy-policy" aria-label="footer__social" className="link__item">
                  מדיניות פרטיות
                </Link>
                <Link href="/accessibility" aria-label="footer__social" className="link__item">
                  הצהרת נגישות
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
