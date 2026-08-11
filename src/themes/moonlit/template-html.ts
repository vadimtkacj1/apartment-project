import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';

/**
 * LITERAL TEMPLATE RENDERING.
 *
 * Re-writing the template's pages as JSX loses details — a wrapper here, a
 * shape there. So for the inner pages we keep the template's own HTML and only
 * swap its content: load `public/moonlit/pages/<file>.html`, edit it with
 * cheerio, and hand the result to React as raw markup inside the moonlit shell
 * (which already loads the template's stylesheets).
 *
 * Interactive parts (forms, sliders) are cut out as MARKERS: the caller splits
 * the HTML on them and renders a React island in their place.
 */

export type Marker = string;

/** `<!--MOONLIT:form-->` etc. — safe to split a string on. */
export function marker(name: string): Marker {
  return `<!--MOONLIT:${name}-->`;
}

const PAGES_DIR = path.join(process.cwd(), 'public', 'moonlit', 'pages');

/** Load a template page and hand back a cheerio document. */
export async function loadTemplatePage(file: string) {
  const html = await fs.readFile(path.join(PAGES_DIR, file), 'utf-8');
  return cheerio.load(html);
}

/**
 * Everything the theme already provides (chrome, preloader, cookie bar, the
 * template's own scripts) is dropped — we keep only the page body.
 */
export function extractBody($: cheerio.CheerioAPI): string {
  $('header, footer, script, .loader-wrapper, .loader-section, .rts__back__top, .header__top, #cookit, [id^="gdpr"]').remove();
  $('.modal, .offcanvas').remove();
  // The template ships wow.js reveal classes; without the plugin they'd stay hidden.
  $('.wow').removeClass('wow').removeAttr('data-wow-delay');
  // Asset paths are relative to the template root — point them at /moonlit.
  $('img[src^="assets/"]').each((_, el) => {
    const src = $(el).attr('src') ?? '';
    $(el).attr('src', '/moonlit-ref/' + src);
  });
  $('[style*="assets/"]').each((_, el) => {
    const style = $(el).attr('style') ?? '';
    $(el).attr('style', style.replace(/assets\//g, '/moonlit-ref/assets/'));
  });
  return $('body').html() ?? '';
}

/** Split rendered HTML into the chunks around each marker, in order. */
export function splitOnMarkers(html: string, markers: Marker[]): string[] {
  let parts = [html];
  for (const m of markers) {
    const last = parts.pop() as string;
    const idx = last.indexOf(m);
    if (idx === -1) {
      parts.push(last, '');
      continue;
    }
    parts.push(last.slice(0, idx), last.slice(idx + m.length));
  }
  return parts;
}
