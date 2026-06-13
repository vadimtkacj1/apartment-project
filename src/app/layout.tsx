import type { Metadata, Viewport } from "next";
import React from "react";
import localFont from "next/font/local";
import StructuredData from "@/components/SEO/StructuredData";
import "./globals.css";

const assistant = localFont({
  src: '../../public/fonts/Assistant-VariableFont_wght.woff2',
  display: 'optional',
  variable: '--font-assistant',
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
  weight: '200 800',
  style: 'normal',
});

const caramel = localFont({
  src: '../../public/fonts/Carmela-Regular.woff2',
  display: 'optional',
  variable: '--font-caramel',
  fallback: ['cursive', 'sans-serif'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "רם נכסים חיים ענבי - תיווך נדל״ן בחולון",
    template: "%s | רם נכסים חיים ענבי"
  },
  description: "משרד תיווך ושיווק נדל״ן המתמחה בשיווק, מכירה והשכרה של דירות ונכסים בחולון והסביבה. ניסיון מצטבר של שנים בעולם הנדל״ן. דירות למכירה בחולון, דירות להשכרה בחולון, תיווך נדל״ן מקצועי.",
  keywords: ["תיווך נדל״ן", "דירות למכירה", "דירות להשכרה", "חולון", "נדל״ן", "תיווך", "תיווך נדל״ן בחולון", "דירות למכירה בחולון", "דירות להשכרה בחולון", "נדל״ן בחולון", "משרד תיווך חולון"],
  authors: [{ name: "רם נכסים חיים ענבי" }],
  creator: "רם נכסים חיים ענבי",
  publisher: "רם נכסים חיים ענבי",
  icons: {
    icon: '/favicon-rm.png',
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    alternateLocale: ['he_IL'],
    siteName: 'רם נכסים חיים ענבי',
    title: 'רם נכסים חיים ענבי - תיווך נדל״ן בחולון',
    description: 'משרד תיווך ושיווק נדל״ן המתמחה בשיווק, מכירה והשכרה של דירות ונכסים בחולון והסביבה. ניסיון מצטבר של שנים בעולם הנדל״ן.',
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/images/hero/main-hero.jpg`,
        width: 1200,
        height: 630,
        alt: 'רם נכסים חיים ענבי - תיווך נדל״ן בחולון',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'רם נכסים חיים ענבי - תיווך נדל״ן בחולון',
    description: 'משרד תיווך ושיווק נדל״ן המתמחה בשיווק, מכירה והשכרה של דירות ונכסים בחולון והסביבה.',
    images: [`${siteUrl}/images/hero/main-hero.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
  category: 'Real Estate',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#faf7f2',
  colorScheme: 'only light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" style={{ colorScheme: 'only light' } as React.CSSProperties}>
      <head>
        <meta name="color-scheme" content="light only" />
        <meta name="theme-color" content="#faf7f2" />
        <meta name="supported-color-schemes" content="light" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root { color-scheme: only light !important; }
          html { color-scheme: only light !important; background: #faf7f2 !important; }
          body { color-scheme: only light !important; background: #faf7f2 !important; color: #171717 !important; }
        `}} />
      </head>
      <body className={`${assistant.variable} ${caramel.variable} antialiased`}>
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
