"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  Check,
  Sparkles,
  Mic,
  Eye,
  LineChart,
  Bot,
  Tag,
  Calendar,
  UtensilsCrossed,
  Phone,
  ChevronRight,
  Plus,
} from "lucide-react";
import { T, FONT_DISPLAY, FONT_BODY, FONT_MONO } from "@/lib/tokens";
import { useScrollY, useSectionProgress, useScrollTheme, useMouseParallax } from "@/lib/hooks";

// =========================================================
//  SHARED PRIMITIVES
// =========================================================
function Container({ children, style, narrow = false }) {
  return (
    <div
      style={{
        maxWidth: narrow ? 1100 : 1240,
        margin: "0 auto",
        padding: "0 40px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children, color = T.persimmon600, style }) {
  return (
    <div
      style={{
        fontFamily: FONT_MONO,
        fontSize: 11,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color,
        fontWeight: 500,
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        ...style,
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: 999, background: color, display: "inline-block" }} />
      {children}
    </div>
  );
}

function Display({ children, size = 88, color = T.ink, style }) {
  return (
    <h1
      style={{
        fontFamily: FONT_DISPLAY,
        fontSize: size,
        lineHeight: 0.95,
        letterSpacing: "-0.045em",
        fontWeight: 500,
        color,
        margin: 0,
        ...style,
      }}
    >
      {children}
    </h1>
  );
}

function Heading({ children, size = 52, color = T.ink, style }) {
  return (
    <h2
      style={{
        fontFamily: FONT_DISPLAY,
        fontSize: size,
        lineHeight: 1.0,
        letterSpacing: "-0.04em",
        fontWeight: 500,
        color,
        margin: 0,
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

function Body({ children, color = T.inkMuted, size = 17, style }) {
  return (
    <p
      style={{
        fontFamily: FONT_BODY,
        fontSize: size,
        lineHeight: 1.55,
        color,
        margin: 0,
        letterSpacing: "-0.005em",
        ...style,
      }}
    >
      {children}
    </p>
  );
}

function Button({ children, variant = "primary", onClick, style, arrow = false }) {
  const base = {
    fontFamily: FONT_BODY,
    fontSize: 15,
    fontWeight: 500,
    letterSpacing: "-0.01em",
    padding: "13px 22px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    transition: "all 200ms cubic-bezier(0.2, 0, 0, 1)",
  };
  const variants = {
    primary: {
      background: T.persimmon600,
      color: T.surface,
      boxShadow: "0 1px 0 0 rgba(20,17,15,0.06), 0 0 0 1px rgba(188,60,57,0.40) inset",
    },
    secondary: {
      background: T.mist,
      color: T.ink,
      boxShadow: "0 0 0 1px rgba(20,17,15,0.06) inset",
    },
    ghost: {
      background: "transparent",
      color: T.ink,
      boxShadow: "0 0 0 1px rgba(20,17,15,0.18) inset",
    },
    invertGhost: {
      background: "rgba(255,255,255,0.04)",
      color: T.whisper,
      boxShadow: "0 0 0 1px rgba(255,255,255,0.18) inset",
    },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>
      {children}
      {arrow && <ArrowRight size={15} strokeWidth={2} />}
    </button>
  );
}

function SectionLabel({ label, color = T.persimmon600 }) {
  // Stripped of the leading dot — the label stands on its own. Weight bumped
  // one step (500 → 600) so the label reads with more authority alongside
  // the now-uniform Inter type system.
  return (
    <div style={{ display: "inline-flex", alignItems: "center", marginBottom: 28 }}>
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color,
          fontWeight: 600,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function PlaceholderTag({ children }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 14,
        left: 14,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 10px 5px 8px",
        background: "rgba(20,17,15,0.78)",
        backdropFilter: "blur(8px)",
        borderRadius: 999,
        fontFamily: FONT_MONO,
        fontSize: 10,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: T.whisper,
        zIndex: 4,
      }}
    >
      <span style={{ width: 6, height: 6, background: T.persimmon500, borderRadius: 999 }} />
      {children}
    </div>
  );
}

// Mercury-style section transition:
// • Long fade zone (~520px) so the color shift is felt, not seen
// • Color holds at each end for a beat before transitioning, eliminating
//   the visible "band" feel
// • Optional warm horizon glow at the midpoint for atmospheric depth
function SectionTransition({ from, to, height = 520, glow = true }) {
  // Determine glow color heuristically — warm coral for either direction
  // since the brand has warm-light identity. Lower opacity on dark→light.
  const glowColor = "rgba(241, 120, 87, 0.18)";
  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        height,
        background: `linear-gradient(180deg,
          ${from} 0%,
          ${from} 6%,
          ${to} 94%,
          ${to} 100%
        )`,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {glow && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(1400px, 90vw)",
            height: "70%",
            background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 70%)`,
            filter: "blur(60px)",
            opacity: 0.9,
          }}
        />
      )}
    </div>
  );
}

function SoftGlow({ color = T.persimmon500, position = "top-right", opacity = 0.18 }) {
  const positions = {
    "top-right":    { top: -120, right: -160, w: 540, h: 540 },
    "top-left":     { top: -120, left: -160, w: 540, h: 540 },
    "bottom-right": { bottom: -120, right: -160, w: 540, h: 540 },
    "bottom-left":  { bottom: -120, left: -160, w: 540, h: 540 },
    center:         { top: "50%", left: "50%", w: 720, h: 720, transform: "translate(-50%,-50%)" },
  };
  const p = positions[position];
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        width: p.w,
        height: p.h,
        top: p.top,
        left: p.left,
        right: p.right,
        bottom: p.bottom,
        transform: p.transform,
        background: `radial-gradient(circle at center, ${color} 0%, transparent 60%)`,
        opacity,
        pointerEvents: "none",
        filter: "blur(40px)",
        zIndex: 0,
      }}
    />
  );
}

// =========================================================
//  REVEAL — scroll-in / scroll-out mask + lift animation
//  Wraps any block; animates clip-path + translateY + opacity.
//  Bidirectional: re-animates if the element leaves & re-enters view.
// =========================================================
function Reveal({ children, delay = 0, direction = "up", as: Tag = "div", style }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    // Failsafe: always show after 700ms regardless of observer state.
    // Content can NEVER be permanently hidden by a stuck clip-path.
    const safety = setTimeout(() => setSeen(true), 700);

    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      clearTimeout(safety);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            clearTimeout(safety);
            setSeen(true);
            observer.disconnect(); // one-shot reveal
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -60px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      clearTimeout(safety);
      observer.disconnect();
    };
  }, []);

  const offset = direction === "down" ? "-28px" : direction === "none" ? "0" : "28px";

  return (
    <Tag
      ref={ref}
      style={{
        // Triple-layer reveal: opacity fade + translateY lift + clip-path mask
        // (bottom-up). The mask gives the dramatic "unveil from below" feel;
        // the lift adds vertical motion; opacity catches any edge cases.
        opacity: seen ? 1 : 0,
        transform: seen ? "translateY(0)" : `translateY(${offset})`,
        clipPath: seen ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        WebkitClipPath: seen ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        transition: `opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms,
                     transform 900ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms,
                     clip-path 1000ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms,
                     -webkit-clip-path 1000ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: "opacity, transform, clip-path",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

// =========================================================
//  FLOW CTA — coral primary with rotating gradient glow edge
//  Animation lives in globals.css under .cta-flow
// =========================================================
function FlowCTA({ children, onDark = false, onClick, arrow = true, style }) {
  return (
    <button
      onClick={onClick}
      className={`cta-flow${onDark ? " on-dark" : ""}`}
      style={style}
    >
      <span className="cta-flow-pulse" aria-hidden />
      <span style={{ position: "relative", zIndex: 2, display: "inline-flex", alignItems: "center", gap: 8 }}>
        {children}
        {arrow && <ArrowRight size={15} strokeWidth={2} />}
      </span>
    </button>
  );
}

// =========================================================
//  LOGO CAROUSEL — infinite marquee with edge fades (Stripe-pattern)
// =========================================================
function LogoCarousel({ bgFade = "var(--canvas)" }) {
  const logos = [
    { name: "TRAM",             color: T.persimmon600 },
    { name: "HYBRID",           color: T.midnight },
    { name: "SLICE",            color: T.ink },
    { name: "KK's Hot Chicken", color: T.persimmon600 },
    { name: "Butter",           color: T.matcha600 },
    { name: "Sofia's",          color: T.nebula600 },
    { name: "Bayou Bistro",     color: T.cobalt600 },
  ];
  // Duplicate the set so the marquee loops seamlessly at translateX(-50%)
  const items = [...logos, ...logos];
  return (
    <div style={{ position: "relative", overflow: "hidden", padding: "10px 0" }}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 160,
          background: `linear-gradient(90deg, ${bgFade} 0%, transparent 100%)`,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 160,
          background: `linear-gradient(270deg, ${bgFade} 0%, transparent 100%)`,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
      <div className="logo-marquee">
        {items.map((logo, i) => (
          <div
            key={i}
            style={{
              padding: "12px 28px",
              borderRadius: 999,
              border: `1px solid ${T.hairline}`,
              background: T.surface,
              color: logo.color,
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {logo.name}
          </div>
        ))}
      </div>
    </div>
  );
}

// LogoType01 SVG · 846x212 viewBox → ~3.99:1 aspect ratio. Height-driven sizing
// keeps the wordmark crisp regardless of size prop. Width auto-scales.
function LogoMark({ size = 28 }) {
  return (
    <img
      src="/nova-logotype.svg"
      alt="Nova"
      height={size}
      style={{ height: size, width: "auto", display: "block" }}
    />
  );
}

// =========================================================
//  ROOT — Mercury-style token theming
//  Each section declares its theme via data-section-theme.
//  The wrapper reads the active section's theme on scroll and animates
//  its background + text color via CSS transition. No gradient strips.
// =========================================================
export default function LandingPage() {
  const theme = useScrollTheme("light");
  const isDark = theme === "dark";
  return (
    <div
      data-theme={theme}
      style={{
        // Wrapper bg is the single source of truth for the page background.
        // Dark theme uses #171721 — a warmer near-black with a hint of indigo —
        // and a matching dark ramp (hairline: #2A2A35) used by adjacent surfaces.
        background: isDark ? "#171721" : T.canvas,
        color: isDark ? T.whisper : T.ink,
        transition:
          "background-color 900ms cubic-bezier(0.4, 0, 0.2, 1), color 900ms cubic-bezier(0.4, 0, 0.2, 1)",
        fontFamily: FONT_BODY,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <Nav theme={theme} />
      <Hero />
      <ConsolidationBenefit />
      <AICatalogue />
      <SystemsThatNeverSpoke />
      <Segmenter />
      <HowItWorks />
      <CustomerOutcomes />
      <FinalCTA />
      <Footer />
    </div>
  );
}

// =========================================================
//  NAV
// =========================================================
function Nav({ theme = "light" }) {
  const y = useScrollY();
  const scrolled = y > 32;
  const isDark = theme === "dark";
  const links = ["Platform", "AI", "Solutions", "Customers", "Pricing", "Company"];

  // Frosted-glass pill adapts to wrapper theme. Same 900ms transition timing
  // as the wrapper so the nav bg/border/text move in lockstep during the
  // theme swap — no flash of mismatched chrome.
  const pillBg = scrolled
    ? isDark
      ? "rgba(23,23,33,0.72)"
      : "rgba(250,250,251,0.78)"
    : "transparent";
  const pillBorder = scrolled
    ? isDark
      ? "#2A2A35"
      : T.hairline
    : "transparent";
  const pillShadow = scrolled
    ? isDark
      ? "0 1px 0 rgba(255,255,255,0.04), 0 12px 28px -16px rgba(0,0,0,0.45)"
      : "0 1px 0 rgba(20,17,15,0.04), 0 12px 28px -16px rgba(20,17,15,0.16)"
    : "none";
  const linkColor = isDark ? T.whisperSoft : T.inkMuted;
  const themeTransition =
    "background-color 900ms cubic-bezier(0.4,0,0.2,1), border-color 900ms cubic-bezier(0.4,0,0.2,1), color 900ms cubic-bezier(0.4,0,0.2,1), box-shadow 900ms cubic-bezier(0.4,0,0.2,1)";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        padding: scrolled ? "10px 0" : "20px 0",
        transition: "padding 280ms cubic-bezier(0.2,0,0,1)",
      }}
    >
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: scrolled ? "8px 14px 8px 18px" : "10px 16px 10px 20px",
            background: pillBg,
            backdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
            border: `1px solid ${pillBorder}`,
            borderRadius: 999,
            boxShadow: pillShadow,
            transition: `${themeTransition}, padding 280ms cubic-bezier(0.2,0,0,1), max-width 280ms cubic-bezier(0.2,0,0,1), margin 280ms cubic-bezier(0.2,0,0,1)`,
            maxWidth: scrolled ? 1100 : "100%",
            margin: scrolled ? "0 auto" : "0",
          }}
        >
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <LogoMark size={28} />
          </a>
          <nav style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {links.map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  fontSize: 14,
                  color: linkColor,
                  textDecoration: "none",
                  fontWeight: 500,
                  letterSpacing: "-0.005em",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  transition: "color 900ms cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                {l}
                {(l === "Platform" || l === "AI" || l === "Solutions" || l === "Customers" || l === "Company") && (
                  <svg width="10" height="10" viewBox="0 0 10 10" style={{ marginTop: 1, opacity: 0.5 }}>
                    <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                  </svg>
                )}
              </a>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a
              href="#"
              style={{
                fontSize: 14,
                color: linkColor,
                textDecoration: "none",
                fontWeight: 500,
                transition: "color 900ms cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              Sign in
            </a>
            <Button variant="primary" style={{ padding: scrolled ? "8px 16px" : "10px 18px", fontSize: 14 }}>
              Book a demo
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}

// =========================================================
//  HERO — Stripe-style structure
//  Flowing gradient extends behind the headline, beyond the
//  right margin. Headline is lighter weight (500), giving the
//  copy more breathing room. Logo row integrated below.
// =========================================================
function Hero() {
  return (
    // overflow:visible (not hidden) so the orange gradient bleeds *behind* the
    // transparent sticky header — fills the white strip at the top of the page.
    // body has overflow-x:clip so horizontal bleed is safely clipped at the viewport.
    <section data-section-theme="light" style={{ position: "relative", padding: "72px 0 80px", overflow: "visible" }}>
      <HeroFlowVisual />
      <Container style={{ position: "relative", zIndex: 2 }}>
        <Reveal>
          <h1
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 48,
              lineHeight: 1.08,
              letterSpacing: "-0.028em",
              fontWeight: 500,
              color: T.ink,
              margin: "0",
              maxWidth: 880,
            }}
          >
            The unified <span style={{ color: T.persimmon600 }}>AI-native</span> platform for restaurant operations.
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: 16,
              lineHeight: 1.55,
              color: T.inkMuted,
              margin: "24px 0 0",
              maxWidth: 640,
              letterSpacing: "-0.005em",
            }}
          >
            POS, ordering, kitchen, loyalty, workforce and AI — on one intelligent
            data layer built for enterprise restaurants. Every order, every channel,
            every decision, connected.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 36, flexWrap: "wrap" }}>
            <FlowCTA>Book a demo</FlowCTA>
            <a
              href="#"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: FONT_BODY,
                fontSize: 15,
                fontWeight: 500,
                color: T.ink,
                letterSpacing: "-0.005em",
                textDecoration: "none",
                padding: "13px 16px",
              }}
            >
              See the platform <ArrowRight size={15} strokeWidth={2} />
            </a>
          </div>
        </Reveal>

        {/* Logo carousel — centered inside the content container, marquee with edge fades */}
        <div style={{ marginTop: 96 }}>
          <Reveal>
            <div
              style={{
                fontFamily: FONT_BODY,
                fontSize: 15,
                letterSpacing: "-0.01em",
                color: T.inkSoft,
                fontWeight: 400,
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              Powering 680 restaurants from emerging brands to enterprise chains
            </div>
          </Reveal>
          <Reveal delay={80}>
            <LogoCarousel bgFade={T.canvas} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

// Flowing gradient that extends from the right edge of the
// viewport, behind the headline. Multiple layered radial +
// blurred wide strokes give the Stripe-flow feel — no hard
// edges, all blending to canvas.
function HeroFlowVisual() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        // Extend up high enough to bleed behind the sticky header.
        top: -180,
        // Bleed past the right edge of the viewport — body has overflow-x:clip
        // so we don't create horizontal scroll.
        right: "-12vw",
        width: "min(1300px, 78vw)",
        height: "min(1240px, 100vh)",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <PlaceholderTag>Lottie · brand flow</PlaceholderTag>
      <svg
        viewBox="0 0 1100 1100"
        preserveAspectRatio="xMaxYMin slice"
        style={{ width: "100%", height: "100%", display: "block", position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id="flow-ribbon-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9A060" stopOpacity="0" />
            <stop offset="40%" stopColor="#F9A060" stopOpacity="0.85" />
            <stop offset="65%" stopColor="#F17857" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#E9504D" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="flow-ribbon-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E9504D" stopOpacity="0" />
            <stop offset="35%" stopColor="#FAAF89" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#F17857" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="flow-ribbon-3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6A43D8" stopOpacity="0" />
            <stop offset="50%" stopColor="#9965F0" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#F9A060" stopOpacity="0" />
          </linearGradient>
          <filter id="ribbon-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
          <filter id="ribbon-blur-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="38" />
          </filter>
        </defs>

        {/* Outer halo wash — biggest, softest */}
        <ellipse
          cx="900"
          cy="500"
          rx="700"
          ry="500"
          fill="#F9A060"
          opacity="0.18"
          filter="url(#ribbon-blur-soft)"
        />

        {/* Ribbon 1 — primary coral-to-marigold sweep */}
        <path
          d="M 1200 -80 Q 1050 200, 600 380 Q 200 550, -100 950"
          stroke="url(#flow-ribbon-1)"
          strokeWidth="170"
          fill="none"
          strokeLinecap="round"
          filter="url(#ribbon-blur)"
          opacity="0.85"
        />

        {/* Ribbon 2 — peach with violet hint, crossing direction */}
        <path
          d="M 1300 200 Q 900 100, 560 320 Q 250 480, 100 780"
          stroke="url(#flow-ribbon-2)"
          strokeWidth="220"
          fill="none"
          strokeLinecap="round"
          filter="url(#ribbon-blur)"
          opacity="0.75"
        />

        {/* Ribbon 3 — nebula whisper */}
        <path
          d="M 1100 600 Q 750 700, 400 580 Q 150 480, -50 600"
          stroke="url(#flow-ribbon-3)"
          strokeWidth="180"
          fill="none"
          strokeLinecap="round"
          filter="url(#ribbon-blur-soft)"
          opacity="0.55"
        />

        {/* Inner hot core */}
        <ellipse
          cx="780"
          cy="320"
          rx="180"
          ry="120"
          fill="#F17857"
          opacity="0.35"
          filter="url(#ribbon-blur)"
        />
      </svg>

      {/* Canvas-fade at the bottom + left so the flow blends into the page */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, transparent 60%, var(--canvas) 100%), linear-gradient(90deg, var(--canvas) 0%, transparent 30%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// =========================================================
//  LOGO STRIP
// =========================================================
function LogoStrip() {
  const enterprise = ["TRAM", "HYBRID", "KK's Hot Chicken"];
  const emerging = ["Bayou Bistro", "Butter", "Sofia's", "Slice"];
  return (
    <section style={{ padding: "32px 0 72px" }}>
      <Container>
        <div style={{ borderTop: `1px solid ${T.hairline}`, paddingTop: 48 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1.5fr", gap: 40, alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: T.inkSoft, marginBottom: 12 }}>
                Powering restaurants
              </div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 500, letterSpacing: "-0.03em", color: T.ink, lineHeight: 1 }}>
                680 locations<span style={{ color: T.persimmon600 }}>.</span>
              </div>
              <div style={{ fontSize: 13, color: T.inkMuted, marginTop: 6 }}>One system.</div>
            </div>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: T.persimmon600, marginBottom: 14 }}>
                Enterprise · 300+ locations
              </div>
              <div style={{ display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
                {enterprise.map((b) => (
                  <span key={b} style={{ fontSize: 16, fontWeight: 600, color: T.inkMuted, letterSpacing: "-0.02em" }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ borderLeft: `1px solid ${T.hairline}`, paddingLeft: 40 }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: T.cobalt600, marginBottom: 14 }}>
                Emerging brands
              </div>
              <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
                {emerging.map((b) => (
                  <span key={b} style={{ fontSize: 16, fontWeight: 600, color: T.inkMuted, letterSpacing: "-0.02em" }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// =========================================================
//  CONSOLIDATION BENEFIT
// =========================================================
function ConsolidationBenefit() {
  const proofs = [
    "One platform replaces 7-10+ legacy vendors",
    "One guest profile across every channel",
    "One loyalty balance — app, web, kiosk, drive-thru, POS",
    "AI-driven intelligence on every order and decision",
  ];
  return (
    <section data-section-theme="light" style={{ padding: "120px 0", position: "relative" }}>
      <Container>
        <Reveal>
          <SectionLabel index="01" label="Consolidation" />
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <Reveal>
              {/* currentColor binds the headline to the wrapper's transitioning
                  text color so the copy stays readable as the bg fades to dark
                  when the AI section enters the viewport. */}
              <Heading size={52} color="currentColor">
                Stop managing
                <br />
                multiple vendors.
                <br />
                <span style={{ color: T.persimmon600 }}>Run on one</span> platform.
              </Heading>
            </Reveal>
            <Reveal delay={120}>
              <Body size={17} color="currentColor" style={{ marginTop: 28, maxWidth: 460, opacity: 0.7 }}>
                Most restaurant chains operate across 7 to 10 disconnected systems
                for POS, loyalty, ordering, labor, inventory, reporting, and
                accounting. Nova replaces them with one unified AI-native platform
                built on a single data layer.
              </Body>
            </Reveal>
            <ul style={{ listStyle: "none", padding: 0, margin: "28px 0 32px", display: "flex", flexDirection: "column", gap: 14 }}>
              {proofs.map((p, i) => (
                <Reveal key={p} delay={200 + i * 80}>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 15, color: "currentColor", opacity: 0.85, fontWeight: 500 }}>
                    {/* Theme-adaptive bullet: light-peach container + coral
                        check in light mode; translucent persimmon container +
                        brighter persimmon icon in dark mode (CSS rules in
                        globals.css scoped via [data-theme="dark"]). */}
                    <span
                      className="check-bullet"
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 999,
                        background: T.persimmon50,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 2,
                        transition:
                          "background-color 900ms cubic-bezier(0.4,0,0.2,1)",
                      }}
                    >
                      <Check
                        className="check-bullet-icon"
                        size={11}
                        color={T.persimmon600}
                        strokeWidth={3}
                      />
                    </span>
                    <span style={{ lineHeight: 1.5 }}>{p}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={520}>
              <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, color: T.persimmon600, fontWeight: 600, textDecoration: "none", letterSpacing: "-0.005em" }}>
                See every Nova module <ArrowRight size={14} />
              </a>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <ConsolidationDiagram />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function ConsolidationDiagram() {
  return (
    <div style={{ position: "relative", aspectRatio: "1/1", maxWidth: 520, margin: "0 auto" }}>
      <PlaceholderTag>Lottie · vendors consolidating</PlaceholderTag>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at center, ${T.persimmon100}88 0%, ${T.canvas} 70%)`,
          borderRadius: "50%",
        }}
      />
      <svg viewBox="0 0 480 480" style={{ position: "relative", width: "100%", height: "100%" }}>
        <defs>
          <radialGradient id="cd-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={T.persimmon600} />
            <stop offset="100%" stopColor={T.persimmon500} />
          </radialGradient>
          <radialGradient id="cd-node-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={T.surface} stopOpacity="1" />
            <stop offset="100%" stopColor={T.surface} stopOpacity="0" />
          </radialGradient>
        </defs>
        {[
          [80, 100], [400, 80], [60, 240], [420, 260], [100, 400], [380, 400],
          [240, 50], [240, 430], [180, 90], [300, 90],
        ].map(([x, y], i) => (
          <line key={i} x1={x} y1={y} x2="240" y2="240" stroke={T.persimmon300} strokeOpacity="0.3" strokeWidth="1.2" strokeDasharray="3 4" />
        ))}
        {[
          { x: 80, y: 100, label: "POS" },
          { x: 400, y: 80, label: "KDS" },
          { x: 60, y: 240, label: "Loyalty" },
          { x: 420, y: 260, label: "Orders" },
          { x: 100, y: 400, label: "Reports" },
          { x: 380, y: 400, label: "Labor" },
          { x: 240, y: 50, label: "Inventory" },
          { x: 240, y: 430, label: "Payments" },
          { x: 180, y: 90, label: "Kiosk" },
          { x: 300, y: 90, label: "Drive-thru" },
        ].map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="34" fill="url(#cd-node-fade)" />
            <circle cx={n.x} cy={n.y} r="22" fill={T.surface} stroke={T.hairline} strokeWidth="1" />
            <text x={n.x} y={n.y + 3} textAnchor="middle" fontSize="9" fontWeight="500" fill={T.inkMuted} fontFamily={FONT_BODY}>
              {n.label}
            </text>
          </g>
        ))}
        <circle cx="240" cy="240" r="78" fill="url(#cd-center)" />
        <circle cx="240" cy="240" r="78" fill="none" stroke={T.persimmon600} strokeOpacity="0.15" strokeWidth="20" />
        <text x="240" y="248" textAnchor="middle" fontSize="22" fontWeight="700" fill={T.whisper} fontFamily={FONT_DISPLAY} letterSpacing="-0.04em">
          nova
        </text>
      </svg>
      <div
        style={{
          position: "absolute",
          bottom: 24,
          right: 8,
          background: T.surface,
          border: `1px solid ${T.hairline}`,
          borderRadius: 14,
          padding: "12px 16px",
          boxShadow: "0 10px 24px -12px rgba(20,17,15,0.16)",
        }}
      >
        <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: T.inkSoft, marginBottom: 4 }}>
          Replaced
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 500, letterSpacing: "-0.025em", color: T.persimmon600, lineHeight: 1 }}>
          7–10+ vendors
        </div>
      </div>
    </div>
  );
}

// =========================================================
//  AI CATALOGUE — Mercury-style: 3 lottie cards with title + subtext below
// =========================================================
function AICatalogue() {
  const cards = [
    {
      key: "voice",
      title: "AI Voice Ordering",
      subtext: "Drive-thru and phone orders captured in real time. Multilingual conversations with direct POS and KDS integration — every ticket, recovered.",
      accent: T.nebula500,
      visual: <VoiceVizLarge accent={T.nebula500} />,
    },
    {
      key: "upsell",
      title: "Automated Upsell",
      subtext: "Personalized AI recommendations across every channel — digital, kiosk, drive-thru, in-store — that lift average ticket size on every order.",
      accent: T.persimmon500,
      visual: <UpsellVizLarge accent={T.persimmon500} />,
    },
    {
      key: "insights",
      title: "Reporting AI",
      subtext: "Surfaces actionable opportunities across location, daypart, menu item, and guest behavior — automatically, in plain English.",
      accent: T.cobalt500,
      visual: <InsightsVizLarge accent={T.cobalt500} />,
    },
    {
      key: "vision",
      title: "Vision AI",
      subtext: "Tracks line speed, table turn, and operational anomalies in real time — without adding a single new device to the line.",
      accent: T.matcha500,
      visual: <VisionVizLarge accent={T.matcha500} />,
    },
    {
      key: "copilot",
      title: "Manager Copilot",
      subtext: "A conversational interface to your entire restaurant operation. Ask plain-English questions; get real answers backed by live data.",
      accent: T.saffron500,
      visual: <CopilotVizLarge accent={T.saffron500} />,
    },
    {
      key: "campaigns",
      title: "AI Campaigns",
      subtext: "Generates audiences, offers, and messaging automatically — across SMS, email, and loyalty — based on what your guests actually do.",
      accent: T.persimmon500,
      visual: <CampaignsVizLarge accent={T.persimmon500} />,
    },
  ];
  return (
    <section
      data-section-theme="dark"
      style={{
        padding: "140px 0",
        // No explicit color — children inherit from the wrapper so they
        // animate with it across the dark↔light transition. In light mode
        // titles render in ink (#14110F); in dark, whisper (#FAFAFB).
        // Section is transparent — the wrapper's dark theme bg (#171721) shows through.
        position: "relative",
        overflow: "hidden",
      }}
    >

      {/* Prominent glows that hold up in both themes — large, saturated bloom
          so the section reads as the AI moment regardless of wrapper bg. */}
      <SoftGlow color={T.nebula500} position="top-right" opacity={0.55} />
      <SoftGlow color={T.persimmon500} position="bottom-left" opacity={0.40} />

      <Container style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <SectionLabel label="AI Catalogue" color={T.nebula500} />
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 60, alignItems: "end", marginBottom: 80 }}>
          <Reveal>
            {/* currentColor binds to wrapper's transitioning text color so the
                copy stays readable during the dark→light wrapper fade. */}
            <Heading size={64} color="currentColor">
              AI built into
              <br />
              restaurant <span style={{ color: T.nebula500 }}>operations</span>.
            </Heading>
          </Reveal>
          <Reveal delay={120}>
            <Body color="currentColor" size={17} style={{ paddingBottom: 8, opacity: 0.7 }}>
              Nine AI capabilities across ordering, marketing, operations, labor, and guest engagement. Each one built on the same data layer the rest of Nova runs on.
            </Body>
          </Reveal>
        </div>
        {/* Mercury pattern: 6 lottie cards in a 3x2 grid · row gap widened per design */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", columnGap: 28, rowGap: 92 }}>
          {cards.map(({ key, ...rest }, i) => (
            <Reveal key={key} delay={i * 120}>
              <MercuryAICard {...rest} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={520}>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 72 }}>
            <FlowCTA onDark>Browse full AI catalogue</FlowCTA>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

// =========================================================
//  SPIRAL FLOW — code-generated Linear/Stripe-style flowing curves
//  Total markup ~5KB. No mix-blend-mode. No external asset.
// =========================================================
function SpiralFlow() {
  const LINES = 110;
  const lines = [];
  for (let i = 0; i < LINES; i++) {
    const t = i / (LINES - 1);
    // perpendicular offset from the spine — wider spread for the open feel of the reference
    const yOff = (t - 0.5) * 360;
    // A smooth sine-like sweep: down through the middle, then back up — matches the reference's wave
    const d =
      `M -160 ${280 + yOff * 0.85} ` +
      `C 560 ${980 + yOff * 0.55}, 1380 ${140 + yOff * 0.65}, 2080 ${400 + yOff * 0.85}`;
    lines.push({ d, t });
  }
  return (
    <svg
      viewBox="0 0 1920 1000"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="spiral-streak" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#000026" stopOpacity="0" />
          <stop offset="6%"   stopColor="#FF2785" stopOpacity="0.85" />
          <stop offset="18%"  stopColor="#E91E63" stopOpacity="1" />
          <stop offset="34%"  stopColor="#9333EA" stopOpacity="0.95" />
          <stop offset="50%"  stopColor="#6A43D8" stopOpacity="0.85" />
          <stop offset="66%"  stopColor="#5B7CFF" stopOpacity="0.85" />
          <stop offset="82%"  stopColor="#22D3FF" stopOpacity="1" />
          <stop offset="94%"  stopColor="#3DC8FF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#000026" stopOpacity="0" />
        </linearGradient>
        <filter id="spiral-soft" x="-2%" y="-2%" width="104%" height="104%">
          <feGaussianBlur stdDeviation="0.4" />
        </filter>
      </defs>
      <g filter="url(#spiral-soft)">
        {lines.map(({ d, t }, i) => {
          const centerness = 1 - Math.abs(t - 0.5) * 2; // 0 at edges, 1 at center spine
          const strokeWidth = 0.45 + centerness * 0.55;
          const opacity = 0.16 + centerness * 0.78;
          return (
            <path
              key={i}
              d={d}
              stroke="url(#spiral-streak)"
              strokeWidth={strokeWidth}
              fill="none"
              opacity={opacity}
              strokeLinecap="round"
            />
          );
        })}
      </g>
    </svg>
  );
}

function MercuryAICard({ title, subtext, accent, visual }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Visual card frame — lottie placeholder lives inside */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          position: "relative",
          overflow: "hidden",
          aspectRatio: "1/1.05",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(10px)",
          transition: "border-color 320ms ease, transform 320ms cubic-bezier(0.2,0,0,1), background 320ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.borderColor = `${accent}55`;
          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        }}
      >
        {/* Soft accent glow behind the visual — blends into card surface */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "70%",
            background: `radial-gradient(circle at center, ${accent}38 0%, transparent 65%)`,
            filter: "blur(50px)",
            pointerEvents: "none",
          }}
        />
        <PlaceholderTag>Lottie placeholder</PlaceholderTag>
        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {visual}
        </div>
      </div>

      {/* Title + subtext BELOW the card, not inside. Both bound to currentColor
          so they fade with the wrapper across the dark↔light transition. */}
      <div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: "currentColor",
            letterSpacing: "-0.02em",
            marginBottom: 10,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 15,
            color: "currentColor",
            opacity: 0.7,
            lineHeight: 1.55,
            letterSpacing: "-0.005em",
          }}
        >
          {subtext}
        </div>
      </div>
    </div>
  );
}

// Large visualization placeholders — fill the Mercury card area
function VoiceVizLarge({ accent }) {
  return (
    <svg viewBox="0 0 320 320" style={{ width: "75%", height: "75%" }}>
      <defs>
        <radialGradient id="voice-orb" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.3" />
        </radialGradient>
        <linearGradient id="voice-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="1" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {/* concentric rings */}
      <circle cx="160" cy="160" r="120" fill="none" stroke={accent} strokeOpacity="0.12" strokeWidth="1" />
      <circle cx="160" cy="160" r="90"  fill="none" stroke={accent} strokeOpacity="0.18" strokeWidth="1" />
      <circle cx="160" cy="160" r="60"  fill="none" stroke={accent} strokeOpacity="0.25" strokeWidth="1.5" />
      {/* central orb */}
      <circle cx="160" cy="160" r="34" fill="url(#voice-orb)" />
      <circle cx="160" cy="160" r="34" fill="none" stroke={accent} strokeOpacity="0.6" strokeWidth="1" />
      {/* mic glyph */}
      <rect x="153" y="148" width="14" height="20" rx="7" fill="#fff" opacity="0.95" />
      <path d="M 145 165 Q 160 178, 175 165" stroke="#fff" strokeWidth="2" fill="none" opacity="0.85" strokeLinecap="round" />
      <line x1="160" y1="175" x2="160" y2="183" stroke="#fff" strokeWidth="2" opacity="0.85" strokeLinecap="round" />
      {/* waveform bars flanking the orb */}
      {[
        { x: 60,  h: 8 },  { x: 75,  h: 14 }, { x: 90,  h: 22 }, { x: 105, h: 32 },
        { x: 215, h: 32 }, { x: 230, h: 22 }, { x: 245, h: 14 }, { x: 260, h: 8  },
      ].map((b, i) => (
        <rect key={i} x={b.x - 2} y={160 - b.h / 2} width="4" height={b.h} rx="2" fill="url(#voice-bar)" />
      ))}
    </svg>
  );
}

function UpsellVizLarge({ accent }) {
  return (
    <svg viewBox="0 0 320 320" style={{ width: "75%", height: "75%" }}>
      <defs>
        <linearGradient id="up-card-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="up-arrow-grad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0" />
          <stop offset="100%" stopColor={accent} stopOpacity="1" />
        </linearGradient>
      </defs>
      {/* stacked tickets */}
      <rect x="60"  y="200" width="180" height="60" rx="12" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.10)" />
      <rect x="70"  y="170" width="180" height="60" rx="12" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" />
      <rect x="80"  y="140" width="180" height="60" rx="12" fill="url(#up-card-grad)" />
      {/* big % on top card */}
      <text x="170" y="178" textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff" fontFamily="'Söhne', Inter, sans-serif" letterSpacing="-0.04em">+7.4%</text>
      <text x="170" y="192" textAnchor="middle" fontSize="10" fontWeight="500" fill="#fff" fontFamily="Inter, sans-serif" opacity="0.85" letterSpacing="0.08em">AVG TICKET</text>
      {/* rising arrow trail */}
      <path d="M 50 290 Q 110 250, 160 220 T 280 90" stroke="url(#up-arrow-grad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="280" cy="90" r="6" fill={accent} />
      <circle cx="280" cy="90" r="13" fill="none" stroke={accent} strokeOpacity="0.4" />
      <path d="M 270 80 L 280 90 L 290 80" stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InsightsVizLarge({ accent }) {
  return (
    <svg viewBox="0 0 320 320" style={{ width: "82%", height: "82%" }}>
      <defs>
        <linearGradient id="ins-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.45" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* baseline grid */}
      {[60, 110, 160, 210, 260].map((y) => (
        <line key={y} x1="30" y1={y} x2="290" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="2 4" />
      ))}
      {/* area fill */}
      <path d="M 30 230 C 70 220, 100 200, 130 180 S 200 100, 240 70 L 290 50 L 290 270 L 30 270 Z" fill="url(#ins-area)" />
      {/* line */}
      <path d="M 30 230 C 70 220, 100 200, 130 180 S 200 100, 240 70 L 290 50" stroke={accent} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {/* peak marker */}
      <circle cx="240" cy="70" r="6" fill={accent} />
      <circle cx="240" cy="70" r="14" fill="none" stroke={accent} strokeOpacity="0.35" />
      {/* insight pill callout */}
      <g transform="translate(140, 28)">
        <rect x="0" y="0" width="120" height="32" rx="16" fill={accent} fillOpacity="0.18" stroke={accent} strokeOpacity="0.5" />
        <circle cx="14" cy="16" r="4" fill={accent} />
        <text x="26" y="20" fontSize="11" fontWeight="500" fill="#fff" fontFamily="Inter, sans-serif" letterSpacing="-0.005em">+18% sales lift</text>
      </g>
    </svg>
  );
}

function VisionVizLarge({ accent }) {
  return (
    <svg viewBox="0 0 320 320" style={{ width: "76%", height: "76%" }}>
      <defs>
        <radialGradient id="vision-target" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.3" />
        </radialGradient>
      </defs>
      {/* camera-style frame with corner brackets */}
      {[
        "M 40 80 L 40 40 L 80 40",
        "M 280 40 L 280 40 L 280 80 M 240 40 L 280 40",
        "M 40 240 L 40 280 L 80 280",
        "M 240 280 L 280 280 L 280 240",
      ].map((d, i) => (
        <path key={i} d={d} stroke={accent} strokeOpacity="0.7" strokeWidth="2" fill="none" strokeLinecap="round" />
      ))}
      {/* scan grid lines */}
      {[100, 140, 180, 220].map((y) => (
        <line key={y} x1="60" y1={y} x2="260" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="2 4" />
      ))}
      {/* detected boxes (table turn / line speed) */}
      <rect x="76" y="100" width="64" height="48" rx="6" fill="none" stroke={accent} strokeOpacity="0.4" strokeWidth="1.2" />
      <text x="84" y="116" fontSize="9" fontWeight="500" fill={accent} fontFamily="Inter, sans-serif" letterSpacing="0.06em">TABLE 04</text>
      <rect x="160" y="160" width="80" height="56" rx="6" fill="none" stroke={accent} strokeOpacity="0.65" strokeWidth="1.5" />
      <text x="168" y="176" fontSize="9" fontWeight="500" fill={accent} fontFamily="Inter, sans-serif" letterSpacing="0.06em">LINE · 3 MIN</text>
      {/* target reticle in center */}
      <circle cx="160" cy="160" r="14" fill="url(#vision-target)" />
      <line x1="160" y1="148" x2="160" y2="172" stroke="#fff" strokeWidth="1.5" opacity="0.9" />
      <line x1="148" y1="160" x2="172" y2="160" stroke="#fff" strokeWidth="1.5" opacity="0.9" />
    </svg>
  );
}

function CopilotVizLarge({ accent }) {
  return (
    <svg viewBox="0 0 320 320" style={{ width: "78%", height: "78%" }}>
      <defs>
        <linearGradient id="copilot-bubble" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {/* user bubble (top-right, smaller) */}
      <rect x="120" y="60" width="170" height="46" rx="20" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.14)" />
      <text x="138" y="79" fontSize="11" fontWeight="500" fill="#fff" fontFamily="Inter, sans-serif" opacity="0.9">Slowest item</text>
      <text x="138" y="95" fontSize="11" fontWeight="500" fill="#fff" fontFamily="Inter, sans-serif" opacity="0.9">this lunch?</text>
      {/* AI bubble (below-left, larger, accent-colored) */}
      <rect x="30" y="130" width="240" height="100" rx="22" fill="url(#copilot-bubble)" />
      {/* sparkle */}
      <g transform="translate(50, 152)">
        <path d="M 8 0 L 10 6 L 16 8 L 10 10 L 8 16 L 6 10 L 0 8 L 6 6 Z" fill="#fff" />
      </g>
      <text x="78" y="158" fontSize="11" fontWeight="500" fill="#fff" fontFamily="Inter, sans-serif" letterSpacing="0.04em">NOVA COPILOT</text>
      <text x="50" y="184" fontSize="12" fontWeight="500" fill="#fff" fontFamily="Inter, sans-serif">Lobster roll — 11.4 min</text>
      <text x="50" y="204" fontSize="11" fontWeight="400" fill="#fff" fontFamily="Inter, sans-serif" opacity="0.85">vs 6 min target. Want me to</text>
      <text x="50" y="218" fontSize="11" fontWeight="400" fill="#fff" fontFamily="Inter, sans-serif" opacity="0.85">flag prep for tomorrow?</text>
      {/* typing dots */}
      <g transform="translate(140, 264)">
        <circle cx="0"  cy="0" r="4" fill={accent} opacity="0.95" />
        <circle cx="14" cy="0" r="4" fill={accent} opacity="0.65" />
        <circle cx="28" cy="0" r="4" fill={accent} opacity="0.35" />
      </g>
    </svg>
  );
}

function CampaignsVizLarge({ accent }) {
  return (
    <svg viewBox="0 0 320 320" style={{ width: "78%", height: "78%" }}>
      <defs>
        <radialGradient id="camp-hub" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.5" />
        </radialGradient>
      </defs>
      {/* fanning lines from hub to audience nodes */}
      {[
        { x: 50, y: 80, label: "Lapsed VIPs", count: "2,140" },
        { x: 270, y: 80, label: "First-time", count: "4,820" },
        { x: 30, y: 230, label: "Weeknight", count: "1,510" },
        { x: 290, y: 230, label: "Drive-thru", count: "8,930" },
      ].map((n, i) => (
        <g key={i}>
          <line x1={n.x} y1={n.y} x2="160" y2="160" stroke={accent} strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="3 4" />
          <rect
            x={n.x < 160 ? n.x - 4 : n.x - 76}
            y={n.y - 20}
            width="80"
            height="40"
            rx="10"
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.12)"
          />
          <text
            x={n.x < 160 ? n.x + 4 : n.x - 68}
            y={n.y - 4}
            fontSize="9"
            fontWeight="500"
            fill="#fff"
            fontFamily="Inter, sans-serif"
            opacity="0.85"
            letterSpacing="0.04em"
          >
            {n.label}
          </text>
          <text
            x={n.x < 160 ? n.x + 4 : n.x - 68}
            y={n.y + 11}
            fontSize="11"
            fontWeight="500"
            fill={accent}
            fontFamily="Inter, sans-serif"
            letterSpacing="-0.02em"
          >
            {n.count}
          </text>
        </g>
      ))}
      {/* center hub */}
      <circle cx="160" cy="160" r="46" fill="url(#camp-hub)" />
      {/* paper-plane glyph */}
      <path d="M 145 152 L 178 160 L 145 168 L 152 160 Z" fill="#fff" opacity="0.95" />
      <text x="160" y="186" fontSize="9" fontWeight="500" fill="#fff" fontFamily="Inter, sans-serif" textAnchor="middle" opacity="0.9" letterSpacing="0.08em">AUTO-SENT</text>
    </svg>
  );
}

function VoiceWaveViz() {
  return (
    <svg width="160" height="60" viewBox="0 0 160 60">
      <defs>
        <linearGradient id="vw-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={T.nebula600} stopOpacity="0.1" />
          <stop offset="50%" stopColor={T.nebula600} stopOpacity="1" />
          <stop offset="100%" stopColor={T.nebula600} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {[10, 22, 14, 30, 18, 38, 26, 32, 20, 26, 14, 20, 8].map((h, i) => (
        <rect key={i} x={i * 12 + 4} y={30 - h / 2} width="5" height={h} rx="2.5" fill="url(#vw-grad)" />
      ))}
    </svg>
  );
}

function UpsellViz() {
  return (
    <svg width="180" height="80" viewBox="0 0 180 80">
      <defs>
        <linearGradient id="up-fade" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={T.persimmon500} stopOpacity="0" />
          <stop offset="100%" stopColor={T.persimmon500} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <rect x="20" y="46" width="60" height="26" rx="6" fill={T.surface} stroke={T.hairline} />
      <rect x="36" y="38" width="60" height="26" rx="6" fill={T.surface} stroke={T.hairline} />
      <rect x="52" y="30" width="60" height="26" rx="6" fill="url(#up-fade)" stroke={T.persimmon500} strokeOpacity="0.6" />
      <text x="82" y="46" textAnchor="middle" fontSize="11" fontWeight="600" fill={T.persimmon600} fontFamily={FONT_BODY}>+7.4%</text>
      <path d="M120 50 L 150 22" stroke={T.persimmon600} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M150 22 L 142 24 M 150 22 L 148 30" stroke={T.persimmon600} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function InsightsViz() {
  return (
    <svg width="180" height="80" viewBox="0 0 180 80">
      <defs>
        <linearGradient id="ins-fade" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={T.cobalt500} stopOpacity="0" />
          <stop offset="100%" stopColor={T.cobalt500} stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <path d="M10 60 C 30 50, 50 55, 70 40 S 110 25, 140 18 L 170 14 L 170 80 L 10 80 Z" fill="url(#ins-fade)" />
      <path d="M10 60 C 30 50, 50 55, 70 40 S 110 25, 140 18 L 170 14" stroke={T.cobalt600} strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="140" cy="18" r="4" fill={T.cobalt600} />
      <circle cx="140" cy="18" r="9" fill="none" stroke={T.cobalt600} strokeOpacity="0.3" />
    </svg>
  );
}

// =========================================================
//  SYSTEMS THAT NEVER SPOKE — sticky scroll swap
// =========================================================
function SystemsThatNeverSpoke() {
  const ref = useRef(null);
  const progress = useSectionProgress(ref);
  const phase = Math.min(3, Math.floor(progress * 4));
  const phases = [
    { eyebrow: "Phase 01 · The old way", head: "POS doesn't talk to KDS.", body: "Orders fly in three different systems. Modifiers get lost. Speed of service slips at exactly the worst moment." },
    { eyebrow: "Phase 02 · The old way", head: "Loyalty doesn't talk to the data.", body: "Your guest profile is fragmented across app, web, kiosk, drive-thru. You can't personalize what you can't unify." },
    { eyebrow: "Phase 03 · The old way", head: "Reports come in tomorrow.", body: "By the time you spot the problem, the daypart's gone. The decision had to be made an hour ago." },
    { eyebrow: "Phase 04 · With Nova", head: "Until now.", body: "POS, KDS, ordering, loyalty, labor, reports — all on one data layer, in real time. The AI sees everything because everything is connected." },
  ];
  const p = phases[phase];
  return (
    <section ref={ref} data-section-theme="light" style={{ position: "relative", height: "380vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <SoftGlow color={phase === 3 ? T.matcha500 : T.persimmon400} position="top-right" opacity={phase === 3 ? 0.12 : 0.2} />
        <Container>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 80, alignItems: "center", position: "relative", zIndex: 1 }}>
            <div>
              <SectionLabel label="The disconnect problem" />
              {/*
                Inherit color from the page wrapper so the headline stays
                readable during the dark→light transition. When the wrapper is
                still dark (#000026, just exited AI section), `currentColor`
                resolves to #FAFAFB (whisper); as the wrapper bg fades to
                canvas the same `currentColor` interpolates down to ink. No
                invisible-flash window.
              */}
              <Heading size={64} color="currentColor" style={{ marginBottom: 24 }}>
                {phase === 3 ? (<>Until <span style={{ color: T.persimmon600 }}>now</span>.</>) : p.head}
              </Heading>
              <Body size={18} color="currentColor" style={{ maxWidth: 480, opacity: 0.7 }}>{p.body}</Body>
              {phase === 3 && (
                <div style={{ marginTop: 32 }}>
                  <FlowCTA>See the platform</FlowCTA>
                </div>
              )}
            </div>
            <SystemsGraphic phase={phase} />
          </div>
        </Container>
      </div>
    </section>
  );
}

function SystemsGraphic({ phase }) {
  const systems = [
    { label: "POS",      x: 80,  y: 80 },
    { label: "KDS",      x: 320, y: 70 },
    { label: "Loyalty",  x: 60,  y: 220 },
    { label: "Orders",   x: 340, y: 220 },
    { label: "Reports",  x: 80,  y: 360 },
    { label: "Labor",    x: 320, y: 360 },
  ];
  const connected = phase === 3;
  return (
    <div style={{ position: "relative", aspectRatio: "1/1", maxWidth: 520 }}>
      <PlaceholderTag>{connected ? "Connected" : "Disconnected"} · placeholder</PlaceholderTag>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: connected
            ? `radial-gradient(circle at center, ${T.matcha500}18 0%, transparent 70%)`
            : `radial-gradient(circle at center, ${T.persimmon300}18 0%, transparent 70%)`,
          transition: "background 600ms ease",
          borderRadius: "50%",
        }}
      />
      <svg viewBox="0 0 420 440" style={{ position: "relative", width: "100%", height: "100%" }}>
        <defs>
          <radialGradient id="sys-hub" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={T.persimmon600} />
            <stop offset="100%" stopColor={T.persimmon500} />
          </radialGradient>
        </defs>
        {systems.map((s, i) => (
          <line
            key={`ln-${i}`}
            x1={s.x}
            y1={s.y}
            x2="210"
            y2="220"
            stroke={connected ? T.persimmon600 : T.hairline}
            strokeOpacity={connected ? 0.7 : 0}
            strokeWidth={connected ? 1.6 : 1}
            strokeDasharray={connected ? "0" : "3 5"}
            style={{ transition: "all 800ms cubic-bezier(0.2,0,0,1)" }}
          />
        ))}
        <g style={{ opacity: connected ? 1 : 0.35, transition: "opacity 600ms ease" }}>
          <circle cx="210" cy="220" r="58" fill="url(#sys-hub)" />
          <text x="210" y="227" textAnchor="middle" fontSize="20" fontWeight="700" fill={T.whisper} fontFamily={FONT_DISPLAY} letterSpacing="-0.04em">
            nova
          </text>
        </g>
        {systems.map((s) => {
          const isolated = !connected;
          return (
            <g key={s.label} style={{ transition: "all 700ms cubic-bezier(0.2,0,0,1)" }}>
              <circle
                cx={s.x}
                cy={s.y}
                r="30"
                fill={T.surface}
                stroke={isolated ? T.hairline : T.persimmon100}
                strokeWidth="1.5"
                style={{ filter: isolated ? "grayscale(0.4)" : "none", transition: "filter 600ms ease" }}
              />
              <text x={s.x} y={s.y + 4} textAnchor="middle" fontSize="11" fontWeight="600" fill={isolated ? T.placeholder : T.ink} fontFamily={FONT_BODY}>
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// =========================================================
//  SEGMENTER — 4 format cards, all visible, scaling hover
// =========================================================
function Segmenter() {
  // Four format cards. Each card: photographic-feel image at top (rounded with
  // the card), bold title beneath, body subtext, and a persimmon CTA. Card
  // order matches the spec: QSR → Full service → Cafés → Enterprise.
  const formats = [
    {
      id: "qsr",
      title: "Quick service & drive-thru",
      body: "Voice AI takes drive-thru orders. Vision AI watches the lane. POS and KDS sub-second synchronized.",
      cta: "Quick service on Nova",
      bg: "linear-gradient(140deg, #2A1410 0%, #6B2A1E 45%, #C24A28 100%)",
      visual: "speed",
    },
    {
      id: "full-service",
      title: "Full service & fine dining",
      body: "Handhelds at every station. Floor management that learns your covers. Guest history in one tap.",
      cta: "Full service on Nova",
      bg: "linear-gradient(155deg, #1F1410 0%, #4A2620 45%, #8C4938 100%)",
      visual: "floor",
    },
    {
      id: "cafe",
      title: "Cafes, bars & bakeries",
      body: "Open in days. Update menus on the fly. The same AI-native platform the enterprise customers run.",
      cta: "Cafes & bars on Nova",
      bg: "linear-gradient(150deg, #14202A 0%, #2C4150 50%, #4E6E80 100%)",
      visual: "warmth",
    },
    {
      id: "enterprise",
      title: "Multi-brand & enterprise",
      body: "Multi-brand, multi-location from day one. Single source of truth across every store. Land & expand GTM.",
      cta: "Enterprise on Nova",
      bg: "linear-gradient(135deg, #2B1C0F 0%, #6B4521 50%, #C4862F 100%)",
      visual: "grid",
    },
  ];
  return (
    <section data-section-theme="light" style={{ padding: "120px 0", position: "relative" }}>
      <Container>
        {/* Eyebrow + centered headline + centered body — matches the spec. */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <SectionLabel label="Built for your format" />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <Heading size={52} color="currentColor" style={{ marginBottom: 20, maxWidth: 980, marginLeft: "auto", marginRight: "auto" }}>
              Whatever your restaurant looks like, Nova runs on it.
            </Heading>
          </Reveal>
          <Reveal delay={160}>
            <Body color="currentColor" style={{ maxWidth: 760, margin: "0 auto", opacity: 0.7 }}>
              From a single-location new opening to a 680-location enterprise — Nova adapts to where you are and where you&apos;re growing. Find your format and see how operators like you run on Nova.
            </Body>
          </Reveal>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {formats.map((f, i) => (
            <Reveal key={f.id} delay={i * 90}>
              <FormatCard {...f} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

// =========================================================
// FORMAT VISUAL — code-generated branded artwork per format.
// Each treatment is tuned to the format archetype:
//   grid    → enterprise · structured location lattice
//   speed   → QSR · motion lines + drive-thru velocity
//   warmth  → café · radial bloom + soft texture
//   floor   → fine dining · refined arc + lighting
// All visuals are baked into the card's gradient background.
// =========================================================
function FormatVisual({ kind }) {
  if (kind === "grid") {
    return (
      <svg viewBox="0 0 240 300" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: "block" }}>
        <defs>
          <radialGradient id="grid-bloom" cx="70%" cy="20%" r="80%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        {/* Lattice of location dots */}
        {Array.from({ length: 9 }).map((_, r) =>
          Array.from({ length: 7 }).map((__, c) => {
            const x = 30 + c * 30;
            const y = 50 + r * 28;
            const isAnchor = (r + c) % 3 === 0;
            return (
              <circle
                key={`${r}-${c}`}
                cx={x}
                cy={y}
                r={isAnchor ? 3.5 : 1.6}
                fill={isAnchor ? "#FFFFFF" : "rgba(255,255,255,0.45)"}
              />
            );
          })
        )}
        <rect x="0" y="0" width="240" height="300" fill="url(#grid-bloom)" />
      </svg>
    );
  }
  if (kind === "speed") {
    return (
      <svg viewBox="0 0 240 300" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: "block" }}>
        <defs>
          <linearGradient id="speed-streak" x1="0%" x2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {Array.from({ length: 16 }).map((_, i) => {
          const y = i * 18 - 10;
          const w = 60 + ((i * 37) % 140);
          const x = -20 + ((i * 53) % 120);
          const opacity = 0.18 + ((i * 11) % 60) / 100;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={w}
              height={2}
              rx={1}
              fill="url(#speed-streak)"
              opacity={opacity}
            />
          );
        })}
      </svg>
    );
  }
  if (kind === "warmth") {
    return (
      <svg viewBox="0 0 240 300" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: "block" }}>
        <defs>
          <radialGradient id="warm-bloom" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor="rgba(255,247,221,0.85)" />
            <stop offset="55%" stopColor="rgba(255,200,120,0.25)" />
            <stop offset="100%" stopColor="rgba(255,200,120,0)" />
          </radialGradient>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.08 0" />
          </filter>
        </defs>
        <circle cx="120" cy="125" r="120" fill="url(#warm-bloom)" />
        <rect x="0" y="0" width="240" height="300" filter="url(#grain)" opacity="0.6" />
      </svg>
    );
  }
  // floor
  return (
    <svg viewBox="0 0 240 300" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: "block" }}>
      <defs>
        <radialGradient id="floor-light" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      {Array.from({ length: 9 }).map((_, i) => {
        const r = 40 + i * 22;
        return (
          <circle
            key={i}
            cx="60"
            cy="80"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={0.6}
          />
        );
      })}
      <rect x="0" y="0" width="240" height="300" fill="url(#floor-light)" />
    </svg>
  );
}

function FormatCard({ title, body, cta, bg, visual }) {
  // Unified card frame: image bleeds to the top edges, bold title +
  // descriptive body + persimmon linked CTA stacked below inside the same
  // rounded white surface. No overlay text on the image, no per-format
  // accent color — every CTA is persimmon per the design.
  return (
    <article
      style={{
        position: "relative",
        background: T.surface,
        border: `1px solid ${T.hairline}`,
        borderRadius: 22,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "transform 320ms cubic-bezier(0.2,0,0,1), box-shadow 320ms ease, border-color 320ms ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 28px 56px -28px rgba(20,17,15,0.22)";
        e.currentTarget.style.borderColor = T.divider;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = T.hairline;
      }}
    >
      {/* IMAGE — top of card, bleeds to edges, atmospheric branded artwork. */}
      <div
        style={{
          position: "relative",
          aspectRatio: "4/3.6",
          background: bg,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          <FormatVisual kind={visual} />
        </div>
      </div>
      {/* TEXT BLOCK — bold title, body, persimmon CTA. */}
      <div style={{ padding: "26px 24px 28px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: T.ink,
            lineHeight: 1.25,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 14.5, color: T.inkMuted, lineHeight: 1.55, flex: 1 }}>
          {body}
        </div>
        <a
          href="#"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13.5,
            fontWeight: 600,
            letterSpacing: "-0.005em",
            color: T.persimmon600,
            textDecoration: "none",
            marginTop: 4,
            transition: "gap 220ms ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.gap = "10px")}
          onMouseLeave={(e) => (e.currentTarget.style.gap = "6px")}
        >
          {cta}
          <ArrowRight size={14} strokeWidth={2.2} />
        </a>
      </div>
    </article>
  );
}

// =========================================================
//  HOW IT WORKS — Ramp-style sticky scroll
//  Title + subtext + visual update as user scrolls through.
//  Outer wrapper is tall; inner viewport stays sticky.
// =========================================================
function HowItWorks() {
  const ref = useRef(null);
  const progress = useSectionProgress(ref);
  const steps = [
    {
      kicker: "Step 01 · Connect",
      title: "Launch in days, not quarters.",
      body: "Plug Nova into your existing infrastructure — digital ordering, mobile, loyalty, and analytics go live before your next pre-shift. Zero rip-and-replace required to start.",
      accent: T.persimmon500,
    },
    {
      kicker: "Step 02 · Unify",
      title: "Every channel, one data layer.",
      body: "POS, kiosk, drive-thru, app, and online ordering converge into a single guest profile, a single inventory, a single source of truth. The end of duct-taped integrations.",
      accent: T.cobalt500,
    },
    {
      kicker: "Step 03 · Improve",
      title: "AI runs the room with you.",
      body: "Reporting AI surfaces opportunities. Voice AI catches every missed call. Manager Copilot answers in plain English. Every shift, the platform learns from the last one.",
      accent: T.nebula500,
    },
  ];
  const stepIndex = Math.min(steps.length - 1, Math.floor(progress * steps.length));
  const step = steps[stepIndex];

  return (
    // Light-themed section. The chrome (section label, stepper, kicker) is
    // stripped per spec — only title + descriptive body + visual remain. The
    // wrapper stays light through HowItWorks; dark mode kicks in once the
    // FinalCTA (Book a demo) enters the viewport.
    <section ref={ref} data-section-theme="light" style={{ position: "relative", height: "340vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <SoftGlow color={step.accent} position="top-right" opacity={0.10} />
        <SoftGlow color={T.cobalt500} position="bottom-left" opacity={0.06} />
        <Container style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
          {/* TOP: title + body only — centered. No section label, stepper, or kicker. */}
          <div style={{ paddingTop: 96, paddingBottom: 24, textAlign: "center", flexShrink: 0 }}>
            <div
              key={`title-${stepIndex}`}
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 48,
                lineHeight: 1.08,
                letterSpacing: "-0.035em",
                fontWeight: 500,
                color: "currentColor",
                // 48px top margin separates the title from the floating header
                marginTop: 48,
                marginBottom: 14,
                maxWidth: 880,
                marginLeft: "auto",
                marginRight: "auto",
                animation: "step-fade 600ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {step.title}
            </div>
            <div
              key={`body-${stepIndex}`}
              style={{
                fontFamily: FONT_BODY,
                fontSize: 16,
                lineHeight: 1.55,
                color: "currentColor",
                opacity: 0.7,
                maxWidth: 620,
                margin: "0 auto",
                marginBottom: 48,
                animation: "step-fade 700ms cubic-bezier(0.22, 1, 0.36, 1) 80ms both",
              }}
            >
              {step.body}
            </div>
          </div>

          {/* BOTTOM: visual fills remaining vertical space */}
          <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 40, minHeight: 0 }}>
            <HowVisual step={stepIndex} accent={step.accent} />
          </div>
        </Container>
      </div>
    </section>
  );
}

function HowVisual({ step, accent }) {
  return (
    <div
      key={`viz-${step}`}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 960,
        aspectRatio: "16/10",
        maxHeight: "100%",
        margin: "0 auto",
        animation: "step-fade 700ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <PlaceholderTag>Lottie · step {String(step + 1).padStart(2, "0")}</PlaceholderTag>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: -30,
          background: `radial-gradient(circle at 60% 40%, ${accent}55, transparent 65%), radial-gradient(circle at 30% 70%, ${T.persimmon500}33, transparent 60%)`,
          filter: "blur(40px)",
          transition: "background 600ms ease",
        }}
      />
      {/* Dark product-preview card floating on the light section. Solid dark
          ramp (#171721 with a hair-thin border) so the UI mock reads as a
          screenshot of the Nova product, lifted off the page by a soft shadow. */}
      <div
        style={{
          position: "relative",
          height: "100%",
          background: "#171721",
          border: "1px solid #2A2A35",
          borderRadius: 24,
          padding: 36,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          overflow: "hidden",
          boxShadow:
            "0 24px 60px -28px rgba(20,17,15,0.28), 0 6px 18px -10px rgba(20,17,15,0.18)",
        }}
      >
        {/* Step-specific product UI mock */}
        {step === 0 && <ConnectViz accent={accent} />}
        {step === 1 && <UnifyViz accent={accent} />}
        {step === 2 && <ImproveViz accent={accent} />}
      </div>
    </div>
  );
}

function ConnectViz({ accent }) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: T.whisperSoft }}>
          Launch console
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: T.matcha500, fontWeight: 500 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: T.matcha500 }} /> Live in 3 days
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { label: "Digital ordering", on: true },
          { label: "Mobile app",       on: true },
          { label: "Loyalty",          on: true },
          { label: "Analytics",        on: true },
        ].map((m) => (
          <div key={m.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: T.matcha500, boxShadow: `0 0 12px ${T.matcha500}` }} />
            <span style={{ fontSize: 13, color: T.whisper, fontWeight: 500 }}>{m.label}</span>
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 16, marginTop: "auto" }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: T.whisperSoft, marginBottom: 6 }}>
          Time to first order
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 38, fontWeight: 500, letterSpacing: "-0.035em", color: accent, lineHeight: 1 }}>
            3 days
          </span>
          <span style={{ fontSize: 12, color: T.whisperSoft }}>vs 6-12 weeks legacy</span>
        </div>
      </div>
    </>
  );
}

function UnifyViz({ accent }) {
  const channels = ["POS", "Kiosk", "Drive-thru", "App", "Online", "Loyalty"];
  return (
    <>
      <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: T.whisperSoft }}>
        Unified data layer
      </div>
      <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg viewBox="0 0 360 280" width="100%" height="100%">
          <defs>
            <radialGradient id="unify-hub" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={accent} />
              <stop offset="100%" stopColor={accent} stopOpacity="0.6" />
            </radialGradient>
          </defs>
          {channels.map((c, i) => {
            const angle = (i / channels.length) * Math.PI * 2 - Math.PI / 2;
            const x = 180 + Math.cos(angle) * 110;
            const y = 140 + Math.sin(angle) * 90;
            return (
              <g key={c}>
                <line x1={x} y1={y} x2="180" y2="140" stroke={accent} strokeOpacity="0.45" strokeWidth="1.2" />
                <rect x={x - 36} y={y - 14} width="72" height="28" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" />
                <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="600" fill={T.whisper} fontFamily={FONT_BODY}>{c}</text>
              </g>
            );
          })}
          <circle cx="180" cy="140" r="34" fill="url(#unify-hub)" />
          <text x="180" y="145" textAnchor="middle" fontSize="14" fontWeight="700" fill={T.whisper} fontFamily={FONT_DISPLAY} letterSpacing="-0.04em">nova</text>
        </svg>
      </div>
    </>
  );
}

function ImproveViz({ accent }) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: T.whisperSoft }}>
          AI insights · live
        </div>
        <div style={{ fontSize: 11, color: T.matcha500, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: T.matcha500 }} /> Learning
        </div>
      </div>
      <div style={{ flex: 1, position: "relative" }}>
        <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="imp-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity="0.4" />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 160 C 50 140, 90 110, 140 100 S 230 60, 280 50 L 400 30 L 400 200 L 0 200 Z" fill="url(#imp-fill)" />
          <path d="M0 160 C 50 140, 90 110, 140 100 S 230 60, 280 50 L 400 30" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="280" cy="50" r="5" fill={accent} />
          <circle cx="280" cy="50" r="12" fill="none" stroke={accent} strokeOpacity="0.4" />
        </svg>
      </div>
      <div style={{ background: `${accent}1F`, border: `1px solid ${accent}40`, borderRadius: 12, padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ width: 28, height: 28, borderRadius: 999, background: accent, display: "flex", alignItems: "center", justifyContent: "center", color: T.midnight, flexShrink: 0 }}>
          <Sparkles size={14} strokeWidth={2.2} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.whisper, marginBottom: 2 }}>+18% sales · dessert cart at Bayou Bistro</div>
          <div style={{ fontSize: 12, color: T.whisperSoft, lineHeight: 1.45 }}>One AI insight, $25K in incremental monthly revenue.</div>
        </div>
      </div>
    </>
  );
}

// =========================================================
//  CUSTOMER OUTCOMES — Attio-style expandable panels
//  Three horizontal panels, one expanded at a time. Default = first.
//  Hover expands the hovered column and collapses the others.
// =========================================================
function CustomerOutcomes() {
  const [expanded, setExpanded] = useState(0);
  const cards = [
    {
      brand: "TRAM",
      kicker: "Enterprise · 400 locations",
      headline: "7+ vendors collapsed into one",
      quote: "One guest profile that follows every touchpoint. We finally have a single loyalty balance across app, web, kiosk and POS.",
      who: "VP of IT",
      role: "Enterprise chain customer",
      photoBg: `linear-gradient(135deg, #1a2a35 0%, #2d4250 50%, #3a4f5e 100%)`,
      photoAlt: "Modern enterprise restaurant interior at golden hour",
      features: ["Modern POS", "Loyalty", "Reporting AI"],
    },
    {
      brand: "HYBRID",
      kicker: "Enterprise · 680 locations",
      headline: "11 contracts down to 1",
      quote: "Cheetah, Olo, Sparkfly, Dayforce, Sage Intacct, Power BI — all replaced. Unified inventory, labor and financials in one layer.",
      who: "Director of Operations",
      role: "Multi-brand enterprise",
      photoBg: `linear-gradient(135deg, #2a1a1f 0%, #4a2932 50%, #6a3c44 100%)`,
      photoAlt: "Fine dining table at a multi-brand enterprise location",
      features: ["Inventory", "Workforce", "Manager Copilot"],
    },
    {
      brand: "Bayou Bistro",
      kicker: "Emerging brand · 1 → 12 locations",
      headline: "+18% sales from one AI insight",
      quote: "Reporting showed us a dessert cart was better than a menu. That gave us an 18% increase in sales and $25,000 more in revenue.",
      who: "Oliver Lauche",
      role: "CEO, Bayou Bistro",
      photoBg: `linear-gradient(135deg, #3d6b7c 0%, #5a8595 50%, #7a9eaa 100%)`,
      photoAlt: "Bayou Bistro waterfront dining at sunset",
      features: ["Reporting AI", "Mobile app", "Loyalty"],
    },
  ];
  return (
    <section data-section-theme="light" style={{ padding: "120px 0", position: "relative" }}>
      <SoftGlow color={T.persimmon400} position="top-right" opacity={0.10} />
      <Container>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <SectionLabel label="Customer outcomes" color={T.matcha600} />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <Heading size={56} color="currentColor" style={{ marginBottom: 20 }}>
              What operators see in the
              <br />
              <span style={{ color: T.persimmon600 }}>first 90 days</span>.
            </Heading>
          </Reveal>
          <Reveal delay={160}>
            <Body color="currentColor" style={{ maxWidth: 680, margin: "0 auto", opacity: 0.7 }}>
              From enterprise chains consolidating eleven contracts to emerging brands launching their first AI-native location.
            </Body>
          </Reveal>
        </div>

        {/* Three expandable panels — flex; expanded grows, others stay at fixed compact width */}
        <Reveal>
          <div style={{ display: "flex", gap: 16, height: 560, alignItems: "stretch" }}>
            {cards.map((c, i) => {
              const isExpanded = expanded === i;
              return (
                <OutcomePanel
                  key={c.headline}
                  card={c}
                  expanded={isExpanded}
                  onActivate={() => setExpanded(i)}
                />
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function OutcomePanel({ card, expanded, onActivate }) {
  const { brand, kicker, headline, quote, who, role, photoBg, photoAlt, features } = card;
  // Click-to-expand (replaces previous hover). Enter/Space activate via
  // keyboard for accessibility. Expansion uses a spring-like cubic-bezier
  // (slight overshoot then settle) for a tactile "snap into place" feel.
  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onActivate();
    }
  };
  return (
    <article
      className="outcome-panel"
      onClick={onActivate}
      onKeyDown={handleKey}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      aria-label={`Customer outcome: ${headline}`}
      style={{
        // Expanded grows to fill remaining space; collapsed stays at 240px
        flex: expanded ? "1 1 auto" : "0 0 240px",
        minWidth: 240,
        background: T.surface,
        // Border defaults to T.hairline (light mode); CSS `.outcome-panel`
        // rule swaps it to a lighter midnight gray when wrapper is dark.
        border: `1px solid ${expanded ? T.divider : T.hairline}`,
        borderRadius: 28,
        overflow: "hidden",
        display: "flex",
        cursor: "pointer",
        transition:
          // Spring-like overshoot for flex (width) + smooth ease-out for the
          // visual chrome. Matches the wrapper's 900ms theme fade timing for
          // border so the border color swaps in lockstep with the theme.
          "flex 720ms cubic-bezier(0.34, 1.56, 0.64, 1), " +
          "border-color 900ms cubic-bezier(0.4, 0, 0.2, 1), " +
          "box-shadow 420ms cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: expanded
          ? "0 1px 0 rgba(20,17,15,0.02), 0 32px 64px -32px rgba(20,17,15,0.20)"
          : "0 1px 0 rgba(20,17,15,0.02), 0 4px 12px -8px rgba(20,17,15,0.08)",
        outline: "none",
      }}
    >
      {/* Image (fixed width regardless of state) */}
      <div
        role="img"
        aria-label={photoAlt}
        style={{
          position: "relative",
          flexShrink: 0,
          width: 240,
          height: "100%",
          background: photoBg,
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 30% 80%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,0,0,0.34), transparent 60%)",
          }}
        />
        {/* Photo placeholder badge */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            fontFamily: FONT_MONO,
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.80)",
            background: "rgba(20,17,15,0.42)",
            backdropFilter: "blur(8px)",
            padding: "5px 10px",
            borderRadius: 999,
          }}
        >
          Photo placeholder
        </div>
        {/* Brand label at bottom — always visible, even when collapsed */}
        <div
          style={{
            position: "absolute",
            bottom: 18,
            left: 18,
            right: 18,
            fontFamily: FONT_DISPLAY,
            fontWeight: 500,
            fontSize: 20,
            letterSpacing: "-0.02em",
            color: "#fff",
            textShadow: "0 2px 12px rgba(0,0,0,0.45)",
          }}
        >
          {brand}
        </div>
      </div>

      {/* Content — only visible/active when expanded */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: "32px 36px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          opacity: expanded ? 1 : 0,
          transition: expanded
            ? "opacity 480ms ease 220ms"
            : "opacity 200ms ease",
          pointerEvents: expanded ? "auto" : "none",
        }}
      >
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: T.matcha600,
            fontWeight: 500,
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 30,
            fontWeight: 500,
            letterSpacing: "-0.025em",
            color: T.ink,
            lineHeight: 1.15,
          }}
        >
          {headline}
        </div>
        <blockquote
          style={{
            margin: 0,
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            fontSize: 17,
            color: T.inkMuted,
            lineHeight: 1.55,
            letterSpacing: "-0.005em",
            flex: 1,
          }}
        >
          &ldquo;{quote}&rdquo;
        </blockquote>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: T.ink, letterSpacing: "-0.005em" }}>{who}</div>
          <div style={{ fontSize: 13, color: T.inkSoft }}>{role}</div>
        </div>
        {/* Favorite features footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            paddingTop: 18,
            marginTop: 6,
            borderTop: `1px solid ${T.hairline}`,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: T.inkSoft,
              whiteSpace: "nowrap",
            }}
          >
            {brand}'s favorite features
          </span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {features.map((f) => (
              <span
                key={f}
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: T.inkMuted,
                  background: T.mist,
                  padding: "5px 10px",
                  borderRadius: 999,
                  letterSpacing: "-0.005em",
                  whiteSpace: "nowrap",
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

// =========================================================
//  FINAL CTA
// =========================================================
function FinalCTA() {
  return (
    <section data-section-theme="dark" style={{ color: T.whisper, padding: "120px 0", position: "relative", overflow: "hidden" }}>
      <SoftGlow color={T.persimmon500} position="top-right" opacity={0.30} />
      <SoftGlow color={T.nebula600} position="bottom-left" opacity={0.20} />
      <Container narrow>
        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: T.persimmon500, fontWeight: 500, marginBottom: 32 }}>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 999, background: T.persimmon500, marginRight: 12, verticalAlign: "middle" }} />
              Book a demo
            </div>
          </Reveal>
          <Reveal delay={80}>
            <Display size={88} color={T.whisper}>
              The new front of <span style={{ color: T.persimmon500 }}>house</span>.
            </Display>
          </Reveal>
          <Reveal delay={160}>
            <Body color={T.whisperSoft} size={19} style={{ maxWidth: 560, margin: "32px auto 0" }}>
              See how modern restaurant operations run on Nova. We&apos;ll show you the product, then your stack.
            </Body>
          </Reveal>
          <Reveal delay={240}>
            <div style={{ marginTop: 44, display: "flex", gap: 12, justifyContent: "center" }}>
              <FlowCTA onDark>Book a demo</FlowCTA>
              <Button variant="invertGhost">Talk to sales</Button>
            </div>
          </Reveal>
          <div style={{ marginTop: 72, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
            {["PCI DSS", "EMV", "SOC 2", "Responsible AI"].map((t) => (
              <span key={t} style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: T.whisperSoft }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

// =========================================================
//  FOOTER
// =========================================================
function Footer() {
  // Hairline tuned to the #171721 dark canvas — one step up the same warmer
  // near-black ramp. Lets the FinalCTA's dark continue through the footer
  // with low-contrast structural dividers.
  const darkHairline = "#2A2A35";
  const cols = [
    { head: "Platform",  items: ["Overview", "AI at the core", "Hardware", "Pricing"] },
    { head: "AI",        items: ["AI overview", "Voice AI", "Vision AI", "Reporting AI", "Manager Copilot", "AI Upsell"] },
    { head: "Solutions", items: ["Modern POS", "Online ordering", "Mobile app", "Loyalty", "Kitchen display", "Handhelds"] },
    { head: "Customers", items: ["All customers", "Enterprise stories", "Bayou Bistro", "KK's Hot Chicken"] },
    { head: "Company",   items: ["About", "Team", "Investors", "Trust", "Contact"] },
  ];
  return (
    <footer
      data-section-theme="dark"
      style={{
        color: T.whisper,
        padding: "64px 0 40px",
        borderTop: `1px solid ${darkHairline}`,
      }}
    >
      <Container>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <LogoMark size={32} />
            </div>
            <div style={{ fontSize: 13, color: T.whisperSoft, maxWidth: 280 }}>
              The unified AI-native platform for restaurant operations.
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="primary">Book a demo</Button>
            <Button variant="invertGhost">Sign in</Button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 32, paddingTop: 32, borderTop: `1px solid ${darkHairline}` }}>
          {cols.map((c) => (
            <div key={c.head}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: T.whisperSoft, fontWeight: 500, marginBottom: 16 }}>
                {c.head}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {c.items.map((it) => (
                  <li key={it}>
                    <a
                      href="#"
                      style={{ fontSize: 13, color: T.whisperSoft, textDecoration: "none", letterSpacing: "-0.005em", transition: "color 180ms ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = T.whisper)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = T.whisperSoft)}
                    >
                      {it}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${darkHairline}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontSize: 12, color: T.whisperSoft }}>
            © 2026 Nova Platform Inc. · Built on Hearth · v0.1
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy", "Terms", "Cookies", "Security"].map((l) => (
              <a key={l} href="#" style={{ fontSize: 12, color: T.whisperSoft, textDecoration: "none" }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
