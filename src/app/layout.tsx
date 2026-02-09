import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const heebo = Heebo({
  weight: ['400', '500', '600', '700', '900'],
  subsets: ['latin', 'hebrew'],
  display: 'swap',
  variable: '--font-heebo',
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
      <body className={`${heebo.variable} antialiased`}>
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
