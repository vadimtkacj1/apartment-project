import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const openSansHebrew = localFont({
  src: [
    {
      path: '../../public/fonts/OpenSansHebrew-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/OpenSansHebrew-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/OpenSansHebrew-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-opensans-hebrew',
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
      <body className={`${openSansHebrew.variable} antialiased`}>
        {children}

        {/* Sienna Accessibility Widget */}
        <Script
          src="https://cdn.jsdelivr.net/npm/sienna-accessibility@latest/dist/sienna-accessibility.umd.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
