import type { Metadata } from 'next';
import AccessibilityContent from './AccessibilityContent';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://go-apartsale.online';

export const metadata: Metadata = {
  title: 'הצהרת נגישות | Aiterra',
  description: 'הצהרת נגישות של אתר Aiterra: תאימות WCAG 2.1 ברמת AA, תפריט נגישות מובנה, ניווט מקלדת ותמיכה בקוראי מסך. לפניות לרכז הנגישות — דניאל שרון.',
  alternates: {
    canonical: `${siteUrl}/accessibility`,
  },
};

export default function AccessibilityPage() {
  return <AccessibilityContent />;
}
