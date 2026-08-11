import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: { absolute: 'מדיניות פרטיות | רם נכסים חיים ענבי' },
  description: 'מדיניות הפרטיות של משרד תיווך רם נכסים חיים ענבי. מידע על איסוף ושימוש בנתונים, הגנת הפרטיות וזכויות המשתמש.',
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
