import { Frank_Ruhl_Libre, Gilda_Display, Jost, Rubik } from 'next/font/google';

/**
 * MOONLIT TYPOGRAPHY — all four faces are free (SIL Open Font License) and are
 * self-hosted by next/font, so no request ever leaves the site.
 *
 * The template pairs Gilda Display (display serif) with Jost (geometric sans).
 * Neither has Hebrew glyphs, so each is stacked with its Hebrew counterpart:
 * the browser takes Latin glyphs (numbers, "Moonlit", ₪ prices in LTR) from the
 * original face and Hebrew glyphs from the matched one.
 *
 *   --glida → Gilda Display  →  Frank Ruhl Libre   (Hebrew serif, same era/feel)
 *   --jost  → Jost           →  Rubik              (Hebrew geometric sans)
 */

export const gildaDisplay = Gilda_Display({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-gilda',
});

export const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-jost',
});

export const frankRuhlLibre = Frank_Ruhl_Libre({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-frank',
});

export const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-rubik',
});

/** Class list that activates all four faces on the moonlit wrapper. */
export const moonlitFontVariables = [
  gildaDisplay.variable,
  jost.variable,
  frankRuhlLibre.variable,
  rubik.variable,
].join(' ');

/**
 * The template reads `--glida` / `--jost` everywhere. Emitted as an inline
 * <style> after the template stylesheets so the Hebrew fallbacks win.
 */
export const moonlitFontFaceCss = `
:root, .moonlit-tpl {
  --glida: ${gildaDisplay.style.fontFamily}, ${frankRuhlLibre.style.fontFamily}, Georgia, serif;
  --jost: ${jost.style.fontFamily}, ${rubik.style.fontFamily}, Arial, Helvetica, sans-serif;
}
`;
