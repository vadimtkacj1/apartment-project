"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      dir="rtl"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHomePage
          ? "bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <nav className="w-full px-6 lg:px-12">
        <div className="flex justify-between items-center h-24 max-w-400 mx-auto">
          {/* Logo - Right Side */}
          <Link href="/" className="flex items-center group">
            <div className={`rounded-lg p-2 transition-all duration-500 border ${
              scrolled || !isHomePage
                ? "bg-white border-gray-200 shadow-sm"
                : "bg-white/90 backdrop-blur-sm shadow-lg border-white/40"
            }`}>
              <Image
                src="/images/logo.PNG"
                alt="Logo"
                width={50}
                height={50}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </Link>

          {/* Navigation Links - Center */}
          <div className="hidden md:flex items-center gap-12">
            <Link
              href="/contact"
              className={`font-bold text-xl hover:text-[#C19A6B] transition-colors duration-300 relative group ${
                scrolled || !isHomePage ? "text-gray-900" : "text-white"
              }`}
            >
              צור קשר
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#C19A6B] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/about"
              className={`font-bold text-xl hover:text-[#C19A6B] transition-colors duration-300 relative group ${
                scrolled || !isHomePage ? "text-gray-900" : "text-white"
              }`}
            >
              אודות
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#C19A6B] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/apartments"
              className={`font-bold text-xl hover:text-[#C19A6B] transition-colors duration-300 relative group ${
                scrolled || !isHomePage ? "text-gray-900" : "text-white"
              }`}
            >
              נכסים
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#C19A6B] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/"
              className={`font-bold text-xl hover:text-[#C19A6B] transition-colors duration-300 relative group ${
                scrolled || !isHomePage ? "text-gray-900" : "text-white"
              }`}
            >
              דף הבית
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#C19A6B] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* CTA Button - Left Side */}
          <div className="flex items-center">
            <Link
              href="/admin"
              className={`px-8 py-3 font-black text-base uppercase tracking-tight rounded-sm shadow-lg transition-all duration-300 active:scale-95 ${
                scrolled || !isHomePage
                  ? "bg-gray-900 text-white hover:bg-[#C19A6B]"
                  : "bg-[#C19A6B] text-white hover:bg-white hover:text-black"
              }`}
            >
              כניסה למערכת
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
