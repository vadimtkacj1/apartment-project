import type { Metadata } from 'next';
import AccessibilityContent from './AccessibilityContent';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: 'הצהרת נגישות | רם נכסים חיים ענבי',
  description: 'הצהרת נגישות של אתר רם נכסים: תאימות WCAG 2.1 ברמת AA, תפריט נגישות מובנה, ניווט מקלדת ותמיכה בקוראי מסך. לפניות לרכז הנגישות — רם מזרחי.',
  alternates: {
    canonical: `${siteUrl}/accessibility`,
  },
};

export default function AccessibilityPage() {
  return <AccessibilityContent />;
}
