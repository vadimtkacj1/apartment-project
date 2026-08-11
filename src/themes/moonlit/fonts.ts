import { Heebo, Secular_One } from 'next/font/google';

/**
 * MOONLIT TYPOGRAPHY — both faces are free (SIL Open Font License), carry real
 * Hebrew glyphs, and are self-hosted by next/font, so no request ever leaves
 * the site.
 *
 * The bought template pairs Gilda Display with Jost; neither has Hebrew, so the
 * first build stacked each with a Hebrew stand-in (Frank Ruhl Libre / Rubik)
 * and let the browser pick per script. That split meant prices and other Latin
 * runs rendered in a different face than the Hebrew beside them. Every word on
 * this site is Hebrew apart from the numerals, so the pair is now chosen for
 * Hebrew first and used for both scripts — one face per role, no mixing:
 *
 *   --glida → Secular One  (display: section titles, card titles)
 *   --jost  → Heebo        (everything else: body, meta, buttons, prices)
 */

export const secularOne = Secular_One({
  subsets: ['hebrew', 'latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-secular',
});

export const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '700', '800'],
  display: 'swap',
  variable: '--font-heebo',
});

/** Class list that activates both faces on the moonlit wrapper. */
export const moonlitFontVariables = [secularOne.variable, heebo.variable].join(' ');

/**
 * The template reads `--glida` / `--jost` everywhere. Emitted as an inline
 * <style> after the template stylesheets so these win over its own stack.
 */
export const moonlitFontFaceCss = `
:root, .moonlit-tpl {
  --glida: ${secularOne.style.fontFamily}, Georgia, serif;
  --jost: ${heebo.style.fontFamily}, Arial, Helvetica, sans-serif;
}
`;
