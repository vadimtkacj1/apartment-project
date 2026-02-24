"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  submenu?: { label: string; href: string }[];
}

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [activeDesktopSubmenu, setActiveDesktopSubmenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    const onResize = () => setIsMobile(window.innerWidth < 1280);
    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const navLinks: NavLink[] = [
    { label: "דף הבית", href: "/" },
    { label: "הנכסים השלנו", href: "/apartments" },
    {
      label: 'מידע מקצועי בנדל"ן',
      href: "#",
      submenu: [
        { label: "מוכרים דירה", href: "/selling-apartment" },
        { label: "קונים דירה", href: "/buying-apartment" },
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

  // Only use transparent header on home page
  const isHomePage = pathname === "/";
  const shouldBeTransparent = isHomePage && !isScrolled;

  const textColor = shouldBeTransparent ? "#ffffff" : "#1c3664";
  const logoFilter = shouldBeTransparent ? "brightness(0) invert(1)" : "none";

  // Mouse enter: cancel pending close, open this menu
  const handleMenuEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDesktopSubmenu(label);
  };

  // Mouse leave: delay close so user can move to dropdown
  const handleMenuLeave = () => {
    closeTimer.current = setTimeout(() => setActiveDesktopSubmenu(null), 120);
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        transition: "background 0.35s ease, box-shadow 0.35s ease",
        background: shouldBeTransparent ? "transparent" : "#ffffff",
        boxShadow: shouldBeTransparent ? "none" : "0 4px 32px rgba(0,0,0,0.18)",
      }}
    >
      <nav
        dir="ltr"
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 2rem",
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logos */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
          <Link href="/" style={{ display: "block", transition: "transform 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.07)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Image src="/images/logo.PNG" alt="Logo" width={56} height={56}
              className="object-contain" priority
              style={{ filter: logoFilter, transition: "filter 0.35s ease" }}
            />
          </Link>
          <Link href="/" style={{ display: "block", transition: "transform 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.07)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Image src="/images/logo2.svg" alt="Logo 2" width={56} height={56}
              className="object-contain" priority
              style={{ filter: logoFilter, transition: "filter 0.35s ease" }}
            />
          </Link>
        </div>

        {/* Desktop menu */}
        {!isMobile && (
          <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: "1.8rem" }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isOpen = activeDesktopSubmenu === link.label;

              return (
                <div
                  key={link.label}
                  style={{ position: "relative" }}
                  onMouseEnter={() => link.submenu && handleMenuEnter(link.label)}
                  onMouseLeave={() => link.submenu && handleMenuLeave()}
                >
                  <Link
                    href={link.href}
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: textColor,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "6px 0",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      position: "relative",
                      opacity: 1,
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                    // If it's a submenu trigger (#), open on click too (mobile-friendly)
                    onClick={e => {
                      if (link.submenu && link.href === "#") {
                        e.preventDefault();
                        setActiveDesktopSubmenu(isOpen ? null : link.label);
                      }
                    }}
                  >
                    {link.label}
                    {link.submenu && (
                      <ChevronDown size={14} style={{
                        opacity: 0.6,
                        transition: "transform 0.25s",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }} />
                    )}
                    {/* Active underline */}
                    <span style={{
                      position: "absolute",
                      bottom: 0, right: 0, left: 0,
                      height: 2,
                      borderRadius: 2,
                      background: textColor,
                      transform: isActive ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: "right",
                      transition: "transform 0.25s ease",
                    }} />
                  </Link>

                  {/* Dropdown */}
                  {link.submenu && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        width: 210,
                        background: "#ffffff",
                        borderRadius: 14,
                        boxShadow: "0 8px 40px rgba(0,0,0,0.14)",
                        border: "1px solid rgba(0,0,0,0.06)",
                        overflow: "hidden",
                        opacity: isOpen ? 1 : 0,
                        visibility: isOpen ? "visible" : "hidden",
                        transform: isOpen ? "translateY(0)" : "translateY(8px)",
                        transition: "all 0.25s ease",
                        pointerEvents: isOpen ? "auto" : "none",
                      }}
                    >
                      {link.submenu.map((sub, i) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setActiveDesktopSubmenu(null)}
                          style={{
                            display: "block",
                            padding: "12px 18px",
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#1c3664",
                            textDecoration: "none",
                            borderBottom: i < link.submenu!.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#f0f4ff")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Burger button */}
        {isMobile && (
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: 10,
              padding: 8,
              cursor: "pointer",
              color: textColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        )}
      </nav>

      {/* Mobile menu */}
      {isMobile && isMobileMenuOpen && (
        <div
          dir="rtl"
          style={{
            position: "fixed",
            inset: "80px 0 0 0",
            background: "#ffffff",
            zIndex: 40,
            overflowY: "auto",
            padding: "1.5rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {navLinks.map((link) => (
              <div key={link.label} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0" }}>
                  <Link
                    href={link.href}
                    onClick={() => !link.submenu && setIsMobileMenuOpen(false)}
                    style={{ fontSize: 17, fontWeight: 700, color: "#1c3664", textDecoration: "none", flex: 1 }}
                  >
                    {link.label}
                  </Link>
                  {link.submenu && (
                    <button
                      onClick={() => setOpenSubmenu(openSubmenu === link.label ? null : link.label)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "#1c3664" }}
                    >
                      <ChevronDown size={20} style={{
                        transform: openSubmenu === link.label ? "rotate(180deg)" : "rotate(0)",
                        transition: "transform 0.25s",
                      }} />
                    </button>
                  )}
                </div>

                {link.submenu && openSubmenu === link.label && (
                  <div style={{ background: "#f7f9ff", borderRadius: 10, marginBottom: 12, overflow: "hidden" }}>
                    {link.submenu.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                          display: "block",
                          padding: "13px 20px",
                          fontSize: 15,
                          fontWeight: 600,
                          color: "#1c3664",
                          textDecoration: "none",
                          borderRight: "3px solid #1c3664",
                        }}
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