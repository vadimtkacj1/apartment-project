import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import "../(public)/about/about.css";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col min-h-screen bg-warm"
      style={{
        colorScheme: 'light',
        background: '#faf7f2',
        color: '#171717',
        overflowX: 'hidden',
        width: '100%'
      } as React.CSSProperties}
    >
      <Header />
      <main
        className="flex-grow bg-warm"
        style={{
          background: '#faf7f2',
          color: '#171717'
        } as React.CSSProperties}
      >
        {children}
      </main>
      <Footer />
      <AccessibilityWidget />
      <WhatsAppFloatingButton />
    </div>
  );
}
