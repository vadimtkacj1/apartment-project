"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, type CSSProperties } from "react";
import { Menu, X, ChevronDown, Phone, MessageCircle } from "lucide-react";

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

export default function Header({ initialPhone }: { initialPhone?: string | null }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [activeDesktopSubmenu, setActiveDesktopSubmenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [ownerPhone, setOwnerPhone] = useState<string | null>(initialPhone ?? null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuWasOpen = useRef(false);

  // Phone normally arrives server-side via initialPhone (layout reads the same
  // owners table /api/owners exposes). The client fetch is only a fallback for
  // callers that render <Header/> without the prop.
  useEffect(() => {
    if (initialPhone) return;
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
  }, [initialPhone]);

  // Mobile menu open: lock page scroll + close on Escape.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobileMenuOpen]);

  // Focus management: close button on open, back to the burger on close.
  useEffect(() => {
    if (isMobileMenuOpen) {
      menuWasOpen.current = true;
      closeButtonRef.current?.focus();
    } else if (menuWasOpen.current) {
      menuWasOpen.current = false;
      burgerRef.current?.focus();
    }
  }, [isMobileMenuOpen]);

  // wa.me expects an international number: strip formatting, 0-prefix → 972.
  const waPhone = (() => {
    if (!ownerPhone) return null;
    const digits = ownerPhone.replace(/\D/g, "");
    if (!digits) return null;
    return digits.startsWith("0") ? `972${digits.slice(1)}` : digits;
  })();

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
        transition: "background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        background: shouldBeTransparent
          ? "transparent"
          : "rgba(255, 255, 255, 0.95)",
        backdropFilter: shouldBeTransparent ? "none" : "blur(12px)",
        WebkitBackdropFilter: shouldBeTransparent ? "none" : "blur(12px)",
        borderBottom: shouldBeTransparent
          ? "1px solid transparent"
          : "1px solid #E4E8F2",
        boxShadow: shouldBeTransparent
          ? "none"
          : "0 8px 24px -20px rgba(5,17,80,0.12)",
      }}
    >
      <nav
        dir="ltr"
        style={{
          maxWidth: 2400,
          margin: "0 auto",
          /* ✅ Уменьшен padding на мобилке — логотип и бургер прижаты к краям */
          padding: isMobile ? "0 1rem" : "0 3rem",
          height: 68,
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
            style={{ display: "flex", alignItems: "center", gap: 10 }}
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
                  ? "drop-shadow(0 1px 3px rgba(0,0,0,0.40))"
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
                  ? "0 1px 3px rgba(0,0,0,0.45)"
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
          <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* Contact CTA — the single strong accent (solid indigo, white text
                7.17:1). Reading-start/right corner of the cluster. Click-to-call.
                Width is reserved even before the phone resolves (client-fetch
                fallback path) so the nav cluster never shifts. */}
            <div style={{ minWidth: 122, display: "flex", justifyContent: "flex-start" }}>
            {ownerPhone && (
              <a
                href={`tel:${ownerPhone}`}
                aria-label="התקשרו אלינו"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 20px",
                  borderRadius: 12,
                  background: "#354AC4",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: 15,
                  letterSpacing: 0,
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  border: shouldBeTransparent
                    ? "1px solid rgba(255,255,255,0.22)"
                    : "1px solid transparent",
                  boxShadow: shouldBeTransparent
                    ? "0 4px 12px rgba(0,0,0,0.22)"
                    : "0 2px 6px rgba(5,17,80,0.10)",
                  fontFamily: "var(--font-assistant), system-ui, sans-serif",
                  transition: "background-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#4A5FD6";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = shouldBeTransparent
                    ? "0 8px 20px rgba(0,0,0,0.28)"
                    : "0 6px 16px rgba(5,17,80,0.14)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#354AC4";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = shouldBeTransparent
                    ? "0 4px 12px rgba(0,0,0,0.22)"
                    : "0 2px 6px rgba(5,17,80,0.10)";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.background = "#28389B";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.background = "#4A5FD6";
                }}
              >
                <Phone size={16} strokeWidth={2.25} aria-hidden="true" />
                צור קשר
              </a>
            )}
            </div>

            {/* Hairline divider — editorial separation of the one action from
                the navigation links. */}
            <span
              aria-hidden="true"
              style={{
                width: 1,
                height: 20,
                alignSelf: "center",
                borderRadius: 0,
                background: shouldBeTransparent ? "rgba(255,255,255,0.28)" : "#E4E8F2",
              }}
            />

            {/* Links group — free-floating, clean sans, even rhythm. */}
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {NAV_LINKS.map((link) => {
              // Section-aware active state: '/' matches exactly, real routes
              // match themselves and their sub-pages (startsWith). Dropdown
              // parents use href="#", so they light up when any sub-route is
              // the current section.
              const isActive = link.href === "/"
                ? pathname === "/"
                : link.href !== "#"
                  ? pathname.startsWith(link.href)
                  : !!link.submenu?.some((s) => pathname.startsWith(s.href));
              const isOpen = activeDesktopSubmenu === link.label;

              // Resting color for the current header state (3-tier brand ramp).
              const restColor = shouldBeTransparent
                ? (isActive ? "#ffffff" : "rgba(255,255,255,0.90)")
                : (isActive ? "#051150" : "#475569");
              const hoverColor = shouldBeTransparent ? "#ffffff" : "#354AC4";
              // An open dropdown parent reads in the hover color even off-hover.
              const displayColor = (isOpen && !isActive) ? hoverColor : restColor;

              const parentStyle: CSSProperties = {
                fontSize: 15,
                fontWeight: 500,
                color: displayColor,
                textShadow: shouldBeTransparent
                  ? "0 1px 3px rgba(0,0,0,0.45)"
                  : "none",
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 2px",
                textDecoration: "none",
                whiteSpace: "nowrap",
                position: "relative",
                letterSpacing: 0,
                lineHeight: 1,
                transition: "color 0.18s ease",
                fontFamily: "var(--font-assistant), system-ui, sans-serif",
              };

              // Active underline — grows from the reading-start (right) for RTL
              const activeUnderline = (
                <span style={{
                  position: "absolute",
                  insetInlineStart: 0, insetInlineEnd: 0,
                  bottom: 0,
                  height: 2,
                  borderRadius: 0,
                  background: shouldBeTransparent ? "#ffffff" : "#354AC4",
                  transform: isActive ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "right",
                  transition: "transform 0.22s ease",
                }} />
              );

              return (
                <div
                  key={link.label}
                  style={{ position: "relative" }}
                  onMouseEnter={() => link.submenu && handleMenuEnter(link.label)}
                  onMouseLeave={() => link.submenu && handleMenuLeave()}
                  onKeyDown={(e) => {
                    if (link.submenu && e.key === "Escape") setActiveDesktopSubmenu(null);
                  }}
                  onBlur={(e) => {
                    // Focus left the parent+dropdown group entirely → close.
                    if (link.submenu && !e.currentTarget.contains(e.relatedTarget as Node | null)) {
                      setActiveDesktopSubmenu(null);
                    }
                  }}
                >
                  {link.submenu ? (
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      style={{ ...parentStyle, background: "none", border: "none", cursor: "pointer" }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = hoverColor; }}
                      onMouseLeave={e => { if (!isActive && !isOpen) e.currentTarget.style.color = restColor; }}
                      onFocus={e => {
                        // Keyboard focus opens the menu; mouse clicks (not
                        // :focus-visible) go through onClick's toggle instead.
                        if (e.currentTarget.matches(":focus-visible")) handleMenuEnter(link.label);
                      }}
                      onClick={() => setActiveDesktopSubmenu(isOpen ? null : link.label)}
                    >
                      {link.label}
                      <ChevronDown size={15} strokeWidth={2} aria-hidden="true" style={{
                        color: "currentColor",
                        marginInlineStart: 2,
                        transition: "transform 0.25s",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }} />
                      {activeUnderline}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      style={parentStyle}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = hoverColor; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = restColor; }}
                    >
                      {link.label}
                      {activeUnderline}
                    </Link>
                  )}

                  {/* Dropdown */}
                  {link.submenu && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 10px)",
                        // RTL: inline-start = right edge (reading-start) — the
                        // logical equivalent of the old physical right:0.
                        insetInlineStart: 0,
                        width: 240,
                        background: "#ffffff",
                        borderRadius: 14,
                        border: "1px solid #E4E8F2",
                        padding: 6,
                        boxShadow: "0 16px 40px -16px rgba(5,17,80,0.14), 0 2px 6px rgba(5,17,80,0.05)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        opacity: isOpen ? 1 : 0,
                        visibility: isOpen ? "visible" : "hidden",
                        transform: isOpen ? "translateY(0)" : "translateY(6px)",
                        transition: "opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease",
                        pointerEvents: isOpen ? "auto" : "none",
                      }}
                    >
                      {link.submenu.map((sub) => {
                        const subActive = pathname.startsWith(sub.href);
                        return (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setActiveDesktopSubmenu(null)}
                          style={{
                            display: "block",
                            padding: "11px 14px",
                            fontSize: 15,
                            fontWeight: subActive ? 600 : 500,
                            letterSpacing: 0,
                            color: subActive ? "#051150" : "#475569",
                            background: subActive ? "#EEF1F8" : "transparent",
                            borderRadius: 8,
                            textDecoration: "none",
                            transition: "background-color 0.15s ease, color 0.15s ease",
                            fontFamily: "var(--font-assistant), system-ui, sans-serif",
                          }}
                          onMouseEnter={e => { if (!subActive) { e.currentTarget.style.background = "#F4F6FB"; e.currentTarget.style.color = "#354AC4"; } }}
                          onMouseLeave={e => { if (!subActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; } }}
                        >
                          {sub.label}
                        </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            </div>
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
                    : "0 4px 12px rgba(5,17,80,0.16)",
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                }}
              >
                <Phone size={22} strokeWidth={2.5} aria-hidden="true" />
              </a>
            )}
          <button
            ref={burgerRef}
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
                : "0 4px 12px rgba(5,17,80,0.16)",
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
        role="dialog"
        aria-modal="true"
        aria-label="תפריט ניווט"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "#ffffff",
          zIndex: 2000,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Scrollable content — the CTA bar below stays pinned. */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
        {/* Close button */}
        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "1rem" }}>
          <button
            ref={closeButtonRef}
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
          {NAV_LINKS.map((link) => {
            const isSubOpen = openSubmenu === link.label;
            const isActive = link.href === "/"
              ? pathname === "/"
              : link.href !== "#"
                ? pathname.startsWith(link.href)
                : !!link.submenu?.some((s) => pathname.startsWith(s.href));
            return (
            <div key={link.label} style={{ borderBottom: "1px solid #EEF1F8" }}>
              {link.submenu ? (
                // Whole row toggles the accordion — a far bigger tap target
                // than the old chevron-only button.
                <button
                  onClick={() => setOpenSubmenu(isSubOpen ? null : link.label)}
                  aria-expanded={isSubOpen}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "16px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 18,
                    fontWeight: 600,
                    color: isActive ? "#354AC4" : "#051150",
                    textAlign: "start",
                    fontFamily: "var(--font-assistant), system-ui, sans-serif",
                  }}
                >
                  <span>{link.label}</span>
                  <ChevronDown size={22} aria-hidden="true" style={{
                    color: "#354ac4",
                    flexShrink: 0,
                    transform: isSubOpen ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform 0.25s",
                  }} />
                </button>
              ) : (
                <div style={{ display: "flex", alignItems: "center", padding: "16px 0" }}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ fontSize: 18, fontWeight: 600, color: isActive ? "#354AC4" : "#051150", textDecoration: "none", flex: 1, fontFamily: "var(--font-assistant), system-ui, sans-serif" }}
                  >
                    {link.label}
                  </Link>
                </div>
              )}

              {link.submenu && isSubOpen && (
                <div style={{ background: "#F4F6FB", borderRadius: 10, marginBottom: 12, overflow: "hidden" }}>
                  {link.submenu.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        display: "block",
                        padding: "14px 20px",
                        fontSize: 16,
                        fontWeight: 500,
                        color: "#475569",
                        textDecoration: "none",
                        borderInlineStart: "3px solid #354AC4",
                        fontFamily: "var(--font-assistant), system-ui, sans-serif",
                      }}
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
        </div>

        {/* Pinned bottom CTA bar — call + WhatsApp always reachable while the
            menu is open. */}
        {ownerPhone && (
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              gap: 10,
              padding: "12px 1.5rem",
              paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
              borderTop: "1px solid #E4E8F2",
              background: "#ffffff",
              boxShadow: "0 -8px 24px -20px rgba(5,17,80,0.25)",
            }}
          >
            <a
              href={`tel:${ownerPhone}`}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "14px 20px",
                borderRadius: 12,
                background: "#354AC4",
                color: "#ffffff",
                fontSize: 16,
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 2px 6px rgba(5,17,80,0.10)",
                fontFamily: "var(--font-assistant), system-ui, sans-serif",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <Phone size={18} strokeWidth={2.25} aria-hidden="true" />
              התקשרו אלינו
            </a>
            {waPhone && (
              <a
                href={`https://wa.me/${waPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="שלחו הודעת וואטסאפ"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 52,
                  borderRadius: 12,
                  background: "#ffffff",
                  border: "1px solid #E4E8F2",
                  color: "#051150",
                  textDecoration: "none",
                  boxShadow: "0 2px 6px rgba(5,17,80,0.06)",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <MessageCircle size={22} strokeWidth={2.25} aria-hidden="true" />
              </a>
            )}
          </div>
        )}
      </div>
    )}
    </>
  );
}