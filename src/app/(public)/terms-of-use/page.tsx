import type { Metadata } from 'next';
import TermsOfUseContent from './TermsOfUseContent';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: { absolute: 'תקנון ותנאי שימוש | רם נכסים חיים ענבי' },
  description: 'תקנון ותנאי השימוש באתר משרד רם שיווק נכסים וחיים ענבי: מהות האתר, קניין רוחני, הגבלת אחריות, דין וסמכות שיפוט.',
  alternates: {
    canonical: `${siteUrl}/terms-of-use`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function TermsOfUsePage() {
  return <TermsOfUseContent />;
}
