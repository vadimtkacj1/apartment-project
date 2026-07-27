/**
 * PUBLIC-SITE THEMES — single source of truth.
 *
 * A theme is a full skin for the public site: chrome (header/footer), homepage
 * layout, and the colour/typography tokens every other public page inherits.
 * The active theme id lives in the DB (`SiteSettings.activeTheme`) and is
 * chosen from /admin/design.
 *
 *   ➕ To ADD a theme: add an entry to THEMES below. If it belongs to the
 *      'moonlit' family it needs no new components — pick a `variant` that an
 *      existing homepage layout already implements, or add one in
 *      src/themes/moonlit/MoonlitHome.tsx.
 */

export type ThemeId = 'classic' | 'moonlit-luxe' | 'moonlit-dark';

/** Which component set renders the chrome + homepage for this theme. */
export type ThemeFamily = 'classic' | 'moonlit';

/** Homepage anatomy inside the moonlit family. */
export type MoonlitVariant = 'luxe' | 'dark';

/**
 * Colour + shape tokens. Emitted as CSS custom properties (`--th-*`) on the
 * public wrapper, so any page can read them and the skin stylesheet can remap
 * the site's legacy hard-coded palette onto them.
 */
export interface ThemeTokens {
  /** Page canvas. */
  bg: string;
  /** Tinted band that alternates with the canvas. */
  bgAlt: string;
  /** Cards / raised surfaces. */
  surface: string;
  /** Secondary surface (inputs, chips). */
  surfaceAlt: string;
  /** Headings. */
  ink: string;
  /** Body copy. */
  body: string;
  /** De-emphasised copy (meta, captions). */
  muted: string;
  /** Brand accent — buttons, links, ornaments. */
  accent: string;
  /** Accent tint for soft fills. */
  accentSoft: string;
  /** Readable ink on top of `accent`. */
  accentInk: string;
  /** Hairlines and card borders. */
  line: string;
  /** Dark chrome (top bar, footer, image scrims). */
  dark: string;
  /** Ink on top of `dark`. */
  onDark: string;
  /** Corner radius for cards/buttons. */
  radius: string;
  /** Drives `color-scheme` + form-control rendering. */
  scheme: 'light' | 'dark';
}

export interface ThemeDef {
  id: ThemeId;
  family: ThemeFamily;
  /** Homepage anatomy (moonlit family only). */
  variant?: MoonlitVariant;
  /** Admin-facing name, both admin languages. */
  name: { he: string; en: string };
  /** One-line admin-facing description. */
  description: { he: string; en: string };
  tokens: ThemeTokens;
}

/** The site's original Aiterra design — the default, and the safe fallback. */
const CLASSIC: ThemeDef = {
  id: 'classic',
  family: 'classic',
  name: { he: 'קלאסי — Aiterra', en: 'Classic — Aiterra' },
  description: {
    he: 'העיצוב הנוכחי של האתר: כחול Aiterra, כרטיסים לבנים, טיפוגרפיה נקייה.',
    en: 'The site as it is today: Aiterra blue, white cards, clean sans typography.',
  },
  tokens: {
    bg: '#f5f7fb',
    bgAlt: '#eef2fb',
    surface: '#ffffff',
    surfaceAlt: '#f4f6fb',
    ink: '#051150',
    body: '#475569',
    muted: '#94a3b8',
    accent: '#354ac4',
    accentSoft: '#eaf1fe',
    accentInk: '#ffffff',
    line: '#e4e8f2',
    dark: '#051150',
    onDark: '#ffffff',
    radius: '14px',
    scheme: 'light',
  },
};

/* The moonlit family shares one design DNA — brass accent (#AB8A62), serif
   display headings, generous editorial rhythm — and differs by canvas and by
   homepage anatomy. */

const MOONLIT_LUXE: ThemeDef = {
  id: 'moonlit-luxe',
  family: 'moonlit',
  variant: 'luxe',
  name: { he: 'Moonlit — יוקרה בהיר', en: 'Moonlit — Luxe (light)' },
  description: {
    he: 'תבנית Moonlit המקורית ב־RTL: לבן חם, זהב־פליז וכותרות סריף. באנר מתחלף, סרגל חיפוש צף, קרוסלת נכסים.',
    en: 'The original Moonlit page, mirrored to RTL: warm white, brass accent, serif headings, banner slider and floating search bar.',
  },
  tokens: {
    bg: '#F8F4EF',
    bgAlt: '#F1E9DF',
    surface: '#FFFFFF',
    surfaceAlt: '#FBF7F2',
    ink: '#1B1B1B',
    body: '#65676B',
    muted: '#8E8B86',
    accent: '#AB8A62',
    accentSoft: '#F0E5D8',
    accentInk: '#FFFFFF',
    line: 'rgba(125, 128, 135, 0.25)',
    dark: '#1B1B1B',
    onDark: '#F5F0EA',
    radius: '4px',
    scheme: 'light',
  },
};

const MOONLIT_DARK: ThemeDef = {
  id: 'moonlit-dark',
  family: 'moonlit',
  variant: 'dark',
  name: { he: 'Moonlit — לילה כהה', en: 'Moonlit — Dark' },
  description: {
    he: 'אותו עמוד בדיוק בגרסת הלילה של התבנית (index-dark): קנבס פחם וזהב־פליז.',
    en: 'The very same page in the template night mode (index-dark): charcoal canvas with brass.',
  },
  tokens: {
    bg: '#232323',
    bgAlt: '#1B1B1B',
    surface: '#2B2B2B',
    surfaceAlt: '#333333',
    ink: '#FAFAFA',
    body: '#CFC9C2',
    muted: '#9A948D',
    accent: '#C2A177',
    accentSoft: 'rgba(194, 161, 119, 0.16)',
    accentInk: '#1B1B1B',
    line: 'rgba(255, 255, 255, 0.14)',
    dark: '#141414',
    onDark: '#F5F0EA',
    radius: '4px',
    scheme: 'dark',
  },
};

export const THEMES: ThemeDef[] = [CLASSIC, MOONLIT_LUXE, MOONLIT_DARK];

export const DEFAULT_THEME_ID: ThemeId = 'classic';

/** Resolve an id (from DB / URL) to a theme, falling back to the default. */
export function resolveTheme(id: string | null | undefined): ThemeDef {
  return THEMES.find((t) => t.id === id) ?? CLASSIC;
}

export function isThemeId(id: string | null | undefined): id is ThemeId {
  return THEMES.some((t) => t.id === id);
}

/** Token map as CSS custom properties — spread onto a wrapper's `style`. */
export function themeCssVars(theme: ThemeDef): Record<string, string> {
  const t = theme.tokens;
  return {
    '--th-bg': t.bg,
    '--th-bg-alt': t.bgAlt,
    '--th-surface': t.surface,
    '--th-surface-alt': t.surfaceAlt,
    '--th-ink': t.ink,
    '--th-body': t.body,
    '--th-muted': t.muted,
    '--th-accent': t.accent,
    '--th-accent-soft': t.accentSoft,
    '--th-accent-ink': t.accentInk,
    '--th-line': t.line,
    '--th-dark': t.dark,
    '--th-on-dark': t.onDark,
    '--th-radius': t.radius,
  };
}
