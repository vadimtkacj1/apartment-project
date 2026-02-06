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

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (pathname === "/") {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push("/#contact");
    }
  };

  useEffect(() => {
    setScrolled(window.scrollY > 50);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const iconBaseClass = "flex items-center justify-center border-2 transition-all duration-300 rounded-lg hover:scale-105";

  const iconColorClass = scrolled || !isHomePage
    ? "border-gray-900 text-gray-900 bg-white hover:bg-gray-50"
    : "border-white text-white bg-black/50 backdrop-blur-md shadow-2xl hover:bg-black/60"; 

  return (
    <header
      dir="rtl"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHomePage
          ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <nav className="w-full px-4 lg:px-8 py-4">
        <div className="flex justify-between items-center max-w-[1920px] mx-auto">
          
          {/* --- ПРАВАЯ ЧАСТЬ: ЛОГОТИП + НАВИГАЦИЯ --- */}
          <div className="flex items-center gap-8 xl:gap-12">
            <Link href="/" className="relative z-10 block shrink-0">
               <div className="w-14 h-14 lg:w-16 lg:h-16 rounded bg-white shadow-lg flex items-center justify-center p-2">
                <Image
                    src="/images/logo.PNG"
                    alt="Logo"
                    width={60}
                    height={60}
                    className="object-contain w-full h-full"
                  />
               </div>
            </Link>

            <div className="hidden xl:flex items-center gap-6 2xl:gap-8">
              {[
                { label: "צור קשר", href: "/#contact", onClick: handleContactClick },
                { label: "אודות", href: "/about" },
                { label: "נכסים", href: "/apartments" },
                { label: "דף הבית", href: "/" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={link.onClick}
                  className={`font-bold text-lg tracking-wide hover:text-[#C19A6B] transition-colors duration-300 relative group uppercase whitespace-nowrap ${
                    scrolled || !isHomePage
                      ? "text-gray-900"
                      : "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                  }`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#C19A6B] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* --- ЛЕВАЯ ЧАСТЬ: СОЦСЕТИ + ВХОД --- */}
          <div className="flex items-center gap-4 lg:gap-6">
            
            <div className="hidden lg:flex items-center gap-3">

              <a
                href="#"
                className={`${iconBaseClass} ${iconColorClass} w-11 h-11`}
              >
                <Star size={20} fill="currentColor" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`${iconBaseClass} ${iconColorClass} w-11 h-11`}
              >
                <Facebook size={20} fill="currentColor" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`${iconBaseClass} ${iconColorClass} w-11 h-11`}
              >
                <Instagram size={20} />
              </a>

              <a
                href="tel:*8851"
                className={`${iconBaseClass} ${iconColorClass} px-4 h-11 gap-2`}
              >
                <span className="font-bold text-lg leading-none tracking-wider">*8851</span>
                <Phone size={18} />
              </a>

            </div>

          </div>

        </div>
      </nav>
    </header>
  );
}