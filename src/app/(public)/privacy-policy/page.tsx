import type { Metadata } from 'next';
import PrivacyPolicyContent from './PrivacyPolicyContent';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: 'מדיניות פרטיות | רם נכסים חיים ענבי',
  description: 'מדיניות הפרטיות של משרד רם שיווק נכסים וחיים ענבי: איסוף מידע, שימוש, הגנה על פרטיות וזכויות המשתמש בהתאם לחוק הגנת הפרטיות הישראלי.',
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />;
}
