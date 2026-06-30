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
 * Status colors (success/warning/error) stay at antd defaults.
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
  // Clean-Slate neutrals
  bg: '#F4F6F8', // page background
  bgHover: '#EEF1F5', // subtle hover fill
  surface: '#FFFFFF', // cards
  hairline: '#E6E8EC', // card/divider border
  hairlineStrong: '#DCDFE5', // inputs
  textBody: '#1E293B',
  textMuted: '#64748B',
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
    colorBgLayout: BRAND.bg,
    colorBgContainer: BRAND.surface,
    colorText: BRAND.textBody,
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
