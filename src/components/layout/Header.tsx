"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  submenu?: { label: string; href: string }[];
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (pathname === "/") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#contact");
    }
  };

  const navLinks: NavLink[] = [
    { label: "דף הבית", href: "/" },
    { label: "נכסים", href: "/apartments" },
    {
      label: "מידע מקצועי בנדל״ן",
      href: "#",
      submenu: [
        { label: "מוכרים דירה", href: "/selling-apartment" },
        { label: "קונים דירה", href: "/buying-apartment" }
      ],
    },
    { label: "מאמרים", href: "/articles" },
    {
      label: "אזור המידע והכלים",
      href: "#",
      submenu: [
        { label: "קישורים שימושיים", href: "/links" },
        { label: "שאלות ותשובות", href: "/faq" },
      ],
    },
    { label: "אודות", href: "/about" },
  ];

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  return (
    <header dir="rtl" className="bg-white py-2 shadow-md border-b border-gray-100 sticky top-0 z-50">
      <nav className="relative max-w-[1440px] mx-auto px-6 lg:px-10 flex justify-between items-center min-h-[60px]">
        
        <div className="hidden xl:block z-20">
          <Link href="/" className="transition-transform hover:scale-105 block">
            <div className="w-14 h-14 bg-white flex items-center justify-center p-1">
              <Image 
                src="/images/logo.PNG" 
                alt="Logo" 
                width={56} 
                height={56} 
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== '/images/logo.jpeg') {
                    target.src = '/images/logo.jpeg';
                  }
                }}
              />
            </div>
          </Link>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="xl:hidden z-30 p-2 text-gray-700 hover:text-[#1c3664] transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} className="text-[#1c3664]" /> : <Menu size={24} />}
        </button>

        <div className="hidden xl:flex absolute left-0 right-0 mx-auto w-fit items-center gap-6 justify-center">
          {navLinks.map((link) => (
            <div key={link.label} className="relative group">
              <Link
                href={link.href}
                onClick={link.onClick}
                className="text-[15px] font-bold tracking-wide transition-all duration-300 flex items-center gap-1 text-slate-900 py-4"
              >
                {link.label}
                {link.submenu && (
                  <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform" />
                )}
                <span className="absolute bottom-3 right-0 w-0 h-0.5 bg-[#1c3664] transition-all duration-300 group-hover:w-full"></span>
              </Link>

              {link.submenu && (
                <div className="absolute top-full right-0 w-72 bg-white shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <ul className="py-2">
                    {link.submenu.map((sub) => (
                      <li key={sub.label}>
                        <Link
                          href={sub.href}
                          className="block px-5 py-3 text-sm font-medium hover:bg-gray-50 hover:text-[#1c3664] text-slate-700 border-r-4 border-transparent hover:border-[#1c3664] transition-all"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="z-20">
          <Link href="/" className="transition-transform hover:scale-105 block">
            <div className="w-14 h-14 bg-white flex items-center justify-center p-1">
              <Image 
                src="/images/logo.PNG" 
                alt="Logo" 
                width={56} 
                height={56} 
                className="object-contain" 
                priority 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== '/images/logo.jpeg') {
                    target.src = '/images/logo.jpeg';
                  }
                }}
              />
            </div>
          </Link>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 top-[72px] bg-white z-40 overflow-y-auto">
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.label} className="border-b border-gray-100 last:border-0">
                <div className="flex items-center justify-between">
                  <Link
                    href={link.href}
                    onClick={(e) => {
                      if (link.submenu) {
                        e.preventDefault();
                        toggleSubmenu(link.label);
                      } else {
                        if (link.onClick) link.onClick(e);
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    className="flex-1 py-4 text-base font-bold text-slate-900"
                  >
                    {link.label}
                  </Link>
                  
                  {link.submenu && (
                    <button 
                      onClick={() => toggleSubmenu(link.label)}
                      className="p-4 transition-transform"
                    >
                      <ChevronDown 
                        size={20} 
                        className={`transition-transform duration-300 ${openSubmenu === link.label ? "rotate-180 text-[#1c3664]" : "text-gray-400"}`} 
                      />
                    </button>
                  )}
                </div>

                {link.submenu && (
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${
                      openSubmenu === link.label ? "max-h-[500px] opacity-100 mb-2" : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="pr-4 py-1 space-y-1 bg-gray-50 rounded-lg">
                      {link.submenu.map((sub) => (
                        <li key={sub.label}>
                          <Link
                            href={sub.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block py-3 text-sm font-medium text-slate-600 hover:text-[#1c3664] border-r-2 border-transparent hover:border-[#1c3664] pr-3"
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {isMobileMenuOpen && (
        <div
          className="xl:hidden fixed inset-0 bg-black/50 z-30 top-[72px]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}