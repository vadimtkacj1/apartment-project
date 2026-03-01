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

  const isHomePage = pathname === "/";
  const shouldBeTransparent = isHomePage && !isScrolled;

  const textColor = shouldBeTransparent ? "#ffffff" : "#1c3664";

  const handleMenuEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDesktopSubmenu(label);
  };

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
        boxShadow: shouldBeTransparent ? "none" : "0 4px 40px rgba(0,0,0,0.18)",
      }}
    >
      <nav
        dir="ltr"
        style={{
          maxWidth: 2400,
          margin: "0 auto",
          /* ✅ Уменьшен padding на мобилке — логотип и бургер прижаты к краям */
          padding: isMobile ? "0 1rem" : "0 2.5rem",
          height: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logos */}
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <Link href="/" style={{ display: "flex", transition: "transform 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.07)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Image src="/images/logo.PNG" alt="Logo" width={60} height={60}
              className="object-contain" priority
              style={{ transition: "filter 0.35s ease" }}
            />
          </Link>
          <Image src="/images/second-and.svg" alt="and" width={36} height={36}
            className="object-contain"
            style={{ transition: "filter 0.35s ease", marginBottom: "10px" }}
          />
          <Link href="/" style={{ display: "flex", transition: "transform 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.07)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Image src="/images/logo2.svg" alt="Logo 2" width={60} height={60}
              className="object-contain"
              style={{ transition: "filter 0.35s ease" }}
            />
          </Link>
        </div>

        {/* Desktop menu */}
        {!isMobile && (
          <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
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
                      fontSize: "clamp(19px, 1.4vw, 26px)",
                      fontWeight: 700,
                      color: textColor,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "8px 0",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      position: "relative",
                      letterSpacing: "0.01em",
                      opacity: 1,
                      transition: "opacity 0.2s",
                      fontFamily: "var(--font-caramel), cursive, sans-serif",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                    onClick={e => {
                      if (link.submenu && link.href === "#") {
                        e.preventDefault();
                        setActiveDesktopSubmenu(isOpen ? null : link.label);
                      }
                    }}
                  >
                    {link.label}
                    {link.submenu && (
                      <ChevronDown size={16} style={{ 
                        opacity: 0.6,
                        transition: "transform 0.25s",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }} />
                    )}
                    {/* Active underline */}
                    <span style={{
                      position: "absolute",
                      bottom: 0, right: 0, left: 0,
                      height: 2.5,
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
                        top: "calc(100% + 10px)",
                        right: 0,
                        width: 230, 
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
                            padding: "14px 20px", 
                            fontSize: 17, 
                            fontWeight: 600,
                            color: "#1c3664",
                            textDecoration: "none",
                            borderBottom: i < link.submenu!.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                            transition: "background 0.15s",
                            fontFamily: "var(--font-caramel), cursive, sans-serif",
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
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        )}
      </nav>

      {/* ✅ Mobile menu — fullscreen, zIndex above header, X button inside */}
      {isMobile && isMobileMenuOpen && (
        <div
          dir="rtl"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "#ffffff",
            zIndex: 200, /* ✅ выше хедера (100) */
            overflowY: "auto",
            paddingTop: "1.5rem",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
            paddingBottom: "1.5rem",
          }}
        >
          {/* ✅ Крестик закрытия внутри меню */}
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "1rem" }}>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#1c3664",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
                borderRadius: 10,
              }}
            >
              <X size={32} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {navLinks.map((link) => (
              <div key={link.label} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0" }}>
                  <Link
                    href={link.href}
                    onClick={() => !link.submenu && setIsMobileMenuOpen(false)}
                    style={{ fontSize: 20, fontWeight: 700, color: "#1c3664", textDecoration: "none", flex: 1, fontFamily: "var(--font-caramel), cursive, sans-serif" }}
                  >
                    {link.label}
                  </Link>
                  {link.submenu && (
                    <button
                      onClick={() => setOpenSubmenu(openSubmenu === link.label ? null : link.label)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "#1c3664" }}
                    >
                      <ChevronDown size={22} style={{
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
                          padding: "14px 20px",
                          fontSize: 18,
                          fontWeight: 600,
                          color: "#1c3664",
                          textDecoration: "none",
                          borderRight: "3px solid #1c3664",
                          fontFamily: "var(--font-caramel), cursive, sans-serif",
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