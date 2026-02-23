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

  const navLinks: NavLink[] = [
    { label: "דף הבית", href: "/" },
    { label: "הנכסים השלנו", href: "/apartments" },
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
    <header dir="rtl" className="bg-[#1c3664] sticky top-0 z-[100] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.2),0_20px_25px_-5px_rgba(0,0,0,0.15)]">
      <nav className="max-w-[1440px] 2xl:max-w-[1800px] mx-auto px-6 lg:px-10 2xl:px-16 flex justify-between items-center h-[90px]">
        
        {/* Мобильная версия: логотип слева */}
        <div className="xl:hidden z-20">
          <Link href="/" className="transition-transform hover:scale-105 block">
            <div className="bg-white p-1.5 rounded-lg shadow-md flex items-center justify-center w-[60px] h-[60px]">
              <Image
                src="/images/logo.PNG"
                alt="Logo"
                width={50}
                height={50}
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Десктоп версия: Правый логотип */}
        <div className="hidden xl:block z-20">
          <Link href="/" className="transition-transform hover:scale-105 block">
            <div className="bg-white p-1.5 rounded-lg shadow-md flex items-center justify-center w-[70px] h-[70px]">
              <Image
                src="/images/logo.PNG"
                alt="Logo"
                width={60}
                height={60}
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Бургер для мобильных - справа */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="xl:hidden z-30 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Центральное меню (Десктоп) */}
        <div className="hidden xl:flex items-center gap-8">
          {navLinks.map((link) => (
            <div key={link.label} className="relative group">
              <Link
                href={link.href}
                className="text-[16px] font-bold text-white hover:text-blue-200 transition-all flex items-center gap-1 py-4"
              >
                {link.label}
                {link.submenu && (
                  <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform" />
                )}
              </Link>

              {link.submenu && (
                <div className="absolute top-full right-0 w-64 bg-white shadow-2xl rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 border border-gray-100">
                  <ul className="py-2">
                    {link.submenu.map((sub) => (
                      <li key={sub.label}>
                        <Link
                          href={sub.href}
                          className="block px-6 py-3 text-sm font-bold text-[#1c3664] hover:bg-blue-50 hover:text-blue-600 transition-colors"
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

        {/* Десктоп версия: Левый логотип */}
        <div className="hidden xl:block z-20">
          <Link href="/" className="transition-transform hover:scale-105 block">
            <div className="bg-white p-1.5 rounded-lg shadow-md flex items-center justify-center w-[70px] h-[70px]">
              <Image
                src="/images/logo2.svg"
                alt="Logo"
                width={60}
                height={60}
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 top-[90px] bg-white z-40 p-6 overflow-y-auto shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.2),0_20px_25px_-5px_rgba(0,0,0,0.15)]">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <div key={link.label} className="border-b border-gray-200 last:border-0">
                <div className="flex items-center justify-between py-4">
                  <Link
                    href={link.href}
                    onClick={() => !link.submenu && setIsMobileMenuOpen(false)}
                    className="text-lg font-bold text-gray-800 flex-1"
                  >
                    {link.label}
                  </Link>
                  {link.submenu && (
                    <button onClick={() => toggleSubmenu(link.label)} className="text-gray-700 p-2">
                      <ChevronDown className={`transition-transform ${openSubmenu === link.label ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>
                {link.submenu && openSubmenu === link.label && (
                  <div className="bg-gray-50 rounded-lg mb-4">
                    {link.submenu.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-4 px-6 text-[#1c3664] font-medium border-r-2 border-[#1c3664]"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}