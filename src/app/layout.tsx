import type { Metadata, Viewport } from "next";
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
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
  adjustFontFallback: false,
});

const caramel = localFont({
  src: '../../public/fonts/Carmela-Regular.ttf',
  display: 'swap',
  variable: '--font-caramel',
  fallback: ['cursive', 'sans-serif'],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: {
    default: "רם נכסים חיים ענבי - תיווך נדל״ן בחולון",
    template: "%s | רם נכסים חיים ענבי"
  },
  description: "משרד תיווך ושיווק נדל״ן המתמחה בשיווק, מכירה והשכרה של דירות ונכסים בחולון והסביבה. ניסיון מצטבר של שנים בעולם הנדל״ן.",
  keywords: ["תיווך נדל״ן", "דירות למכירה", "דירות להשכרה", "חולון", "נדל״ן", "תיווך"],
  authors: [{ name: "רם נכסים חיים ענבי" }],
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    siteName: 'רם נכסים חיים ענבי',
    title: 'רם נכסים חיים ענבי - תיווך נדל״ן בחולון',
    description: 'משרד תיווך ושיווק נדל״ן המתמחה בשיווק, מכירה והשכרה של דירות ונכסים בחולון והסביבה.',
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
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/Carmela-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${assistant.variable} ${caramel.variable} antialiased`}>
        <Providers>
          {children}
          <AccessibilityWidget />
        </Providers>
      </body>
    </html>
  );
}
