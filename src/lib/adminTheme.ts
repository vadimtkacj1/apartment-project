import type { ThemeConfig } from 'antd';

/**
 * Centralized Ant Design theme for the admin panel — "Clean Slate".
 *
 * Palette: brand navy as the single primary action color, gold as a sparing
 * accent, on a calm cool-neutral surface system (so white cards read crisply
 * against the page). Flat (no shadows), one neutral hairline per surface.
 *
 *   navy   #1C3664  -> primary actions, links, active nav, headings, focus
 *   gold   #C5A357  -> accent only (dots / badges / chips), never body text
 *   bg     #F4F6F8  -> page background (cool light grey)
 *   card   #FFFFFF  -> surfaces
 *   line   #E6E8EC  -> neutral hairline (never paired with a shadow)
 *
 * Single source of truth — passed to <ConfigProvider> in admin/layout.tsx.
 *
 * Status colors are a deliberately MUTED, editorial set (forest / ochre / brick)
 * — antd's saturated defaults (#52c41a / #faad14 / #ff4d4f) read "neon/AI" and
 * clash with navy+gold. success (5.0:1) and danger (5.4:1) clear AA on white so
 * they're safe as colored KPI text; warning is an ochre fill/accent (AA-large,
 * 3.6:1) never used as body text. Info stays navy (the brand primary).
 */
export const BRAND = {
  navy: '#1C3664',
  navyHover: '#2A4A8A',
  navyActive: '#152A4F',
  navyTint: 'rgba(28, 54, 100, 0.06)',
  gold: '#C5A357',
  goldHover: '#D4B46B',
  // Accessible gold for TEXT on light surfaces (bright gold ~2.4:1 fails AA).
  goldText: '#8A6D2F',
  // Clean-Slate neutrals (a single cool-slate ramp — no antd default greys)
  bg: '#F4F6F8', // page background
  bgHover: '#EEF1F5', // subtle hover fill
  surface: '#FFFFFF', // cards
  hairline: '#E6E8EC', // card/divider border
  hairlineStrong: '#DCDFE5', // inputs
  textBody: '#1E293B', // slate-800
  textSecondary: '#475569', // slate-600 — secondary text (7:1 on white)
  textMuted: '#64748B', // slate-500 — labels/captions (AA)
  textFaint: '#94A3B8', // slate-400 — placeholders/disabled (non-essential only)
  // Muted semantic palette — all AA on white; harmonize with navy + gold.
  success: '#2F7D5A', // forest green   (~5.0:1)
  warning: '#B7791F', // ochre amber    (distinct from the gold accent)
  danger: '#C0392B', // brick red      (~5.4:1)
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
    colorTextHeading: BRAND.navy,
    colorBorder: BRAND.hairlineStrong, // inputs, dividers
    colorBorderSecondary: BRAND.hairline, // cards
    borderRadius: 8,
    fontFamily: 'var(--font-assistant), Arial, Helvetica, sans-serif',
  },
  components: {
    Button: {
      fontWeight: 600,
      primaryShadow: 'none', // flat — no glow (calm, not "AI")
    },
    Menu: {
      itemSelectedColor: BRAND.navy,
      itemSelectedBg: BRAND.navyTint,
      itemActiveBg: BRAND.navyTint,
    },
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
    },
  },
};
