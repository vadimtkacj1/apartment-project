import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import SocialSidebar from "@/components/ui/SocialSidebar";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import "../(public)/about/about.css";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-warm">
      <Header />
      <main className="flex-grow bg-warm">{children}</main>
      <Footer />
      <SocialSidebar />
      <AccessibilityWidget />
    </div>
  );
}
