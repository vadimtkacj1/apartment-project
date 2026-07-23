import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import { prisma } from "@/lib/prisma";
import "../(public)/about/about.css";

// Same source /api/owners exposes — read it server-side so the header CTA is
// present in the first HTML instead of popping in after a client fetch.
async function getOfficePhone(): Promise<string | null> {
  try {
    const owners = await prisma.owner.findMany({
      where: { isActive: true },
      select: { phone: true },
      orderBy: { order: "asc" },
    });
    return owners.find((o) => o.phone)?.phone ?? null;
  } catch (error) {
    console.error("Error fetching office phone:", error);
    return null;
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialPhone = await getOfficePhone();
  return (
    <div
      className="flex flex-col min-h-screen bg-warm"
      style={{
        colorScheme: 'light',
        background: '#f5f7fb',
        color: '#171717',
        overflowX: 'hidden',
        width: '100%'
      } as React.CSSProperties}
    >
      <Header initialPhone={initialPhone} />
      <main
        className="flex-grow bg-warm"
        style={{
          background: '#f5f7fb',
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
