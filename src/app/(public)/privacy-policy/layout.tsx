import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://go-apartsale.online';

export const metadata: Metadata = {
  title: { absolute: 'מדיניות פרטיות | Aiterra' },
  description: 'מדיניות הפרטיות של משרד תיווך Aiterra. מידע על איסוף ושימוש בנתונים, הגנת הפרטיות וזכויות המשתמש.',
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
