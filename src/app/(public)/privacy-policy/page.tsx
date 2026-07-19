import type { Metadata } from 'next';
import PrivacyPolicyContent from './PrivacyPolicyContent';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://go-apartsale.online';

export const metadata: Metadata = {
  title: 'מדיניות פרטיות | Aiterra',
  description: 'מדיניות הפרטיות של משרד Aiterra ויואב אלמוג: איסוף מידע, שימוש, הגנה על פרטיות וזכויות המשתמש בהתאם לחוק הגנת הפרטיות הישראלי.',
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
