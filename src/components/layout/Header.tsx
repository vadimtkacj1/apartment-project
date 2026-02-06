"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Phone, Instagram, Facebook, Star } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  // Stabilize scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (pathname === "/") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#contact");
    }
  };

  // Modern Social Icon Component for consistency
  const SocialIcon = ({ icon, href }: { icon: React.ReactNode, href: string }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 transform hover:scale-110 
        ${scrolled || !isHomePage 
          ? "bg-gray-100 text-gray-700 hover:bg-[#C19A6B] hover:text-white" 
          : "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-[#C19A6B]"}`}
    >
      {icon}
    </a>
  );

  return (
    <header
      dir="rtl"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled || !isHomePage
          ? "bg-white/95 backdrop-blur-md py-3 shadow-md"
          : "bg-transparent py-6"
      }`}
    >
      <nav className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center">
          
          {/* RIGHT SIDE: LOGO & NAV */}
          <div className="flex items-center gap-12">
            <Link href="/" className="transition-transform hover:scale-105">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center p-2 border border-gray-100">
                <Image
                  src="/images/logo.PNG"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            </Link>

            <div className="hidden xl:flex items-center gap-8">
              {[
                { label: "דף הבית", href: "/" },
                { label: "נכסים", href: "/apartments" },
                { label: "אודות", href: "/about" },
                { label: "צור קשר", href: "/#contact", onClick: handleContactClick },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={link.onClick}
                  className={`text-[15px] font-bold tracking-wide transition-all duration-300 relative group
                    ${scrolled || !isHomePage ? "text-slate-900" : "text-white drop-shadow-md hover:text-white"}`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#C19A6B] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* LEFT SIDE: SOCIALS & BUTTON */}
          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-3">
              <SocialIcon icon={<Facebook size={18} />} href="https://facebook.com" />
              <SocialIcon icon={<Instagram size={18} />} href="https://instagram.com" />
              <SocialIcon icon={<Star size={18} />} href="#" />
            </div>

            <div className={`h-8 w-px bg-current opacity-10 hidden md:block ${scrolled || !isHomePage ? "text-black" : "text-white"}`}></div>

            <a
              href="tel:*8851"
              className={`
                group flex items-center gap-3 px-6 py-2.5 rounded-2xl font-bold transition-all duration-300 transform active:scale-95 shadow-2xl
                ${scrolled || !isHomePage
                  ? "bg-[#C19A6B] text-white hover:bg-gray-900 shadow-[#C19A6B]/20 border border-white/20"
                  : "bg-white text-gray-900 hover:shadow-white/20 hover:scale-[1.02] border border-gray-100"
                }
              `}
            >
              <span className="text-[14px] whitespace-nowrap">צרו קשר עכשיו</span>
              <div className={`p-1.5 rounded-full transition-colors duration-300 
                ${scrolled || !isHomePage ? "bg-white/20" : "bg-[#C19A6B]/10"}`}>
                <Phone 
                  size={16} 
                  className={`transition-transform duration-500 group-hover:rotate-12 
                    ${scrolled || !isHomePage ? "text-white" : "text-[#C19A6B]"}`} 
                />
              </div>
            </a>
          </div>

        </div>
      </nav>
    </header>
  );
}