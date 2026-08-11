import React from 'react';

import type { ThemeDef } from '../registry';
import type { MoonlitContact } from './data';
import type { MoonlitContentData } from './content';
import MoonlitHeader from './MoonlitHeader';
import MoonlitFooter from './MoonlitFooter';
import BackToTop from './BackToTop';
import { moonlitFontFaceCss, moonlitFontVariables } from './fonts';
import './skin.css';

interface Props {
  theme: ThemeDef;
  contact: MoonlitContact;
  /** Admin-managed theme content (/admin/design). */
  content: MoonlitContentData;
  children: React.ReactNode;
  /** Floating widgets (accessibility, WhatsApp) — kept outside <main>. */
  widgets?: React.ReactNode;
}

/**
 * Public shell for the moonlit family.
 *
 * The template's own stylesheets are served from /public/moonlit/css (run
 * through rtlcss, see scripts/build-moonlit-css.md) and linked here rather than
 * imported, so they load ONLY while a moonlit theme is active — the classic
 * theme and the whole admin panel never download them.
 *
 * Order matters: plugins (bootstrap + swiper) → template style → icon font →
 * our overrides → the font-variable mapping.
 */
export default function MoonlitShell({ theme, contact, content, children, widgets }: Props) {
  const dark = theme.tokens.scheme === 'dark';

  return (
    <>
      {/* eslint-disable @next/next/no-css-tags */}
      <link rel="stylesheet" href="/moonlit/css/plugins.rtl.min.css" />
      <link rel="stylesheet" href="/moonlit/css/style.rtl.css" />
      <link rel="stylesheet" href="/moonlit/fonts/flaticon_bokinn.css" />
      <link rel="stylesheet" href="/moonlit/css/overrides.css" />
      {/* eslint-enable @next/next/no-css-tags */}
      <style dangerouslySetInnerHTML={{ __html: moonlitFontFaceCss }} />
      {/* The root layout hard-codes a light body for the classic theme. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `html,body{background:${dark ? '#2B2B2B' : '#ffffff'} !important;color-scheme:${
            dark ? 'dark' : 'light'
          } !important;}`,
        }}
      />

      <div
        className={`moonlit-tpl ${moonlitFontVariables}`}
        dir="rtl"
        data-theme={dark ? 'dark' : 'light'}
        data-variant={theme.variant}
      >
        <MoonlitHeader contact={contact} nav={content.navItems} />
        <main>{children}</main>
        <MoonlitFooter contact={contact} content={content} />
        <BackToTop />
        {widgets}
      </div>
    </>
  );
}
