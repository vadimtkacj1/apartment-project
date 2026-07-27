import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import { prisma } from "@/lib/prisma";
import { getActiveTheme } from "@/themes/server";
import MoonlitShell from "@/themes/moonlit/MoonlitShell";
import { getMoonlitContact } from "@/themes/moonlit/data";
import { getMoonlitContent } from "@/themes/moonlit/content.server";
import "../(public)/about/about.css";

// Same source /api/owners exposes — read it server-side so the header CTA is
// present in the first HTML instead of popping in after a client fetch.
async function getOfficeContact(): Promise<{ phone: string | null; email: string | null }> {
  try {
    const owners = await prisma.owner.findMany({
      where: { isActive: true },
      select: { phone: true, email: true },
      orderBy: { order: "asc" },
    });
    return {
      phone: owners.find((o) => o.phone)?.phone ?? null,
      email: owners.find((o) => o.email)?.email ?? null,
    };
  } catch (error) {
    console.error("Error fetching office contact:", error);
    return { phone: null, email: null };
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The theme picked in /admin/design decides which chrome wraps the site.
  const [theme, contact] = await Promise.all([getActiveTheme(), getOfficeContact()]);
  const initialPhone = contact.phone;

  if (theme.family === "moonlit") {
    // The moonlit chrome shows the full admin-managed contact block.
    const moonlitContact = await getMoonlitContact();
  const moonlitContent = await getMoonlitContent();
    return (
      <MoonlitShell
        theme={theme}
        contact={moonlitContact}
        content={moonlitContent}
        widgets={
          <>
            <AccessibilityWidget />
            <WhatsAppFloatingButton />
          </>
        }
      >
        {children}
      </MoonlitShell>
    );
  }

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
