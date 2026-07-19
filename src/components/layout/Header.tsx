"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Phone } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  submenu?: { label: string; href: string }[];
}

const NAV_LINKS: NavLink[] = [
  { label: "דף הבית", href: "/" },
  { label: "הנכסים שלנו", href: "/apartments" },
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
  const [ownerPhone, setOwnerPhone] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Same owner data the footer/WhatsApp button use — fetched client-side so the
  // header CTA can click-to-call the office without turning Header into a
  // server component.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/owners", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (cancelled || !Array.isArray(data)) return;
        const phone = data.find((o) => o?.phone)?.phone;
        if (phone) setOwnerPhone(phone as string);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

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

  const textColor = shouldBeTransparent ? "#ffffff" : "#354ac4";
  // Logo mark + wordmark stay in the brand's ink navy (like the brand board's "Aiterra.")
  const brandColor = shouldBeTransparent ? "#ffffff" : "#051150";

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
        transition: "all 0.35s ease",
        background: shouldBeTransparent
          ? "transparent"
          : "rgba(255, 255, 255, 0.95)",
        backdropFilter: shouldBeTransparent ? "none" : "blur(12px)",
        WebkitBackdropFilter: shouldBeTransparent ? "none" : "blur(12px)",
        boxShadow: shouldBeTransparent
          ? "none"
          : "0 2px 4px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.1), 0 16px 48px rgba(0,0,0,0.15)",
      }}
    >
      <nav
        dir="ltr"
        style={{
          maxWidth: 2400,
          margin: "0 auto",
          /* ✅ Уменьшен padding на мобилке — логотип и бургер прижаты к краям */
          padding: isMobile ? "0 1rem" : "0 3rem",
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link
            href="/"
            aria-label="Aiterra"
            style={{ display: "flex", alignItems: "center", gap: 10, transition: "transform 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.07)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src="/aiterra-logo.png"
              alt=""
              width={46}
              height={33}
              aria-hidden="true"
              style={{
                display: "block",
                transition: "filter 0.35s ease",
                filter: shouldBeTransparent
                  ? "drop-shadow(0 1px 4px rgba(0,0,0,0.55))"
                  : "none",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-caramel), cursive, sans-serif",
                fontSize: "clamp(24px, 1.8vw, 30px)",
                fontWeight: 700,
                lineHeight: 1,
                color: brandColor,
                letterSpacing: "0.06em",
                textShadow: shouldBeTransparent
                  ? "0 0 3px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.7)"
                  : "none",
                transition: "color 0.35s ease",
              }}
            >
              Aiterra
            </span>
          </Link>
        </div>

        {/* Desktop menu */}
        {!isMobile && (
          <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Contact CTA pill — reading-start end of the nav. Reuses the hero
                primary button recipe (indigo→sky gradient, ink text) so it reads
                as the site's primary action token. Click-to-call the office. */}
            {ownerPhone && (
              <a
                href={`tel:${ownerPhone}`}
                aria-label="התקשרו אלינו"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 22px",
                  borderRadius: 999,
                  background:
                    "linear-gradient(135deg, #4A8BEF 0%, #7BAAF5 50%, #5594F1 100%)",
                  color: "#051150",
                  fontWeight: 800,
                  fontSize: "clamp(15px, 1.05vw, 18px)",
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  boxShadow:
                    "0 4px 16px rgba(85,148,241,0.35), inset 0 1px 0 rgba(255,255,255,0.35)",
                  fontFamily: "var(--font-caramel), cursive, sans-serif",
                  transition: "transform 0.2s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 22px rgba(85,148,241,0.5), inset 0 1px 0 rgba(255,255,255,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(85,148,241,0.35), inset 0 1px 0 rgba(255,255,255,0.35)";
                }}
              >
                <Phone size={17} strokeWidth={2.5} aria-hidden="true" />
                צור קשר
              </a>
            )}
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
                      fontSize: "clamp(17px, 1.35vw, 22px)",
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
                            color: "#354ac4",
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

        {/* Burger button + quick click-to-call chip */}
        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {ownerPhone && (
              <a
                href={`tel:${ownerPhone}`}
                aria-label="התקשרו אלינו"
                style={{
                  // Matches the burger chip (solid indigo, sky hairline) so the
                  // two controls read as one deliberate cluster.
                  width: 46,
                  height: 46,
                  background: "#354ac4",
                  border: "1px solid rgba(85, 148, 241, 0.6)",
                  borderRadius: 13,
                  cursor: "pointer",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  boxShadow: shouldBeTransparent
                    ? "0 6px 18px rgba(0,0,0,0.4)"
                    : "0 6px 18px rgba(5,17,80,0.3)",
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                }}
              >
                <Phone size={22} strokeWidth={2.5} aria-hidden="true" />
              </a>
            )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "סגור תפריט" : "פתח תפריט"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            onTouchStart={e => (e.currentTarget.style.transform = "scale(0.9)")}
            onTouchEnd={e => (e.currentTarget.style.transform = "scale(1)")}
            onTouchCancel={e => (e.currentTarget.style.transform = "scale(1)")}
            style={{
              // Solid, branded indigo chip in BOTH states — reads as a deliberate
              // control instead of the faint ghost box it used to be on the
              // white (scrolled) header. Sky hairline + soft shadow tie it to
              // the site's indigo↔sky button system.
              width: 46,
              height: 46,
              background: "#354ac4",
              border: "1px solid rgba(85, 148, 241, 0.6)", // brand sky #5594f1
              borderRadius: 13,
              padding: 0,
              cursor: "pointer",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: shouldBeTransparent
                ? "0 6px 18px rgba(0,0,0,0.4)"
                : "0 6px 18px rgba(5,17,80,0.3)",
              transition: "transform 0.15s ease, box-shadow 0.3s ease, background 0.3s ease",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
              zIndex: 1050,
              position: "relative",
            }}
          >
            {isMobileMenuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
          </button>
          </div>
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
              color: "#354ac4",
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
                  style={{ fontSize: 20, fontWeight: 700, color: "#354ac4", textDecoration: "none", flex: 1, fontFamily: "var(--font-caramel), cursive, sans-serif" }}
                >
                  {link.label}
                </Link>
                {link.submenu && (
                  <button
                    onClick={() => setOpenSubmenu(openSubmenu === link.label ? null : link.label)}
                    aria-label={openSubmenu === link.label ? `סגור ${link.label}` : `פתח ${link.label}`}
                    aria-expanded={openSubmenu === link.label}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "#354ac4" }}
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
                        color: "#354ac4",
                        textDecoration: "none",
                        borderInlineStart: "3px solid #354ac4",
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