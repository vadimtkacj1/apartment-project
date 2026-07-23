import React from 'react';

interface SectionEyebrowProps {
  children: React.ReactNode;
  /** 'light' for tinted/white bands (indigo #354AC4); 'dark' for navy bands (sky #7FB4F5). */
  tone?: 'light' | 'dark';
  /** 'center' flanks the label with a rule on both sides; 'start' rules the inline-start side only. */
  align?: 'center' | 'start';
  className?: string;
}

/**
 * Shared section eyebrow — a small brand-blue label flanked by a hairline accent
 * rule. Replaces the bare colored <span> each homepage section rolled by hand, so
 * the eyebrow → heading rhythm reads identically across the page. Palette-only:
 * indigo #354AC4 on light bands, sky #7FB4F5 on the navy bands.
 */
const SectionEyebrow: React.FC<SectionEyebrowProps> = ({
  children,
  tone = 'light',
  align = 'center',
  className = '',
}) => {
  const color = tone === 'dark' ? '#7FB4F5' : '#354AC4';
  const ruleColor = tone === 'dark' ? 'rgba(127,180,245,0.45)' : 'rgba(53,74,196,0.30)';
  const rule = <span aria-hidden className="h-px w-7 shrink-0" style={{ background: ruleColor }} />;

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {rule}
      <span
        className="text-[15px] md:text-[17px] font-bold tracking-[0.05em]"
        style={{ color }}
      >
        {children}
      </span>
      {align === 'center' && rule}
    </span>
  );
};

export default SectionEyebrow;
