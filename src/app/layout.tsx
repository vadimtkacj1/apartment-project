import type { Metadata, Viewport } from "next";
import React from "react";
import localFont from "next/font/local";
import StructuredData from "@/components/SEO/StructuredData";
import GoogleAnalytics from "@/components/Analytics/GoogleAnalytics";
import NavigationProgress from "@/components/NavigationProgress";
import MotionProvider from "@/components/MotionProvider";
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
  display: 'swap',
  variable: '--font-caramel',
  // Fall back to the site's body face (Assistant) rather than a system script
  // font, so headings never flash in an unrelated cursive glyph set.
  fallback: ['var(--font-assistant)', 'Arial', 'sans-serif'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://go-apartsale.online';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aiterra - תיווך נדל״ן בחולון",
    template: "%s | Aiterra"
  },
  description: "משרד תיווך ושיווק נדל״ן המתמחה בשיווק, מכירה והשכרה של דירות ונכסים בחולון והסביבה. ניסיון מצטבר של שנים בעולם הנדל״ן. דירות למכירה בחולון, דירות להשכרה בחולון, תיווך נדל״ן מקצועי.",
  keywords: ["תיווך נדל״ן", "דירות למכירה", "דירות להשכרה", "חולון", "נדל״ן", "תיווך", "תיווך נדל״ן בחולון", "דירות למכירה בחולון", "דירות להשכרה בחולון", "נדל״ן בחולון", "משרד תיווך חולון"],
  authors: [{ name: "Aiterra" }],
  creator: "Aiterra",
  publisher: "Aiterra",
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  alternates: {
    canonical: siteUrl,
    types: {
      'application/rss+xml': `${siteUrl}/feed.xml`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    alternateLocale: ['he_IL'],
    siteName: 'Aiterra',
    title: 'Aiterra - תיווך נדל״ן בחולון',
    description: 'משרד תיווך ושיווק נדל״ן המתמחה בשיווק, מכירה והשכרה של דירות ונכסים בחולון והסביבה. ניסיון מצטבר של שנים בעולם הנדל״ן.',
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/images/hero/main-hero.jpg`,
        width: 1200,
        height: 630,
        alt: 'Aiterra - תיווך נדל״ן בחולון',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aiterra - תיווך נדל״ן בחולון',
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
  themeColor: '#f5f7fb',
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
        <meta name="theme-color" content="#f5f7fb" />
        <meta name="supported-color-schemes" content="light" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root { color-scheme: only light !important; }
          html { color-scheme: only light !important; background: #f5f7fb !important; }
          body { color-scheme: only light !important; background: #f5f7fb !important; color: #171717 !important; }
        `}} />
      </head>
      <body className={`${assistant.variable} ${caramel.variable} antialiased`}>
        <GoogleAnalytics />
        <NavigationProgress />
        <StructuredData />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
