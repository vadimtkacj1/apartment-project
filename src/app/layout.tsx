import type { Metadata } from "next";
import localFont from "next/font/local";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import Providers from "@/components/Providers";
import "./globals.css";

const assistant = localFont({
  src: [
    {
      path: '../../public/fonts/static/Assistant-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/static/Assistant-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/static/Assistant-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/static/Assistant-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/static/Assistant-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-assistant',
});

export const metadata: Metadata = {
  title: "Apartment Project",
  description: "Next.js apartment project with Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${assistant.variable} antialiased`}>
        <Providers>
          {children}
          <AccessibilityWidget />
        </Providers>
      </body>
    </html>
  );
}
