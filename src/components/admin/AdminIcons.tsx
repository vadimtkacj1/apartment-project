import React from 'react';

/**
 * Aiterra admin icon set — custom, on-brand glyphs in the same geometric,
 * solid-fill language as the sidebar SVGs (src/config/adminSections.tsx):
 * 24×24 viewBox, `fill="currentColor"`, sized via `className` so they inherit
 * the KPI-chip accent color. Prefer these over generic lucide icons for admin
 * KPI tiles / stat chips so the whole panel reads as one designed system.
 */

type IconProps = { className?: string };

function Svg({ className = 'size-5', children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      {children}
    </svg>
  );
}

/* ---- properties / portfolio ---- */
export const IcBuilding = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 21V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3h4a2 2 0 0 1 2 2v10H4Zm3-11h3V7H7v3Zm0 5h3v-3H7v3Zm0 4h3v-2H7v2Zm9 0h3v-2h-3v2Zm0-4h3v-3h-3v3Z" />
  </Svg>
);
export const IcTag = (p: IconProps) => (
  <Svg {...p}>
    <path d="M11.6 3H5a2 2 0 0 0-2 2v6.6a2 2 0 0 0 .6 1.4l7.4 7.4a2 2 0 0 0 2.8 0l6.6-6.6a2 2 0 0 0 0-2.8L13 3.6A2 2 0 0 0 11.6 3ZM7.5 9A1.5 1.5 0 1 1 9 7.5 1.5 1.5 0 0 1 7.5 9Z" />
  </Svg>
);
export const IcKey = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14.5 3a6.5 6.5 0 0 0-6.3 8.2L3 16.4V21h4.6l1-1v-2h2v-2h2l1.2-1.2A6.5 6.5 0 1 0 14.5 3Zm2 5a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 16.5 8Z" />
  </Svg>
);

/* ---- status ---- */
export const IcCheckCircle = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-1 14.4L6.6 12l1.4-1.4 3 3 5-5L17.4 10Z" />
  </Svg>
);
export const IcBan = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2ZM4 12a8 8 0 0 1 12.9-6.3L5.7 16.9A8 8 0 0 1 4 12Zm8 8a8 8 0 0 1-4.9-1.7L18.3 7.1A8 8 0 0 1 12 20Z" />
  </Svg>
);
export const IcClock = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 10.4-3.3 1.9-1-1.7 2.3-1.3V6.5h2Z" />
  </Svg>
);
export const IcStar = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.5 14.6 9l6 .6-4.5 4 1.3 5.9L12 16.5 6.6 19.5 7.9 13.6 3.4 9.6l6-.6Z" />
  </Svg>
);

/* ---- people ---- */
export const IcUser = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.9 0-7 2.5-7 5.5V21h14v-1.5c0-3-3.1-5.5-7-5.5Z" />
  </Svg>
);
export const IcUsers = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 11a3.2 3.2 0 1 0-3.2-3.2A3.2 3.2 0 0 0 9 11Zm7 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm0 2c-2.3 0-4 1.3-4 3v2h8v-2c0-1.7-1.7-3-4-3Zm-7 .2c-3 0-5.5 1.6-5.5 3.8V19H10v-2c0-1.3.6-2.5 1.6-3.4A8.4 8.4 0 0 0 9 13.2Z" />
  </Svg>
);
export const IcUserCheck = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.6 0-6.5 2.2-6.5 5V21H13v-2c0-2.8 2.9-5 6.5-5A11 11 0 0 0 9 14Zm10.6-1.9L16 15.7l-1.6-1.6L13 15.5l3 3 5-5Z" />
  </Svg>
);
export const IcUserX = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.6 0-6.5 2.2-6.5 5V21H13v-2c0-2.8 2.9-5 6.5-5A11 11 0 0 0 9 14Zm11.9-.6-1.4-1.4-1.7 1.7-1.7-1.7-1.4 1.4L16.4 16l-1.7 1.7 1.4 1.4L17.8 17.4l1.7 1.7 1.4-1.4L19.2 16Z" />
  </Svg>
);

/* ---- analytics / traffic ---- */
export const IcEye = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5C6.5 5 2.7 9.4 1.5 11.4a1.2 1.2 0 0 0 0 1.2C2.7 14.6 6.5 19 12 19s9.3-4.4 10.5-6.4a1.2 1.2 0 0 0 0-1.2C21.3 9.4 17.5 5 12 5Zm0 10.5A3.5 3.5 0 1 1 15.5 12 3.5 3.5 0 0 1 12 15.5Zm0-5.5A2 2 0 1 0 14 12 2 2 0 0 0 12 10Z" />
  </Svg>
);
export const IcCursor = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 3l14 8-6 1.6L18 18l-2.4 1.3L11.8 13 8 16Z" />
  </Svg>
);
export const IcTrendUp = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 17l6-6 4 4 6-6.5V13h2V5h-8v2h3.6L13 12l-4-4-7 7Z" />
  </Svg>
);

/* ---- inquiries / contact ---- */
export const IcInbox = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 11v5h14v-5h-4a3 3 0 0 1-6 0Zm0-2h4.6a1 1 0 0 1 1 1 1.4 1.4 0 0 0 2.8 0 1 1 0 0 1 1-1H19V5H5Z" />
  </Svg>
);
export const IcChat = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
  </Svg>
);
export const IcPhone = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.6 3H4a1 1 0 0 0-1 1.1A16 16 0 0 0 19.9 21a1 1 0 0 0 1.1-1v-2.6a1 1 0 0 0-.8-1l-3.6-.7a1 1 0 0 0-1 .4l-1 1.3a12.5 12.5 0 0 1-5-5l1.3-1a1 1 0 0 0 .4-1L9.6 3.8a1 1 0 0 0-1-.8Z" />
  </Svg>
);
export const IcMail = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm8 7 8-5H4Zm0 2.3L4 9.2V17h16V9.2Z" />
  </Svg>
);
