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

const NAV_LINKS: NavLink[] = [
  { label: "דף הבית", href: "/" },
  { label: "הנכסים השלנו", href: "/apartments" },
  {
    label: "אזורי פעילות",
    href: "#",
    submenu: [
      { label: "תיווך בחולון", href: "/holon" },
      { label: "תיווך בבת ים", href: "/bat-yam" },
      { label: "תיווך בראשון לציון", href: "/rishon-lezion" },
    ],
  },
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
    <>
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transition: "background-color 0.35s ease, box-shadow 0.35s ease",
        backgroundColor: shouldBeTransparent ? "transparent" : "#ffffff",
        boxShadow: shouldBeTransparent
          ? "none"
          : "0 1px 2px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.06)",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "100%",
          height: 80,
          backgroundColor: "inherit",
          pointerEvents: "none",
        }}
      />
      {/* Same container as the page content sections — `max-w-7xl mx-auto px-4
          md:px-6` — so the logo lines up with the section content edge on EVERY
          width. The old fixed `maxWidth: 2400px` + `3rem` padding diverged from
          the content's rem-scaled `max-w-7xl` container (100rem at ≥1600), so the
          logo sat left of the content on laptops and right of it on 4K. Height
          cap stays in rem to ride the big-screen ramp. */}
      <nav
        dir="ltr"
        className="max-w-7xl mx-auto px-4 md:px-6"
        style={{
          height: isMobile ? 70 : "clamp(70px, 3.4vw, 6.5rem)",
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
            <Image src="/favicon-rm.png" alt="לוגו רם נכסים חיים ענבי" width={60} height={60}
              className="object-contain" priority
              style={{ transition: "filter 0.35s ease", width: "clamp(60px, 3vw, 5.75rem)", height: "auto" }}
            />
          </Link>
          <Image src="/images/second-and.svg" alt="" width={36} height={36}
            className="object-contain"
            style={{ transition: "filter 0.35s ease", marginBottom: "8px", width: "clamp(36px, 1.8vw, 3.375rem)", height: "auto" }}
          />
          <Link href="/" style={{ display: "flex", transition: "transform 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.07)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Image src="/favicon-ha.png" alt="לוגו רם נכסים חיים ענבי" width={60} height={60}
              className="object-contain"
              style={{ transition: "filter 0.35s ease", width: "clamp(60px, 3vw, 5.75rem)", height: "auto" }}
            />
          </Link>
        </div>

        {/* Desktop menu */}
        {!isMobile && (
          <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {NAV_LINKS.map((link) => {
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
                      // rem cap (1.875rem === 30px base) so the link size rides
                      // the big-screen ramp instead of freezing at 30px while the
                      // page content scales up.
                      fontSize: "clamp(17px, 1.35vw, 1.875rem)",
                      fontWeight: 700,
                      color: textColor,
                      textShadow: shouldBeTransparent
                        ? "0 0 3px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.7), 0 2px 10px rgba(0,0,0,0.5)"
                        : "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "6px 0",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      position: "relative",
                      letterSpacing: "0.04em",
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
                        width: "14.375rem", // 230px base; rem so it scales with the ramp
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
                            padding: "0.875rem 1.25rem", // 14px 20px base; rem rides the ramp
                            fontSize: "1.0625rem", // 17px base
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
            aria-label={isMobileMenuOpen ? "סגור תפריט" : "פתח תפריט"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            onTouchStart={e => (e.currentTarget.style.transform = "scale(0.9)")}
            onTouchEnd={e => (e.currentTarget.style.transform = "scale(1)")}
            onTouchCancel={e => (e.currentTarget.style.transform = "scale(1)")}
            style={{
              // Solid, branded navy chip in BOTH states — reads as a deliberate
              // control instead of the faint ghost box it used to be on the
              // white (scrolled) header. Gold hairline + soft shadow tie it to
              // the site's navy↔gold button system.
              width: 46,
              height: 46,
              background: "#1c3664",
              border: "1px solid rgba(197, 163, 87, 0.6)", // brand gold #c5a357
              borderRadius: 13,
              padding: 0,
              cursor: "pointer",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: shouldBeTransparent
                ? "0 6px 18px rgba(0,0,0,0.4)"
                : "0 6px 18px rgba(28,54,100,0.3)",
              transition: "transform 0.15s ease, box-shadow 0.3s ease, background 0.3s ease",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
              zIndex: 1050,
              position: "relative",
            }}
          >
            {isMobileMenuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
          </button>
        )}
      </nav>
    </header>

    {/* Mobile menu — fullscreen, rendered OUTSIDE header to avoid stacking context issues on iOS Safari */}
    {isMobile && isMobileMenuOpen && (
      <div
        id="mobile-menu"
        dir="rtl"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "#ffffff",
          zIndex: 2000,
          overflowY: "auto",
          paddingTop: "1.5rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          paddingBottom: "1.5rem",
        }}
      >
        {/* Close button */}
        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "1rem" }}>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="סגור תפריט"
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
          {NAV_LINKS.map((link) => (
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
                    aria-label={openSubmenu === link.label ? `סגור ${link.label}` : `פתח ${link.label}`}
                    aria-expanded={openSubmenu === link.label}
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
                        borderInlineStart: "3px solid #1c3664",
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
    </>
  );
}