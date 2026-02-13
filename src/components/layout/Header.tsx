"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

// 1. Define an interface to solve the TypeScript error
interface NavLink {
  label: string;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void; // Optional property
  submenu?: { label: string; href: string }[];
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (pathname === "/") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#contact");
    }
  };

  // 2. Apply the NavLink type to your array
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
    {
      label: "אזור המידע והכלים",
      href: "#",
      submenu: [
        { label: "קישורים שימושיים", href: "/links" },
        { label: "שאלות ותשובות", href: "/faq" },
      ],
    },
    { label: "אודות", href: "/about" },
    // Example of using the handleContactClick if you wanted to add it here:
    // { label: "צור קשר", href: "#contact", onClick: handleContactClick }
  ];

  return (
    <header dir="rtl" className="bg-white py-2 shadow-md border-b border-gray-100 sticky top-0 z-50">
      {/* 3. Optimized Tailwind classes: max-w-360 and min-h-15 */}
      <nav className="relative max-w-360 mx-auto px-6 lg:px-10 flex justify-between items-center min-h-15">
        
        {/* LOGO RIGHT */}
        <div className="z-20">
          <Link href="/" className="transition-transform hover:scale-105 block">
            <div className="w-14 h-14 bg-white flex items-center justify-center p-1">
              <Image src="/images/logo.png" alt="Logo" width={56} height={56} className="object-contain" priority />
            </div>
          </Link>
        </div>

        {/* CENTER NAVIGATION */}
        <div className="hidden xl:flex absolute left-0 right-0 mx-auto w-fit items-center gap-6 justify-center">
          {navLinks.map((link) => (
            <div key={link.label} className="relative group">
              <Link
                href={link.href}
                onClick={link.onClick} // No longer errors out!
                className="text-[15px] font-bold tracking-wide transition-all duration-300 flex items-center gap-1 text-slate-900 py-4"
              >
                {link.label}
                {link.submenu && (
                  <svg className="w-3.5 h-3.5 opacity-50 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
                <span className="absolute bottom-3 right-0 w-0 h-0.5 bg-[#1c3664] transition-all duration-300 group-hover:w-full"></span>
              </Link>

              {/* SINGLE LEVEL DROPDOWN */}
              {link.submenu && (
                /* 4. Optimized Tailwind class: top-full */
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

        {/* LOGO LEFT */}
        <div className="z-20">
          <Link href="/" className="transition-transform hover:scale-105 block">
            <div className="w-14 h-14 bg-white flex items-center justify-center p-1">
              <Image src="/images/logo.png" alt="Logo" width={56} height={56} className="object-contain" priority />
            </div>
          </Link>
        </div>

      </nav>
    </header>
  );
}