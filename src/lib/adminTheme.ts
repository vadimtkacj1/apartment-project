import type { ThemeConfig } from 'antd';

/**
 * Centralized Ant Design theme for the admin panel — Aiterra brand.
 *
 * Aiterra is a BLUE-FORWARD, gradient-led identity (the möbius logo sweeps
 * deep-navy -> indigo -> bright blue). The full four-blue palette + that
 * signature gradient are used expressively: the gradient is the brand signature
 * on hero/brand surfaces (masthead, sidebar logo, active nav, primary buttons,
 * chart fills); white cards float on a faintly blue-washed canvas with
 * blue-tinted elevation (shadows tie back to blue, not grey — à la Deta Surf).
 * Content stays on white cards so data reads crisply (Clearbit discipline).
 *
 *   ink    #051150  -> headings, dark brand surfaces, logo (gradient start)
 *   indigo #354AC4  -> primary actions, links, active nav, focus (gradient mid)
 *   blue   #5594F1  -> accent, chips, chart series, CTA-on-dark (gradient end)
 *   sky    #7FB4F5  -> lighter 4th tone: secondary chart series, soft accents
 *   wash   #E8F0FD  -> pale blue surface tint (chips / washed rows)
 *   bg     #F4F6FB  -> page background (cool blue-grey, faint top wash)
 *   card   #FFFFFF  -> surfaces (blue-tinted soft elevation)
 *   line   #E4E8F2  -> neutral hairline
 *
 * Single source of truth — passed to <ConfigProvider> in admin/layout.tsx.
 *
 * Status colors are a deliberately MUTED, editorial set (forest / ochre /
 * brick) — antd's saturated defaults read "neon/AI" and clash with the blue
 * family. success (5.0:1) and danger (5.4:1) clear AA on white so they're safe
 * as colored KPI text; warning is an ochre fill/accent (AA-large) never used as
 * body text. Info stays indigo (the brand primary).
 *
 * Contrast note: white text is safe on ink/indigo (>=7:1) and on the
 * navy->indigo masthead gradient, but NOT on bright blue #5594F1 (~3:1) — small
 * text on blue must use ink #051150 or the AA accent #2A69C4.
 */
export const BRAND = {
  navy: '#354AC4', // primary (brand indigo)
  navyHover: '#4A5FD6',
  navyActive: '#28389B',
  navyTint: 'rgba(53, 74, 196, 0.07)',
  ink: '#051150', // headings / dark brand surfaces / logo (gradient start)
  gold: '#5594F1', // accent (brand bright blue) — fills/dots/charts (gradient end)
  goldHover: '#78A9F5',
  // Accessible accent for TEXT on light surfaces (bright blue ~3.1:1 fails AA).
  goldText: '#2A69C4',
  goldTint: 'rgba(85, 148, 241, 0.14)', // blue wash for chips/badges
  skyLight: '#7FB4F5', // lighter 4th blue — secondary chart series / soft accents
  wash: '#E8F0FD', // pale blue surface tint
  // Brand gradients — the möbius signature.
  gradient: 'linear-gradient(120deg, #051150 0%, #28389B 52%, #354AC4 100%)', // masthead/dark brand bar (white-text safe)
  gradientVivid: 'linear-gradient(135deg, #051150 0%, #354AC4 55%, #5594F1 100%)', // logo tile / decorative accents
  gradientAction: 'linear-gradient(135deg, #354AC4 0%, #4A5FD6 100%)', // primary buttons / active nav (white-text safe)
  glow: '0 2px 10px rgba(53, 74, 196, 0.06)', // blue-tinted card elevation
  glowStrong: '0 6px 18px rgba(53, 74, 196, 0.16)', // brand-surface lift
  // Clean-Slate neutrals (a single cool-slate ramp — no antd default greys)
  bg: '#F4F6FB', // page background
  bgHover: '#EDF1F9', // subtle hover fill
  surface: '#FFFFFF', // cards
  hairline: '#E4E8F2', // card/divider border
  hairlineStrong: '#D8DEEC', // inputs
  textBody: '#1E293B', // slate-800
  textSecondary: '#475569', // slate-600 — secondary text (7:1 on white)
  textMuted: '#64748B', // slate-500 — labels/captions (AA)
  textFaint: '#94A3B8', // slate-400 — placeholders/disabled (non-essential only)
  // Strict blue palette — status colors live inside the 4-blue family (no green/
  // ochre). Only `danger` stays red, reserved for destructive DELETE actions +
  // form-validation errors (a universal safety affordance), never decoration.
  success: '#2A69C4', // positive / done — accent blue (AA on white)
  warning: '#354AC4', // needs-attention — indigo (distinct on the light UI)
  danger: '#C0392B', // DESTRUCTIVE ONLY (delete / form error). not for stats.
  soldMuted: '#64748B', // decorative "sold/inactive" — muted slate, not red
} as const;

export const adminTheme: ThemeConfig = {
  token: {
    colorPrimary: BRAND.navy,
    colorPrimaryHover: BRAND.navyHover,
    colorPrimaryActive: BRAND.navyActive,
    colorInfo: BRAND.navy,
    colorLink: BRAND.navy,
    colorLinkHover: BRAND.navyHover,
    colorLinkActive: BRAND.navyActive,
    // Muted, on-brand status colors (replace antd's neon defaults everywhere:
    // Tags, Alerts, Badges, form validation, message/notification toasts).
    colorSuccess: BRAND.success,
    colorWarning: BRAND.warning,
    colorError: BRAND.danger,
    colorBgLayout: BRAND.bg,
    colorBgContainer: BRAND.surface,
    colorText: BRAND.textBody,
    colorTextSecondary: BRAND.textSecondary,
    colorTextTertiary: BRAND.textMuted,
    colorTextQuaternary: BRAND.textFaint,
    colorTextHeading: BRAND.ink,
    colorBorder: BRAND.hairlineStrong, // inputs, dividers
    colorBorderSecondary: BRAND.hairline, // cards
    borderRadius: 8,
    fontFamily: 'var(--font-assistant), Arial, Helvetica, sans-serif',
  },
  components: {
    Button: {
      borderRadius: 10,
      fontWeight: 600,
      // Flat buttons (Fernand/shadcn discipline) — depth belongs to overlays,
      // not controls. The brand gradient fill stays; only the glow goes.
      primaryShadow: 'none',
      defaultShadow: 'none',
      dangerShadow: 'none',
    },
    Input: { borderRadius: 10 },
    InputNumber: { borderRadius: 10 },
    Select: { borderRadius: 10 },
    DatePicker: { borderRadius: 10 },
    // nav styling lives in Sidenav.tsx
    Layout: {
      bodyBg: BRAND.bg,
      headerBg: BRAND.surface,
      siderBg: BRAND.surface,
    },
    Card: {
      borderRadiusLG: 12,
      colorBorderSecondary: BRAND.hairline,
    },
    Table: {
      headerBg: BRAND.bg,
      headerColor: BRAND.textMuted,
      rowHoverBg: BRAND.bg,
      borderColor: BRAND.hairline,
      // Quieter data tables: no vertical header splits, a touch more row air.
      headerSplitColor: 'transparent',
      cellPaddingBlock: 14,
    },
  },
};
