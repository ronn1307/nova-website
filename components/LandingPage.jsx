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
import LottiePlayer from "./LottiePlayer";
import DotLottiePlayer from "./DotLottiePlayer";
import NovaDotfield from "./NovaDotfield";

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

function Button({ children, variant = "primary", onClick, style, arrow = false, lottieSrc }) {
  // Base layout/typography — works at every size. Padding + font-size are
  // overridable via the `style` prop on the call-site (Nav scrolled state
  // passes 8/16 + fontSize 14 → sm; default = md scale).
  //
  // When `lottieSrc` is passed, the children stay in their normal layout
  // position but the Lottie is overlaid as an absolute layer covering the
  // entire button (inset:0). Mirrors the FlowCTA pattern so Nav + Footer
  // "Book a demo" buttons can host the arrowless Lottie superimposed on
  // top of their static label. Button gets position:relative +
  // overflow:hidden so the absolute layer is clipped to the pill.
  const base = {
    fontFamily: FONT_BODY,
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: 500,
    letterSpacing: "-0.005em",
    padding: "10px 20px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    position: "relative",
    overflow: "hidden",
  };
  // Variant-specific inline styles. Note: `primary` keeps `color: #FFFFFF`
  // here but bg/box-shadow live in `.btn-gradient-primary` CSS so the
  // SpiceKit gradient + hover/active/focus states are applied uniformly.
  const variants = {
    primary: {
      color: "#FFFFFF",
    },
    secondary: {
      background: T.mist,
      color: T.ink,
      boxShadow: "0 0 0 1px rgba(20,17,15,0.06) inset",
      transition: "all 200ms cubic-bezier(0.2, 0, 0, 1)",
    },
    ghost: {
      background: "transparent",
      color: T.ink,
      boxShadow: "0 0 0 1px rgba(20,17,15,0.18) inset",
      transition: "all 200ms cubic-bezier(0.2, 0, 0, 1)",
    },
    invertGhost: {
      background: "rgba(255,255,255,0.04)",
      color: T.whisper,
      boxShadow: "0 0 0 1px rgba(255,255,255,0.18) inset",
      transition: "all 200ms cubic-bezier(0.2, 0, 0, 1)",
    },
  };
  const className = variant === "primary" ? "btn-gradient-primary" : undefined;
  return (
    <button
      onClick={onClick}
      className={className}
      style={{ ...base, ...variants[variant], ...style }}
    >
      <span style={{ position: "relative", zIndex: 2, display: "inline-flex", alignItems: "center", gap: 8 }}>
        {children}
        {arrow && <ArrowRight size={16} strokeWidth={2} />}
      </span>
      {lottieSrc && (
        <LottiePlayer
          src={lottieSrc}
          loop
          autoplay
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />
      )}
    </button>
  );
}

function SectionLabel({ label, color = T.persimmon600, marginBottom = 28 }) {
  // Stripped of the leading dot — the label stands on its own. Weight bumped
  // one step (500 → 600) so the label reads with more authority alongside
  // the now-uniform Inter type system. `marginBottom` is overridable so
  // individual sections can tighten the label→headline gap without forking
  // the component.
  return (
    <div style={{ display: "inline-flex", alignItems: "center", marginBottom }}>
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
//  SHARED REVEAL TIMING
//  Single source of truth for duration + easing so every reveal in the
//  page moves in lockstep. Change here, the whole site re-tunes.
// =========================================================
const REVEAL_DURATION = 800;
const REVEAL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
// Stagger budget for grids: per-child delay × number of children should
// stay under this to keep the cascade snappy. We clamp inside StaggerGroup.
const STAGGER_BUDGET_MS = 480;

// =========================================================
//  PREFERS-REDUCED-MOTION
//  Honours the user's OS-level "reduce motion" setting. When true, every
//  reveal component renders at its visible end-state with zero transition
//  duration so nothing animates. Initial value tracks SSR safely.
// =========================================================
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

// =========================================================
//  SCROLL REVEAL — the universal primitive
//  Bidirectional fade + lift driven by IntersectionObserver. Use this for
//  90% of content: section labels, body copy, descriptions, diagrams,
//  any block that doesn't need a mask curtain.
//
//    - Enters viewport → fade 0→1, translateY(lift)→0 over REVEAL_DURATION
//    - Leaves viewport → fade 1→0, translateY(0)→translateY(lift) same
//    - prefers-reduced-motion → instant final state, no transition
// =========================================================
function ScrollReveal({
  children,
  delay = 0,
  duration = REVEAL_DURATION,
  threshold = 0.12,
  rootMargin = "0px 0px -8% 0px",
  lift = 24,
  as: Tag = "div",
  style,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold, rootMargin }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin, reduced]);

  const transition = reduced
    ? "none"
    : `opacity ${duration}ms ${REVEAL_EASE} ${delay}ms,
       transform ${duration}ms ${REVEAL_EASE} ${delay}ms`;

  return (
    <Tag
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${lift}px)`,
        transition,
        willChange: reduced ? "auto" : "opacity, transform",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

// =========================================================
//  STAGGER GROUP — cascading reveals for grids/lists
//  Wraps a list of children and applies an incremental delay per child via
//  React.cloneElement. Children should be reveal components that accept a
//  `delay` prop (ScrollReveal, BiMaskReveal, FadeReveal). The per-item
//  delay is clamped so even big grids don't drag out.
//
//  Usage:
//    <StaggerGroup>
//      {cards.map(c => <ScrollReveal key={c.id}>{c.content}</ScrollReveal>)}
//    </StaggerGroup>
// =========================================================
function StaggerGroup({ children, perItemDelay = 80, baseDelay = 0, as: Tag = "div", style }) {
  const items = React.Children.toArray(children);
  // Cap the per-item delay so very large grids don't push the last item
  // past the stagger budget.
  const safeDelay = items.length > 1
    ? Math.min(perItemDelay, STAGGER_BUDGET_MS / Math.max(items.length - 1, 1))
    : 0;
  return (
    <Tag style={style}>
      {items.map((child, i) => {
        if (!React.isValidElement(child)) return child;
        const childDelay = child.props?.delay ?? 0;
        return React.cloneElement(child, {
          delay: baseDelay + childDelay + Math.round(i * safeDelay),
        });
      })}
    </Tag>
  );
}

// =========================================================
//  REVEAL (legacy one-shot) — scroll-in mask + lift animation
//  Kept for backward compatibility with sections that haven't migrated to
//  ScrollReveal yet. New code should prefer ScrollReveal.
// =========================================================
function Reveal({ children, delay = 0, direction = "up", as: Tag = "div", style }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  // After the reveal transition finishes we drop clip-path entirely. The
  // clip-path inset(0 0 0 0) — even when fully open — still clips at the
  // element's bounds, which cuts CTA outer shadows / focus rings. Removing
  // the clip-path post-transition gives outer shadows room to render.
  const [revealDone, setRevealDone] = useState(false);

  useEffect(() => {
    // Failsafe: always show after 700ms regardless of observer state.
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

  // Once we've been seen, schedule clip-path removal after the longest
  // transition (clip-path 1000ms + delay + a small buffer).
  useEffect(() => {
    if (!seen) return;
    const t = setTimeout(() => setRevealDone(true), 1000 + delay + 50);
    return () => clearTimeout(t);
  }, [seen, delay]);

  const offset = direction === "down" ? "-28px" : direction === "none" ? "0" : "28px";
  const clipValue = revealDone
    ? "none"
    : seen
    ? "inset(0 0 0 0)"
    : "inset(0 0 100% 0)";

  return (
    <Tag
      ref={ref}
      style={{
        // Triple-layer reveal: opacity fade + translateY lift + clip-path mask
        // (bottom-up). After the transition completes, clip-path drops to
        // `none` so any outer shadows on contained CTAs can extend freely.
        opacity: seen ? 1 : 0,
        transform: seen ? "translateY(0)" : `translateY(${offset})`,
        clipPath: clipValue,
        WebkitClipPath: clipValue,
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
//  BIDIRECTIONAL MASK REVEAL
//  Bottom-up reveal when the element enters the viewport, top-down hide
//  when it leaves — the curtain follows the direction of scroll naturally.
//
//  Implementation: clip-path animates between
//    "inset(100% 0 0 0)"  (top edge clipped → nothing visible)
//    "inset(0 0 0 0)"     (no clip → fully visible)
//  Both directions share the same easing, so reveal & hide feel like
//  one symmetric motion.
//
//  Use `revealKey` to force a re-trigger when content changes mid-section
//  (e.g. phase advances in SystemsThatNeverSpoke / step changes in
//  HowItWorks). Passing a new key remounts the inner subtree and replays
//  the entry animation cleanly.
// =========================================================
function BiMaskReveal({
  children,
  delay = 0,
  // Longer duration + ease-out-expo so the curtain feels like it's
  // settling rather than snapping. The trailing tail of the curve does
  // the work — the dominant motion is in the first ~40% of the duration,
  // then the rest is a gentle slow-down.
  duration = 1000,
  threshold = 0.15,
  as: Tag = "div",
  style,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, reduced]);

  // Bottom-up reveal: top inset goes 100% → 0% (mask recedes upward).
  // Top-down hide:    top inset goes 0% → 100% (mask covers from the top).
  const clipValue = visible ? "inset(0 0 0 0)" : "inset(100% 0 0 0)";

  // Two-layer structure is *required*. IntersectionObserver's
  // intersectionRect respects clip-path on the observed element, so if we
  // put clip-path on the ref'd node it starts with 0 visible area, never
  // reports isIntersecting=true, and the reveal never fires. The outer Tag
  // stays unclipped (so the observer sees its real layout box); the inner
  // span carries the clip-path + opacity animation.
  return (
    <Tag
      ref={ref}
      style={{ display: "block", ...style }}
    >
      <span
        style={{
          display: "block",
          clipPath: clipValue,
          WebkitClipPath: clipValue,
          opacity: visible ? 1 : 0,
          // Ease-out-expo: long settle at the end. Opacity catches up at
          // ~75% of the clip duration so the text fades fully in slightly
          // ahead of the mask closing, removing any "ghosted edge" feel.
          transition: reduced
            ? "none"
            : `clip-path ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms,
               -webkit-clip-path ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms,
               opacity ${Math.round(duration * 0.75)}ms ${REVEAL_EASE} ${delay}ms`,
          willChange: reduced ? "auto" : "clip-path, opacity",
        }}
      >
        {children}
      </span>
    </Tag>
  );
}

// =========================================================
//  FADE REVEAL
//  Opacity + small lift only. No clip-path, no overflow:hidden — so
//  contained elements with outer shadows / 1px rings (FlowCTA in
//  particular) don't get clipped. Use this for buttons/CTAs while the
//  surrounding text uses BiMaskReveal.
// =========================================================
function FadeReveal({
  children,
  delay = 0,
  duration = REVEAL_DURATION,
  threshold = 0.15,
  lift = 16,
  as: Tag = "div",
  style,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, reduced]);

  return (
    <Tag
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${lift}px)`,
        transition: reduced
          ? "none"
          : `opacity ${duration}ms ${REVEAL_EASE} ${delay}ms,
             transform ${duration}ms ${REVEAL_EASE} ${delay}ms`,
        willChange: reduced ? "auto" : "opacity, transform",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

// =========================================================
//  PHASE TRANSITION — crossfade between content versions
//  When phaseKey changes, the outgoing layer fades to opacity 0 while a
//  fresh incoming layer (with its own BiMaskReveal animations inside)
//  mounts and reveals. They share the same absolute slot so they overlap
//  during the transition — replacing the harsh "old → blank → new" snap
//  with a soft handoff.
// =========================================================
function PhaseTransition({ phaseKey, duration = 700, children }) {
  const [layers, setLayers] = useState(() => [
    { id: 0, key: phaseKey, children },
  ]);
  const nextId = useRef(1);

  useEffect(() => {
    setLayers((prev) => {
      const latest = prev[prev.length - 1];
      if (latest.key === phaseKey) return prev;
      // Snapshot the OUTGOING layer's children at the moment of transition
      // so it keeps rendering its old content during fade-out.
      return [
        ...prev.map((l) => ({ ...l })),
        { id: nextId.current++, key: phaseKey, children },
      ];
    });

    const cleanup = setTimeout(() => {
      setLayers((prev) => (prev.length > 1 ? prev.slice(-1) : prev));
    }, duration + 120);
    return () => clearTimeout(cleanup);
  }, [phaseKey, duration]);

  return (
    <div style={{ position: "relative" }}>
      {layers.map((layer, i) => {
        const isLatest = i === layers.length - 1;
        return (
          <div
            key={layer.id}
            style={{
              position: isLatest ? "relative" : "absolute",
              top: 0,
              left: 0,
              right: 0,
              opacity: isLatest ? 1 : 0,
              transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
              pointerEvents: isLatest ? "auto" : "none",
            }}
          >
            {/* Latest layer uses the live `children` prop so any in-render
                updates (e.g. CTA hover state) flow through. Older layers
                keep their captured children for the fade-out. */}
            {isLatest ? children : layer.children}
          </div>
        );
      })}
    </div>
  );
}

// =========================================================
//  FLOW CTA — coral primary with rotating gradient glow edge
//  Animation lives in globals.css under .cta-flow
// =========================================================
function FlowCTA({ children, onDark = false, onClick, arrow = true, lottieSrc, style }) {
  // Maps to Figma Button/Primary/lg/Trailing — gradient bg + gradient stroke +
  // 1px outline shadow + 18px trailing icon. Padding is set in .cta-flow CSS.
  //
  // When `lottieSrc` is passed, the static ArrowRight is hidden and the
  // Lottie is overlaid as an ABSOLUTE LAYER covering the entire CTA
  // (inset:0, width:100%, height:100%). The Lottie's canvas was authored
  // at button-equivalent dimensions (147×48), so its transparent areas let
  // the gradient bg + label below show through while the animated trailing
  // element plays on top. Pointer events pass through to the button.
  return (
    <button
      onClick={onClick}
      className={`cta-flow${onDark ? " on-dark" : ""}`}
      style={style}
    >
      <span style={{ position: "relative", zIndex: 2, display: "inline-flex", alignItems: "center", gap: 8 }}>
        {children}
        {arrow && <ArrowRight size={18} strokeWidth={2} />}
      </span>
      {lottieSrc && (
        <LottiePlayer
          src={lottieSrc}
          loop
          autoplay
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />
      )}
    </button>
  );
}

// =========================================================
//  LOGO CAROUSEL — infinite marquee with edge fades (Stripe-pattern)
//  Edge fades are dual-layer (light + dark) and crossfade via opacity driven
//  by [data-theme] on the wrapper — so the fades blend correctly even mid
//  scroll-theme transition. No bgFade prop needed.
// =========================================================
function LogoCarousel() {
  // Brand list — Tram, SliceShabu, and LA's Hot Chicken now ship as proper
  // SVG logos (svgSrc); the rest still render as styled wordmark pills until
  // their logos land.
  const logos = [
    { name: "Tram Cream Coffee", color: T.persimmon600, svgSrc: "/brands/tram.svg",            svgHeight: 24 },
    { name: "HYBRID",            color: T.mb800 },
    { name: "SliceShabu",        color: T.ink,          svgSrc: "/brands/sliceshabu.svg",      svgHeight: 28 },
    { name: "LA's Hot Chicken",  color: T.persimmon600, svgSrc: "/brands/las-hot-chicken.svg", svgHeight: 32 },
    { name: "Butter",            color: T.matcha600 },
    { name: "Sofia's",           color: T.nebula600 },
    { name: "Bayou Bistro",      color: T.cobalt600 },
  ];
  // Duplicate the set so the marquee loops seamlessly at translateX(-50%)
  const items = [...logos, ...logos];
  return (
    <div style={{ position: "relative", overflow: "hidden", padding: "10px 0" }}>
      {/* Left edge — two layers crossfaded by [data-theme]. */}
      <div className="logo-fade logo-fade-left logo-fade-light" aria-hidden />
      <div className="logo-fade logo-fade-left logo-fade-dark"  aria-hidden />
      {/* Right edge — same pattern. */}
      <div className="logo-fade logo-fade-right logo-fade-light" aria-hidden />
      <div className="logo-fade logo-fade-right logo-fade-dark"  aria-hidden />
      {/* Per-item padding-right (56px) is owned by the .logo-marquee CSS so
          the duplicated track is exactly 2× the visible loop — no seam jump
          at translateX(-50%). See globals.css for the rationale. */}
      <div className="logo-marquee">
        {items.map((logo, i) => (
          <div
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 44,
              color: logo.color,
              fontSize: 16,
              lineHeight: "24px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
            aria-label={logo.name}
          >
            {logo.svgSrc ? (
              <img
                src={logo.svgSrc}
                alt={logo.name}
                style={{ height: 44, width: "auto", display: "block" }}
              />
            ) : (
              logo.name
            )}
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
  // Sync body bg to the current theme so the strip behind the wrapper
  // (e.g. where the hero's scaled lottie overflows past the wrapper's
  // right edge near the scrollbar) doesn't render the default light
  // canvas against a dark section. Css :has didn't take in this
  // codebase — set it imperatively here.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.backgroundColor = isDark ? "#171721" : T.canvas;
    document.body.style.transition =
      "background-color 900ms cubic-bezier(0.4, 0, 0.2, 1)";
  }, [isDark]);
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
      {/* KpiShelf commented out per direction — keep around in case we
          want to bring it back. Dot grid restored to Hero. */}
      {/* <KpiShelf /> */}
      <Benefits />
      <AICatalogue />
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
          {/* 24px gap between Sign in and Book a demo per 4pt grid */}
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
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
            <Button
              variant="primary"
              style={{
                // 4pt grid — Figma button/sm = 36h (padY 8, padX 16), button/md = 40h (padY 8, padX 20)
                padding: scrolled ? "8px 16px" : "8px 20px",
                fontSize: 14,
                lineHeight: "20px",
              }}
            >
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
    // Hero fills the viewport between the sticky header (~96px tall) and the
    // bottom edge. Flexbox column distributes: text/CTA block sits at the top,
    // logo carousel pins to the bottom with 32px breathing room from the
    // viewport's bottom edge. overflow:visible keeps the gradient flowing
    // behind the transparent header.
    <section
      // Hero's OWN theme is light — that's what useScrollTheme reads when
      // Hero is in view. But the wrapper takes 900ms to fade dark→light
      // when scrolling up from the AI section, and during that window we
      // don't want a pure-light Hero sitting in front of a still-dark
      // wrapper. So the visuals below (dotfield bg, vignette, logo fades)
      // passively follow the wrapper theme via [data-theme] crossfades.
      data-section-theme="light"
      style={{
        position: "relative",
        minHeight: "calc(100vh - 96px)",
        display: "flex",
        flexDirection: "column",
        padding: 0,
        overflow: "visible",
      }}
    >
      {/* WebGL cursor-vacuum dot grid restored to Hero — provides the
          interactive ambient backdrop. Theme vignettes crossfade in
          lockstep with the wrapper's light↔dark transition. */}
      <NovaDotfield />
      <div className="hero-vignette hero-vignette-light" aria-hidden />
      <div className="hero-vignette hero-vignette-dark" aria-hidden />
      {/* Hero uses the site-standard Container (1240 max / 40 padding)
          so its left/right margins line up with every other section
          (Benefits, AI Catalogue, Segmenter, HowItWorks, Customer
          Outcomes, FinalCTA, Footer). Inner grid + lottie cap take
          care of letting the artwork still feel substantial within
          those standard margins. */}
      <Container
        style={{
          position: "relative",
          zIndex: 2,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          paddingTop: 32,
          paddingBottom: 32,
        }}
      >
        {/* 2-column grid: text content left, collage Lottie right. flex:1
            so this block fills the available height; the KPI bar that
            follows sits naturally at the bottom of the viewport. Lottie
            column gets the larger share (1fr / 1.25fr) since the artwork
            is the visual anchor of the hero. alignItems:center keeps the
            text block vertically centred against whatever height the
            scaled-up lottie ends up at. */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1.25fr",
            gap: 56,
            alignItems: "center",
          }}
        >
          {/* LEFT · text content */}
          <div>
            {/* "The AI Restaurant OS · 2026" eyebrow removed per direction —
                the headline carries the section on its own. */}
            <ScrollReveal delay={80}>
              <h1
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 48,
                  lineHeight: 1.08,
                  letterSpacing: "-0.028em",
                  fontWeight: 500,
                  // currentColor inherits the wrapper's transitioning text color.
                  // When wrapper is light: ink. When the wrapper is still dark
                  // mid-scroll: whisper. Avoids a hard-coded light value clashing
                  // with the wrapper during the 900ms theme transition.
                  color: "currentColor",
                  margin: "0",
                }}
              >
                The unified <span style={{ color: T.persimmon600 }}>AI-native</span> platform for restaurant operations.
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <p
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 16,
                  lineHeight: 1.56, // matches Figma body/16 (156%)
                  // Same reasoning as h1 — currentColor + opacity follows the
                  // wrapper through the theme transition without snapping.
                  color: "currentColor",
                  opacity: 0.7,
                  margin: "24px 0 0",
                  maxWidth: 560,
                  letterSpacing: "-0.005em",
                }}
              >
                From digital ordering and in-store POS to kitchen workflows, loyalty,
                workforce management, and AI automation — one single intelligent platform.
              </p>
            </ScrollReveal>

            {/* CTA row uses FadeReveal — no clip-path so the FlowCTA's gradient
                border + drop shadow extend freely. */}
            <FadeReveal delay={240}>
              {/* CTA row sits 48px below the description; 32px between CTAs */}
              <div style={{ display: "flex", alignItems: "center", gap: 32, marginTop: 48, flexWrap: "wrap" }}>
                <FlowCTA lottieSrc="/lotties/book-a-demo-trailing-v2.json">Book a demo</FlowCTA>
                {/* "See the platform" — clean ghost link by default. On hover:
                    scale 1.04, persimmon fill rises bottom→top across the text,
                    and the trailing arrow slides in. Implemented as the
                    .ghost-link CSS class in globals.css. */}
                <a href="#" className="ghost-link">
                  <span className="ghost-link-text" data-text="See the platform">
                    See the platform
                  </span>
                  <span className="ghost-link-arrow" aria-hidden>
                    <ArrowRight size={18} strokeWidth={2} />
                  </span>
                </a>
              </div>
            </FadeReveal>

          </div>

          {/* RIGHT · Hero collage Lottie.
              Layout slot keeps its column footprint (so the grid and
              page rhythm don't shift), but the inner wrapper is scaled
              1.2x anchored at left-center via CSS transform — the
              lottie visually extends past the column's right edge by
              ~20% of its width. overflow:visible on the slot lets the
              extra width render outside the layout box.
              The .hero-lottie-fade overlays sit inside the scaled
              wrapper so they scale with the lottie. They paint a
              4-stop linear gradient from transparent → page bg color
              on the rightmost half, melting the protruding portion
              back into the canvas so the visual margin appears intact
              even though the artwork physically extends past it. */}
          <FadeReveal delay={200}>
            <div
              style={{
                width: "100%",
                maxWidth: 710,
                aspectRatio: "1208 / 996",
                marginLeft: "auto",
                position: "relative",
                overflow: "visible",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  // Scaled 1.08x (down 10% from the prior 1.2x) anchored
                  // at left center so the artwork still bleeds rightward
                  // past the column edge, just more subtly. Fade overlays
                  // intentionally removed here to preview the raw
                  // protrusion — CSS classes (.hero-lottie-fade-*)
                  // remain in globals.css and can be re-added when we
                  // want to soften the right edge again.
                  transform: "scale(1.08)",
                  transformOrigin: "left center",
                }}
              >
                <LottiePlayer
                  src="/lotties/hero/hero-03.json"
                  loop
                  autoplay
                  ariaLabel="Nova hero collage animation"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </FadeReveal>
        </div>

        {/* Logo carousel pinned to the bottom of the Hero viewport. Caption
            + carousel render directly (no ScrollReveal wrapper) — wrapping
            them in ScrollReveal hides them on load because the bidirectional
            IO with negative bottom rootMargin treats bottom-pinned elements
            as "below the effective viewport" until the user scrolls. */}
        <div style={{ paddingTop: 24 }}>
          {/* Eyebrow "Powering 680 restaurants…" removed — the logo
              carousel stands on its own without the prefatory line. */}
          <LogoCarousel />
        </div>
      </Container>
    </section>
  );
}

// =========================================================
//  KPI SHELF — full-viewport-height section directly below the Hero.
//  Five proof metrics in a 3+2 flex layout (3 items in row 1, 2 items in
//  row 2 — row 2 sits naturally narrower and centered by the section's
//  alignItems: center). Spec mirrors Figma node 1005:1691 verbatim.
//
//  Background: the interactive WebGL dot field (NovaDotfield) — moved
//  here from the Hero. Reads as a quiet ambient pulse behind the KPIs
//  with cursor-vacuum interaction.
//
//  Reveal: BIDIRECTIONAL — a single section-level IntersectionObserver
//  toggles `inView` on every entry/exit. Items cascade in L→R when
//  entering, fade out together when leaving. Counter only animates the
//  FIRST time the section enters view (KpiShelfItem tracks `hasSettled`
//  internally and renders a static span thereafter), so revisits feel
//  fluid without re-counting.
// =========================================================
function KpiShelf() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setInView(true);
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Bidirectional — toggle inView on every transition.
        setInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [reduced]);

  const kpis = [
    { value: 10,  prefix: "",  suffix: "+",  decimals: 0, label: "vendors replaced" },
    { value: 18,  prefix: "+", suffix: "%",  decimals: 0, label: "sales from AI insights" },
    { value: 7.4, prefix: "+", suffix: "%",  decimals: 1, label: "avg ticket from AI upsell" },
    { value: 42,  prefix: "$", suffix: "",   decimals: 0, label: "recovered per missed call" },
    { value: 14,  prefix: "",  suffix: "%",  decimals: 0, label: "loyalty win-back rate" },
  ];
  const row1 = kpis.slice(0, 3);
  const row2 = kpis.slice(3, 5);

  // 200ms stagger between items — slower than before so the cascade is
  // perceivable even with a generous IO threshold trigger.
  const STAGGER = 200;

  return (
    <section
      ref={ref}
      data-section-theme="light"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // padding-top = design 128 + 96 navbar offset → so justifyContent:
        // center actually centers in the BELOW-NAVBAR visible area rather
        // than the section's geometric center. Without this the sticky
        // 96px nav overlaps the top and the KPIs end up ~48px above the
        // visible center of the viewport.
        paddingTop: 224,
        paddingBottom: 128,
        paddingInline: 96,
        overflow: "hidden",
      }}
    >
      {/* Interactive WebGL dot field — same component the Hero used to
          host. Sits behind the KPIs as ambient bg; cursor still triggers
          the vacuum/burst effects. Higher baseAlpha here than the Hero's
          default so the dots read clearly behind the centered KPIs. */}
      <NovaDotfield baseAlpha={1.0} />

      {/* Soft canvas-tone vignette so the dot grid concentrates around
          the centered KPIs and quietly fades into the section bg at the
          edges — keeps the labels reading crisply against the dots. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(250,250,251,0) 0%, rgba(250,250,251,0.4) 75%, rgba(250,250,251,0.92) 100%)",
        }}
      />

      {/* KPI rows — relative + zIndex so they sit above the dot field.
          Row-to-row gap is 96px; item-to-item gap inside each row stays at
          72px per Figma. */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 96,
        }}
      >
        <div style={{ display: "flex", gap: 96, alignItems: "flex-start" }}>
          {row1.map((kpi, i) => (
            <KpiShelfItem
              key={kpi.label}
              kpi={kpi}
              delay={i * STAGGER}
              active={inView}
            />
          ))}
        </div>
        <div style={{ display: "flex", gap: 96, alignItems: "flex-start" }}>
          {row2.map((kpi, i) => (
            <KpiShelfItem
              key={kpi.label}
              kpi={kpi}
              delay={(i + 3) * STAGGER}
              active={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// =========================================================
//  KPI SHELF ITEM — single cell. Matches Figma 1005:1691:
//    · Number: Inter Medium 72px / 108% / -2.016px tracking / ink
//    · Label:  Inter Regular 14px / 21px / inkMuted
//    · Gap between number and label: 9px
//
//  Behavior: bidirectional fade + lift gated on parent's `active` flag.
//  When active flips true, setTimeout fires at the item's staggered delay
//  → `shown` flips true → item fades in + counter mounts and animates
//  from 0. Counter is one-shot per session: once it finishes, hasSettled
//  flips and subsequent reveals render a static span instead of CountUp
//  so revisits don't re-tick the number.
// =========================================================
function KpiShelfItem({ kpi, delay, active }) {
  const [shown, setShown] = useState(false);
  const [hasSettled, setHasSettled] = useState(false);
  const reduced = usePrefersReducedMotion();

  // Gate the fade in/out on `active` + delay. Bidirectional — when
  // active flips back to false (section scrolled out), hide immediately.
  useEffect(() => {
    if (!active) {
      setShown(false);
      return;
    }
    if (reduced) {
      setShown(true);
      setHasSettled(true);
      return;
    }
    const t = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(t);
  }, [active, delay, reduced]);

  // Once shown lands true for the first time, schedule the "settled"
  // flip after the counter animation finishes (1700ms duration + buffer).
  // After this, future reveals render a static span — no re-tick.
  useEffect(() => {
    if (!shown || hasSettled || reduced) return;
    const t = setTimeout(() => setHasSettled(true), 1700 + 100);
    return () => clearTimeout(t);
  }, [shown, hasSettled, reduced]);

  // Static placeholder showing the final value — keeps the column width
  // stable both before reveal (hidden) and after settle (visible).
  const finalText = `${kpi.prefix}${kpi.decimals > 0 ? kpi.value.toFixed(kpi.decimals) : Math.round(kpi.value)}${kpi.suffix}`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(16px)",
        transition: reduced
          ? "none"
          : "opacity 700ms ease, transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "opacity, transform",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontSize: 88,
          fontWeight: 500,
          lineHeight: 1.08,
          // Keep the Figma -2.8% kerning ratio at the new size: 88 × -0.028
          letterSpacing: "-2.464px",
          color: T.ink,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
        }}
      >
        {shown && !hasSettled ? (
          <CountUp
            value={kpi.value}
            prefix={kpi.prefix}
            suffix={kpi.suffix}
            decimals={kpi.decimals}
            duration={1700}
            startDelay={0}
            triggerOn="mount"
          />
        ) : (
          <span style={{ visibility: shown ? "visible" : "hidden" }}>
            {finalText}
          </span>
        )}
      </div>
      <div
        style={{
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontSize: 14,
          fontWeight: 400,
          lineHeight: "21px",
          color: T.inkMuted,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {kpi.label}
      </div>
    </div>
  );
}

// =========================================================
//  COUNT-UP — animated number that eases from 0 to `value`. Honors
//  prefers-reduced-motion (lands immediately). Cubic ease-out so the
//  number decelerates as it approaches the target.
//
//    triggerOn = "mount"     → starts on component mount + startDelay
//    triggerOn = "viewport"  → waits for IntersectionObserver entry (default)
//
//  Use "mount" for elements that are visible from page load (Hero KPIs);
//  use "viewport" for elements that animate when the user scrolls them
//  into view.
// =========================================================
function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1400,
  startDelay = 0,
  triggerOn = "viewport",
}) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const startedRef = useRef(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    if (startedRef.current) return;

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const begin = performance.now() + startDelay;
      let raf;
      const frame = (now) => {
        if (now < begin) {
          raf = requestAnimationFrame(frame);
          return;
        }
        const t = Math.min((now - begin) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out
        setDisplay(value * eased);
        if (t < 1) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };

    if (triggerOn === "mount") {
      start();
      return;
    }

    // viewport trigger — used by reveals that animate on scroll-in
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration, startDelay, reduced, triggerOn]);

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toString();

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}{formatted}{suffix}
    </span>
  );
}

// =========================================================
//  HERO LOGO SECTION — logo carousel pulled out of the Hero into its
//  own dedicated band. Appears as the user scrolls down past the hero.
//  Light theme, hairlines top/bottom for separation.
// =========================================================
function HeroLogoSection() {
  return (
    <section
      data-section-theme="light"
      style={{
        padding: "72px 0",
        position: "relative",
      }}
    >
      <Container>
        <ScrollReveal>
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: 15,
              letterSpacing: "-0.01em",
              color: "currentColor",
              opacity: 0.55,
              fontWeight: 400,
              marginBottom: 28,
              textAlign: "center",
            }}
          >
            Powering 680 restaurants from emerging brands to enterprise chains
          </div>
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <LogoCarousel />
        </ScrollReveal>
      </Container>
    </section>
  );
}

// =========================================================
//  HERO COLLAGE PLACEHOLDER
//  Temporary placeholder for the team's hero Lottie. Sized to roughly
//  the eventual collage aspect (1:1) with a soft 4-tile ghost grid that
//  reads as "intentional placeholder, not broken." Replace the inside
//  with <LottiePlayer src="/lotties/hero-collage.json" /> when the team
//  delivers the file.
// =========================================================
function HeroCollagePlaceholder() {
  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
        maxWidth: 480,
        marginLeft: "auto",
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr",
        gridTemplateRows: "1.2fr 1fr",
        gap: 10,
        padding: 0,
      }}
    >
      <PlaceholderTag>Lottie · hero collage</PlaceholderTag>
      {[
        { area: "1 / 1 / 2 / 2", grad: "linear-gradient(150deg, #F9A06044 0%, #E9504D22 100%)" },
        { area: "1 / 2 / 2 / 3", grad: "linear-gradient(150deg, #FAAF8933 0%, #F1785722 100%)" },
        { area: "2 / 1 / 3 / 2", grad: "linear-gradient(150deg, #9965F033 0%, #6A43D822 100%)" },
        { area: "2 / 2 / 3 / 3", grad: "linear-gradient(150deg, #FFD5A833 0%, #F9A06022 100%)" },
      ].map((cell, i) => (
        <div
          key={i}
          style={{
            gridArea: cell.area,
            background: cell.grad,
            border: `1px dashed ${T.hairline}`,
            borderRadius: 18,
            backdropFilter: "blur(2px)",
          }}
        />
      ))}
    </div>
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
//  STATS BAR — five high-level proof stats, full-width row between
//  Hero and Benefits. Modeled on the 2026 source's StatsBar.
// =========================================================
function StatsBar() {
  const stats = [
    { v: "7–10+",  l: "legacy vendors replaced" },
    { v: "+18%",   l: "sales from AI insights" },
    { v: "+7.4%",  l: "avg ticket from AI upsell" },
    { v: "$42",    l: "recovered per missed call" },
    { v: "14%",    l: "loyalty win-back rate" },
  ];
  return (
    <section
      data-section-theme="light"
      style={{
        padding: "56px 0",
        borderTop: `1px solid ${T.hairline}`,
        borderBottom: `1px solid ${T.hairline}`,
        position: "relative",
      }}
    >
      <Container>
        <StaggerGroup
          perItemDelay={70}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
            gap: 20,
            alignItems: "start",
          }}
        >
          {stats.map((s) => (
            <ScrollReveal key={s.v + s.l} lift={16}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 40,
                    lineHeight: 1.0,
                    letterSpacing: "-0.035em",
                    fontWeight: 500,
                    color: "currentColor",
                    marginBottom: 8,
                  }}
                >
                  {s.v}
                </div>
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 13,
                    lineHeight: 1.45,
                    letterSpacing: "-0.005em",
                    color: "currentColor",
                    opacity: 0.62,
                  }}
                >
                  {s.l}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}

// =========================================================
//  BENEFITS — scroll-pinned 3-phase narrative. Left text + right visual
//  stay anchored in the viewport while the user scrolls through; as
//  scroll progresses the phase advances (PhaseTransition crossfades
//  outgoing/incoming layers) and each piece of text rises in with
//  BiMaskReveal's bottom-up curtain.
//
//  Dark-mode compatible: section has NO own bg (lets the wrapper bg show
//  through), all text uses currentColor, the visual card uses a subtle
//  accent tint that reads on both light and dark. Floating stat callouts
//  were removed — the lottie placeholders read as the single visual focal
//  point.
// =========================================================
function Benefits() {
  const ref = useRef(null);
  const progress = useSectionProgress(ref);
  const phases = [
    {
      key: "01",
      title: (
        <>
          Stop managing multiple vendors.
          <br />
          <span style={{ color: T.persimmon600 }}>Run on one</span> platform.
        </>
      ),
      body:
        "Nova replaces 10–18 disconnected restaurant systems with one AI-native operating system — covering POS, digital ordering, kitchen, loyalty, workforce management, and real-time analytics.",
      proof: [
        "Modern POS and Kitchen Display System built for speed and scale",
        "Online ordering, mobile app, kiosk, and drive-thru unified",
        "Loyalty and guest data connected across every channel",
      ],
      statV: "7–10+",
      statL: "legacy vendors replaced in typical enterprise deployments",
      linkLabel: "See every Nova module",
      linkHref: "#platform",
      placeholderTag: "Lottie · platform consolidation",
      tone: "warm",
    },
    {
      key: "02",
      title: (
        <>
          AI that grows revenue.
          <br />
          AI that <span style={{ color: T.nebula500 }}>improves operations</span>.
        </>
      ),
      body:
        "Nova brings AI directly into restaurant operations across ordering, labor, guest engagement, and real-time decision making.",
      proof: [
        "AI Voice and Vision capture phone and drive-thru orders 24/7",
        "AI Insights surface sales, menu, and operational opportunities in real time",
        "AI optimizes staffing efficiency and flags voids, comps, and issues instantly",
      ],
      statV: "+18%",
      statL: "in sales from a single Reporting AI insight",
      linkLabel: "Explore AI at the core",
      linkHref: "#ai-core",
      placeholderTag: "Lottie · AI at the core",
      tone: "cool",
    },
    {
      key: "03",
      title: (
        <>
          Know every guest.
          <br />
          <span style={{ color: T.persimmon600 }}>Personalize</span> every visit.
        </>
      ),
      body:
        "Nova connects guest activity across every ordering channel into one intelligent customer profile, helping restaurants increase loyalty, repeat visits, and average ticket size.",
      proof: [
        "AI-driven upsell based on guest behavior",
        "Smarter campaigns powered by real-time customer data",
        "Connected loyalty and consistent guest experiences across every digital and in-store touchpoint",
      ],
      statV: "+7.4%",
      statL: "average ticket lift from AI-powered upsell across every channel",
      linkLabel: "See AI-driven upsell",
      linkHref: "#loyalty",
      placeholderTag: "Lottie · guest personalization",
      tone: "mint",
    },
  ];
  const phaseIndex = Math.min(phases.length - 1, Math.floor(progress * phases.length));
  const p = phases[phaseIndex];

  return (
    <section
      ref={ref}
      data-section-theme="light"
      style={{
        position: "relative",
        height: "320vh",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container style={{ width: "100%" }}>
          <div
            style={{
              display: "grid",
              // 5fr / 7fr gives the right column ~40% more width than the
              // left, scaling all 8 Lottie layers in lockstep (they're
              // each absolutely positioned at inset:0 / width 100% on the
              // shared 1:1 BenefitsVisual container, so any width change
              // applies uniformly — no risk of breaking transition
              // alignment across layers).
              gridTemplateColumns: "5fr 7fr",
              gap: 64,
              alignItems: "stretch",
              minHeight: 520,
            }}
          >
            {/* LEFT — text content. PhaseTransition crossfades old → new
                phase content, BiMaskReveal inside lifts each piece up. */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <PhaseTransition phaseKey={phaseIndex} duration={700}>
                <BiMaskReveal delay={0}>
                  {/* paddingBottom on the Heading gives the BiMaskReveal
                      clip-path enough room to clear descenders ("y", "g",
                      "p"). At lineHeight 1.0 the descender otherwise sits
                      below the element box and gets clipped. */}
                  <Heading
                    size={40}
                    color="currentColor"
                    style={{ lineHeight: 1.12, paddingBottom: 4 }}
                  >
                    {p.title}
                  </Heading>
                </BiMaskReveal>
                <BiMaskReveal delay={140}>
                  <Body size={17} color="currentColor" style={{ marginTop: 12, maxWidth: 480, opacity: 0.72 }}>
                    {p.body}
                  </Body>
                </BiMaskReveal>
                <BiMaskReveal delay={280}>
                  <ul style={{ listStyle: "none", padding: 0, margin: "32px 0 36px", display: "flex", flexDirection: "column", gap: 14 }}>
                    {p.proof.map((point) => (
                      <li
                        key={point}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 12,
                          fontSize: 15,
                          color: "currentColor",
                          opacity: 0.86,
                          fontWeight: 500,
                        }}
                      >
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
                            transition: "background-color 900ms cubic-bezier(0.4,0,0.2,1)",
                          }}
                        >
                          <Check className="check-bullet-icon" size={11} color={T.persimmon600} strokeWidth={3} />
                        </span>
                        <span style={{ lineHeight: 1.5 }}>{point}</span>
                      </li>
                    ))}
                  </ul>
                </BiMaskReveal>
                <FadeReveal delay={420}>
                  <a
                    href={p.linkHref}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 14,
                      color: T.persimmon600,
                      fontWeight: 600,
                      textDecoration: "none",
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {p.linkLabel} <ArrowRight size={14} />
                  </a>
                </FadeReveal>
              </PhaseTransition>
            </div>

            {/* RIGHT — Lottie stage. Mounted ONCE (no PhaseTransition
                wrapper) so the inner state machine maintains continuity
                across phase boundaries — transitions need access to the
                previous step to know which forward/reverse lottie to
                play, and the theme-aware P03 variants need to know the
                current frame to sync across the light/dark swap. */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BenefitsVisual phaseIndex={phaseIndex} />
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

// =========================================================
//  BENEFITSVISUAL — Scroll-synced + theme-aware Lottie stage
//
//  Mirror of HowVisual (same trigger-and-play model, same outgoing-layer
//  reset to kill blinks in both scroll directions) but with one extra
//  wrinkle: phase 3 has TWO idle variants (P03 light + P03 dark).
//  The active variant follows the page's wrapper theme — when the user
//  scrolls down out of Benefits and the wrapper [data-theme] flips
//  light → dark on the way into AI Catalogue, the dark P03 takes over;
//  when they scroll back up, light P03 returns.
//
//  Variant swap is frame-synced (the incoming variant resumes from the
//  outgoing variant's exact frame) so the visual continues without a
//  mid-loop restart — the user only perceives a color change.
//
//  All other layers (P01/P02/P03-light/P03-dark idles + 4 transitions)
//  follow the same imperative goToAndPlay(0)-before-state-flip pattern
//  HowVisual uses, so every becomes-visible event lands on a known frame.
// =========================================================
function BenefitsVisual({ phaseIndex }) {
  // Theme tracked independently here so we can swap P03 variants the
  // moment the wrapper [data-theme] flips. Cost = one extra rAF-throttled
  // scroll listener — negligible.
  const theme = useScrollTheme("light");

  const [activeIdle, setActiveIdle] = useState(0);
  const [transition, setTransition] = useState(null);
  const prevStepRef = useRef(0);

  // Imperative refs. Idle slot 2 holds both P03 variants since they
  // collapse to a single "phase 3" stage with theme-driven variant swap.
  const idleRefs = useRef({ 0: null, 1: null, "2-light": null, "2-dark": null });
  const transitionRefs = useRef({});

  // Previous-visibility trackers for the outgoing-layer reset
  // (frame-0 prime on becoming invisible, same pattern as HowVisual).
  const prevVisibleIdleRef = useRef(0);
  const prevVisibleP03ThemeRef = useRef(theme);
  const prevVisibleTransitionRef = useRef(null);

  const slugFor = (from, to) => {
    const forward = to > from;
    return forward
      ? `p0${from + 1}-p0${to + 1}`
      : `reverse-p0${from + 1}-p0${to + 1}`;
  };

  // Scroll-driven phase changes — same logic as HowVisual.
  useEffect(() => {
    const prev = prevStepRef.current;
    if (prev === phaseIndex) return;
    prevStepRef.current = phaseIndex;
    if (transition) return;
    const next = prev + (phaseIndex > prev ? 1 : -1);
    const transKey = slugFor(prev, next);
    transitionRefs.current[transKey]?.goToAndPlay(0, true);
    setTransition({
      key: transKey,
      playKey: Date.now(),
      destStep: next,
    });
  }, [phaseIndex, transition]);

  // Frame-sync the P03 variants when the wrapper theme flips while
  // phase 3 is the active idle. Without this, the incoming variant
  // would jump back to frame 0 mid-loop on every theme change.
  useEffect(() => {
    const onP03 = !transition && activeIdle === 2;
    const wasP03 = prevVisibleIdleRef.current === 2;
    if (!onP03 || !wasP03) {
      prevVisibleP03ThemeRef.current = theme;
      return;
    }
    const prevTheme = prevVisibleP03ThemeRef.current;
    if (prevTheme === theme) return;
    const outgoingKey = prevTheme === "dark" ? "2-dark" : "2-light";
    const incomingKey = theme === "dark" ? "2-dark" : "2-light";
    // Read the frame the outgoing variant is on, then start the
    // incoming variant at that exact frame so the swap is invisible
    // (assuming the two assets share a timeline, which they do — the
    // artist exported them from the same source with different colors).
    const frame = idleRefs.current[outgoingKey]?.getCurrentFrame() ?? 0;
    idleRefs.current[incomingKey]?.goToAndPlay(frame, true);
    idleRefs.current[outgoingKey]?.goToAndStop(0, true);
    prevVisibleP03ThemeRef.current = theme;
  }, [theme, activeIdle, transition]);

  const onTransitionComplete = () => {
    if (!transition) return;
    const dest = transition.destStep;
    const latest = prevStepRef.current;

    if (dest === latest) {
      // Hand off to the dest idle. For phase 3 we pick the variant
      // matching the current theme.
      const destKey = dest === 2 ? (theme === "dark" ? "2-dark" : "2-light") : dest;
      idleRefs.current[destKey]?.goToAndPlay(0, true);
      setActiveIdle(dest);
      setTransition(null);
    } else {
      const nextDest = dest + (latest > dest ? 1 : -1);
      const nextKey = slugFor(dest, nextDest);
      transitionRefs.current[nextKey]?.goToAndPlay(0, true);
      setActiveIdle(dest);
      setTransition({
        key: nextKey,
        playKey: Date.now(),
        destStep: nextDest,
      });
    }
  };

  // Outgoing-layer cleanup — same pattern as HowVisual.
  useEffect(() => {
    const currentIdle = transition ? null : activeIdle;
    const prevIdle = prevVisibleIdleRef.current;
    if (prevIdle !== null && prevIdle !== currentIdle) {
      // The idle we're leaving — for phase 3, only reset the variant
      // that was actually visible.
      const outgoingKey = prevIdle === 2 ? (prevVisibleP03ThemeRef.current === "dark" ? "2-dark" : "2-light") : prevIdle;
      try { idleRefs.current[outgoingKey]?.goToAndStop(0, true); } catch (e) { /* noop */ }
    }
    prevVisibleIdleRef.current = currentIdle;

    const currentTrans = transition?.key || null;
    const prevTrans = prevVisibleTransitionRef.current;
    if (prevTrans && prevTrans !== currentTrans) {
      try { transitionRefs.current[prevTrans]?.goToAndStop(0, true); } catch (e) { /* noop */ }
    }
    prevVisibleTransitionRef.current = currentTrans;
  }, [activeIdle, transition]);

  const transitionKeys = [
    "p01-p02",
    "p02-p03",
    "reverse-p02-p01",
    "reverse-p03-p02",
  ];

  const onPhase3 = !transition && activeIdle === 2;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
        margin: "0 auto",
      }}
    >
      {/* Idle P01 */}
      <LottiePlayer
        key="b-idle-0"
        ref={(el) => { idleRefs.current[0] = el; }}
        src="/lotties/benefits/p01.json"
        loop
        autoplay
        paused={!(!transition && activeIdle === 0)}
        ariaLabel="Benefit 01 platform consolidation idle animation"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: !transition && activeIdle === 0 ? 1 : 0, pointerEvents: "none" }}
      />
      {/* Idle P02 */}
      <LottiePlayer
        key="b-idle-1"
        ref={(el) => { idleRefs.current[1] = el; }}
        src="/lotties/benefits/p02.json"
        loop
        autoplay={false}
        paused={!(!transition && activeIdle === 1)}
        ariaLabel="Benefit 02 AI at the core idle animation"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: !transition && activeIdle === 1 ? 1 : 0, pointerEvents: "none" }}
      />
      {/* Idle P03 — Light variant */}
      <LottiePlayer
        key="b-idle-2-light"
        ref={(el) => { idleRefs.current["2-light"] = el; }}
        src="/lotties/benefits/p03-light.json"
        loop
        autoplay={false}
        paused={!(onPhase3 && theme === "light")}
        ariaLabel="Benefit 03 guest personalization (light) idle animation"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: onPhase3 && theme === "light" ? 1 : 0, pointerEvents: "none" }}
      />
      {/* Idle P03 — Dark variant */}
      <LottiePlayer
        key="b-idle-2-dark"
        ref={(el) => { idleRefs.current["2-dark"] = el; }}
        src="/lotties/benefits/p03-dark.json"
        loop
        autoplay={false}
        paused={!(onPhase3 && theme === "dark")}
        ariaLabel="Benefit 03 guest personalization (dark) idle animation"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: onPhase3 && theme === "dark" ? 1 : 0, pointerEvents: "none" }}
      />
      {/* Transitions */}
      {transitionKeys.map((tKey) => {
        const active = transition?.key === tKey;
        return (
          <LottiePlayer
            key={`b-trans-${tKey}`}
            ref={(el) => { transitionRefs.current[tKey] = el; }}
            src={`/lotties/benefits/${tKey}.json`}
            loop={false}
            autoplay={false}
            paused={!active}
            playKey={active ? transition.playKey : 0}
            onComplete={active ? onTransitionComplete : undefined}
            ariaLabel={`Benefits transition ${tKey}`}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: active ? 1 : 0, pointerEvents: "none" }}
          />
        );
      })}
    </div>
  );
}

function BenefitVisualPlaceholder({ tag, tone, statV, statL }) {
  // Tone tints — accent-color gradients with no hard-coded bg end stop,
  // so they fade naturally into whatever wrapper bg sits behind them
  // (light during Benefits, dark mid-transition into AI Catalogue).
  // `statV` / `statL` are still accepted on the prop API but no longer
  // rendered — the floating stat callouts were removed per direction so
  // the lottie placeholders read as the single visual focal point.
  const tones = {
    warm: "linear-gradient(150deg, rgba(241,120,87,0.22) 0%, rgba(241,120,87,0) 100%)",
    cool: "linear-gradient(150deg, rgba(106,67,216,0.22) 0%, rgba(106,67,216,0) 100%)",
    mint: "linear-gradient(150deg, rgba(91,180,138,0.22) 0%, rgba(91,180,138,0) 100%)",
  };
  return (
    <div
      className="benefit-visual"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 520,
        borderRadius: 24,
        background: tones[tone] || tones.warm,
        overflow: "hidden",
      }}
    >
      <PlaceholderTag>{tag}</PlaceholderTag>
    </div>
  );
}

// =========================================================
//  CONSOLIDATION BENEFIT  (LEGACY — kept for Platform inner page)
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
        <ScrollReveal>
          <SectionLabel index="01" label="Consolidation" />
        </ScrollReveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <ScrollReveal>
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
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <Body size={17} color="currentColor" style={{ marginTop: 28, maxWidth: 460, opacity: 0.7 }}>
                Most restaurant chains operate across 7 to 10 disconnected systems
                for POS, loyalty, ordering, labor, inventory, reporting, and
                accounting. Nova replaces them with one unified AI-native platform
                built on a single data layer.
              </Body>
            </ScrollReveal>
            {/* Proofs cascade in with StaggerGroup — each list item bidirectional-
                reveals 80ms after the previous, starting 200ms after the body. */}
            <StaggerGroup
              as="ul"
              baseDelay={200}
              perItemDelay={80}
              style={{ listStyle: "none", padding: 0, margin: "28px 0 32px", display: "flex", flexDirection: "column", gap: 14 }}
            >
              {proofs.map((p) => (
                <ScrollReveal
                  key={p}
                  as="li"
                  lift={16}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 15, color: "currentColor", opacity: 0.85, fontWeight: 500 }}
                >
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
                </ScrollReveal>
              ))}
            </StaggerGroup>
            <ScrollReveal delay={520}>
              <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, color: T.persimmon600, fontWeight: 600, textDecoration: "none", letterSpacing: "-0.005em" }}>
                See every Nova module <ArrowRight size={14} />
              </a>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={160}>
            <ConsolidationDiagram />
          </ScrollReveal>
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
  // Cards adopt the 2026 content titles. Each carries a `tagline` — short,
  // stat-anchored phrase rendered below the title in a refined accent-bar +
  // mono-caps treatment, replacing the legacy pill pattern.
  const cards = [
    // chipText (DARK MODE) = lighter accent for contrast on dark bg.
    // chipTextLight (LIGHT MODE) = darker accent for contrast on light bg.
    // CSS-driven swap via [data-theme] on the wrapper transitions smoothly
    // alongside the rest of the dark↔light handoff.
    {
      key: "voice",
      title: "Interactive Voice Ordering",
      tagline: "$42 recovered per missed call",
      subtext: "AI Voice automates drive-thru and phone ordering with real-time conversations and direct POS and KDS integration.",
      accent: T.nebula500,
      chipText: "#BBA5EE",        // lighter nebula → dark mode
      chipTextLight: "#6A43D8",   // darker nebula → light mode
      visual: <VoiceVizLarge />,
      bareVisual: true,
    },
    {
      key: "upsell",
      title: "Automated Upsell & Cross-Sell",
      tagline: "+7.4% average ticket lift",
      subtext: "Personalized AI recommendations increase average ticket across digital, kiosk, drive-thru, and in-store ordering.",
      accent: T.persimmon500,
      chipText: "#F8AA94",
      chipTextLight: "#D43F39",
      visual: <UpsellVizLarge />,
      bareVisual: true,
    },
    {
      key: "insights",
      title: "Sales Insights & Recommendations",
      tagline: "+18% sales lift at Bayou Bistro",
      subtext: "AI analyzes sales patterns and surfaces actionable opportunities by location, daypart, menu item, and guest behavior.",
      accent: T.cobalt500,
      chipText: "#8FB8F2",
      chipTextLight: "#2A60C0",
      visual: <InsightsVizLarge />,
      bareVisual: true,
    },
    {
      key: "vision",
      title: "Menu Engineering",
      tagline: "Smarter menu decisions",
      subtext: "AI optimizes pricing, promotions, and menu performance based on real guest demand across every channel.",
      accent: T.matcha500,
      chipText: "#9BD5B4",
      chipTextLight: "#3A8C66",
      visual: <VisionVizLarge />,
      bareVisual: true,
    },
    {
      key: "copilot",
      title: "Staff Scheduling Optimization",
      tagline: "Optimized labor costs",
      subtext: "AI-driven scheduling aligns staffing with real-time demand across every location and daypart.",
      accent: T.saffron500,
      chipText: "#F0D17C",
      chipTextLight: "#A06A12",
      visual: <CopilotVizLarge />,
      bareVisual: true,
    },
    {
      key: "campaigns",
      title: "AI Campaign Management",
      tagline: "Higher engagement and retention",
      subtext: "Generates campaigns, audiences, offers, and messaging automatically across email, SMS, and loyalty channels.",
      accent: T.persimmon500,
      chipText: "#F8AA94",
      chipTextLight: "#D43F39",
      visual: <CampaignsVizLarge />,
      bareVisual: true,
    },
  ];
  return (
    <section
      data-section-theme="dark"
      style={{
        padding: "140px 0",
        // overflow:visible so the CTA's outer 1px ring + drop shadow render
        // without clipping. Blob containment is moved to the inner GlowClip
        // wrapper below so the persimmon/nebula glows still stay inside the
        // section bounds.
        position: "relative",
        overflow: "visible",
      }}
    >

      {/* AI Catalogue runs clean for the lottie pass — gradient blobs removed.
          We'll re-introduce a tighter ambient layer once the per-card lotties
          are all in. */}

      <Container style={{ position: "relative", zIndex: 1 }}>
        <ScrollReveal>
          <SectionLabel label="AI Catalogue" color={T.nebula500} />
        </ScrollReveal>
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 60, alignItems: "end", marginBottom: 80 }}>
          <ScrollReveal>
            {/* currentColor binds to wrapper's transitioning text color so the
                copy stays readable during the dark→light wrapper fade. */}
            <Heading size={64} color="currentColor">
              AI built into
              <br />
              restaurant <span style={{ color: T.nebula500 }}>operations</span>.
            </Heading>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <Body color="currentColor" size={17} style={{ paddingBottom: 8, opacity: 0.7 }}>
              Nova delivers AI across ordering, marketing, operations, labor, and guest engagement through one connected platform and data layer.
            </Body>
          </ScrollReveal>
        </div>
        {/* Mercury pattern: 6 lottie cards in a 3x2 grid · row gap widened per design.
            StaggerGroup cascades each card in 80ms after the previous as the grid
            scrolls into view, bidirectional via the underlying ScrollReveal. */}
        <StaggerGroup
          perItemDelay={80}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", columnGap: 28, rowGap: 92 }}
        >
          {cards.map(({ key, ...rest }) => (
            <ScrollReveal key={key}>
              <MercuryAICard {...rest} />
            </ScrollReveal>
          ))}
        </StaggerGroup>
        {/* Dual CTA row — Browse catalogue (primary) + See AI architecture
            (ghost link). FadeReveal so the FlowCTA's gradient bg + 1px ring
            + drop shadow render without clipping. */}
        <FadeReveal delay={200}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 32, marginTop: 72, flexWrap: "wrap" }}>
            <FlowCTA onDark>Browse the full AI catalogue</FlowCTA>
            <a href="#" className="ghost-link" style={{ color: "currentColor" }}>
              <span className="ghost-link-text" data-text="See AI architecture">
                See AI architecture
              </span>
              <span className="ghost-link-arrow" aria-hidden>
                <ArrowRight size={18} strokeWidth={2} />
              </span>
            </a>
          </div>
        </FadeReveal>
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

function MercuryAICard({ title, subtext, tagline, accent, chipText, chipTextLight, visual, bareVisual }) {
  // bareVisual = true → strip the rgba frame, border, backdrop blur, glow
  // blob, and placeholder chip. The provided `visual` IS the card. Used by
  // the AI Voice Ordering card where the SVG bg has rounded corners + a
  // gradient that blends into the section bg directly.
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div
        style={{
          background: bareVisual ? "transparent" : "rgba(255,255,255,0.04)",
          border: bareVisual ? "none" : "1px solid rgba(255,255,255,0.08)",
          borderRadius: bareVisual ? 0 : 20,
          position: "relative",
          overflow: "hidden",
          aspectRatio: "1/1.05",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: bareVisual ? "none" : "blur(10px)",
          transition: bareVisual
            ? "transform 320ms cubic-bezier(0.2,0,0,1)"
            : "border-color 320ms ease, transform 320ms cubic-bezier(0.2,0,0,1), background 320ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          if (!bareVisual) {
            e.currentTarget.style.borderColor = `${accent}55`;
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          if (!bareVisual) {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          }
        }}
      >
        {/* Soft accent glow + lottie placeholder chip only render for
            non-bareVisual cards (still waiting on their real lotties). */}
        {!bareVisual && (
          <>
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
          </>
        )}
        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {visual}
        </div>
      </div>

      {/* Title + subtext below the visual. Tagline chip removed per board
          direction — the per-card proof badges added noise upfront and
          the headline alone reads cleaner. The `tagline` prop is kept on
          the data so we can revive it later without re-plumbing. */}
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
// AI Voice Ordering card · SVG bg + perfectly-centered Lottie.
// Layer order (bottom→top):
//   1. ai-voice-card-bg.svg fills the card, object-fit:cover keeps it edge-to-edge
//   2. Voice AI_01 lottie sits centered in absolute middle with ~52% width
// The parent MercuryAICard frame is a square (aspect-ratio 1/1.05) and uses
// position:relative, so absolute children pin to its bounds.
function VoiceVizLarge() {
  return (
    <>
      {/* BG poster — fills the card */}
      <img
        src="/lotties/ai-voice-card-bg.svg"
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />
      {/* Lottie · centered both axes · scaled up to fill more of the
          ripple zone in the bg artwork. */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "72%",
          aspectRatio: "1/1",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      >
        <LottiePlayer
          src="/lotties/voice-ai-01.json"
          loop
          autoplay
          ariaLabel="AI Voice Ordering animation"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </>
  );
}

// =========================================================
//  AI CATALOGUE LOTTIE TILES — Voice AI pattern, generalized
//
//  Each of the 5 (formerly 6 — Voice AI keeps its own VoiceVizLarge for
//  the centered-overlay quirk) AI Catalogue cards now follows the same
//  bg-poster + Lottie-overlay pattern: an artist-authored 396×416 SVG
//  background fills the card edge-to-edge, with the matching 396×416
//  Lottie animation stacked at the exact same dimensions. Both layers
//  are absolutely positioned at inset:0 / objectFit:cover so they remain
//  pixel-aligned across viewports. Used with `bareVisual: true` on the
//  MercuryAICard so there's no frame chrome competing with the artwork.
// =========================================================
function AICatLottieViz({ bg, src, label }) {
  // Uses DotLottiePlayer (wasm-based @lottiefiles/dotlottie-react) rather
  // than the lottie-web-based LottiePlayer used elsewhere on the page.
  // Two of the artist's six AI Catalogue lotties (Upsell + Sales Insights)
  // exercise precomp evaluation paths that lottie-web's classic SVG/canvas
  // renderer doesn't populate correctly — the precomp's `<g>` ends up
  // empty even though `firstFrame`/`currentFrame` advance correctly. The
  // dotlottie wasm renderer handles the same files without modification,
  // so we just use it for all 6 cards for consistency.
  return (
    <>
      <img
        src={bg}
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />
      <DotLottiePlayer
        src={src}
        loop
        autoplay
        ariaLabel={label}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

function UpsellVizLarge() {
  return (
    <AICatLottieViz
      bg="/lotties/menu-upsell-bg.svg"
      src="/lotties/ai-catalogue/upsell.json"
      label="Automated Upsell & Cross-Sell animation"
    />
  );
}

function InsightsVizLarge() {
  return (
    <AICatLottieViz
      bg="/lotties/sales-insights-bg.svg"
      src="/lotties/ai-catalogue/sales-insights.json"
      label="Sales Insights & Recommendations animation"
    />
  );
}

function VisionVizLarge() {
  // Card title is "Menu Engineering" — kept the legacy function name
  // (VisionVizLarge) so the existing AICatalogue card array doesn't
  // need to be reshuffled.
  return (
    <AICatLottieViz
      bg="/lotties/menu-engineering-bg.svg"
      src="/lotties/ai-catalogue/menu-engineering.json"
      label="Menu Engineering animation"
    />
  );
}

function CopilotVizLarge() {
  // Card title is "Staff Scheduling Optimization" — legacy function
  // name from when this slot was a hypothetical Manager Copilot.
  return (
    <AICatLottieViz
      bg="/lotties/staff-scheduling-bg.svg"
      src="/lotties/ai-catalogue/staff-scheduling.json"
      label="Staff Scheduling Optimization animation"
    />
  );
}

function CampaignsVizLarge() {
  return (
    <AICatLottieViz
      bg="/lotties/ai-campaigns-bg.svg"
      src="/lotties/ai-catalogue/ai-campaigns.json"
      label="AI Campaign Management animation"
    />
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
      {/* overflow:visible so the "See the platform" CTA's outer 1px ring + drop
          shadow render fully on phase 3. Decorative SoftGlow is small enough
          (and positioned with negative offsets) that body { overflow-x: clip }
          handles horizontal bleed. */}
      <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", alignItems: "center", overflow: "visible" }}>
        <SoftGlow color={phase === 3 ? T.matcha500 : T.persimmon400} position="top-right" opacity={phase === 3 ? 0.12 : 0.2} />
        <Container>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 80, alignItems: "center", position: "relative", zIndex: 1 }}>
            <div>
              {/*
                Staggered bidirectional mask reveal: label → title → body.
                Each piece is wrapped in BiMaskReveal (clip-path mask,
                bottom-up reveal / top-down hide). The whole block sits
                inside a PhaseTransition keyed on `phase` — when the user
                scrolls and the phase advances, the outgoing copy fades to
                opacity 0 while a fresh incoming copy plays its masked
                reveals in parallel. No more harsh blank gap.

                The "See the platform" CTA uses FadeReveal (opacity + lift
                only, no clip-path) so its outer 1px ring + drop shadow
                aren't clipped by the mask boundary.
              */}
              <PhaseTransition phaseKey={phase} duration={700}>
                <BiMaskReveal delay={0}>
                  <SectionLabel label="The disconnect problem" />
                </BiMaskReveal>
                <BiMaskReveal delay={140}>
                  <Heading size={64} color="currentColor" style={{ marginBottom: 24 }}>
                    {phase === 3 ? (<>Until <span style={{ color: T.persimmon600 }}>now</span>.</>) : p.head}
                  </Heading>
                </BiMaskReveal>
                <BiMaskReveal delay={280}>
                  <Body size={18} color="currentColor" style={{ maxWidth: 480, opacity: 0.7 }}>{p.body}</Body>
                </BiMaskReveal>
                {phase === 3 && (
                  <FadeReveal delay={420}>
                    <div style={{ marginTop: 32 }}>
                      <FlowCTA>See the platform</FlowCTA>
                    </div>
                  </FadeReveal>
                )}
              </PhaseTransition>
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
  // Format cards: rich PNG background (textured brand thumbnail from Figma)
  // layered with an SVG icon on top. PNG handles the atmospheric look; SVG
  // icon stays vector-sharp and renders at a fixed width so the natural
  // aspect ratio of each illustration is preserved — no squishing.
  const formats = [
    {
      id: "enterprise",
      title: "Multi-brand & enterprise",
      body: "Unified operations, reporting, and guest data across every brand, location, and ordering channel.",
      cta: "Enterprise on Nova",
      bg: "/formats/enterprise.png",
      icon: "/formats/icon-enterprise.svg",
      iconWidth: 130, // tuned per illustration so each reads at a similar visual weight
    },
    {
      id: "full-service",
      title: "Full-service & Fine dining",
      body: "Handheld ordering, intelligent floor management, and connected guest experiences.",
      cta: "Full-service on Nova",
      bg: "/formats/full-service.png",
      icon: "/formats/icon-full-service.svg",
      iconWidth: 130,
    },
    {
      id: "qsr",
      title: "Quick service & Drive thru",
      body: "AI Voice, Vision AI, and real-time POS and kitchen synchronization for high-speed operations.",
      cta: "Quick-service on Nova",
      bg: "/formats/quick-service.png",
      icon: "/formats/icon-quick-service.svg",
      iconWidth: 110,
    },
    {
      id: "cafe",
      title: "Cafes, Bars & Bakeries",
      body: "Launch quickly, update menus instantly, and operate on one unified AI-native platform.",
      cta: "Cafes & bars on Nova",
      bg: "/formats/cafes.png",
      icon: "/formats/icon-cafes.svg",
      iconWidth: 110,
    },
  ];
  return (
    // Section starts in DARK mode so the dark canvas continues through
    // AI Catalogue → into the top of this section (eyebrow + headline)
    // without an early theme flip. The transition to light is triggered
    // by an absolutely-positioned [data-section-theme="light"] sentinel
    // placed `calc(100vh + 80px)` below the section's top edge — when
    // that sentinel's top crosses the viewport bottom (i.e. when the
    // user has scrolled ~80px past where AI Catalogue ends), the
    // wrapper transitions to light. The 80px buffer ensures any
    // lingering AI Catalogue cards have fully cleared the top edge of
    // the viewport before the canvas crossfades, so the dark cards
    // never end up briefly sitting against a light bg.
    //
    // The cards grid stays inside the dark section without its own
    // light sentinel wrapper — they render in dark mode while AI
    // Catalogue is exiting (currentColor handles text), then transition
    // to light naturally as the wrapper theme flips. Format cards use
    // currentColor + opacity for title/body so they read clean in both.
    <section data-section-theme="dark" style={{ padding: "120px 0", position: "relative" }}>
      {/* Delayed light-mode sentinel — empty absolute marker, 1×1 px,
          positioned 100vh + 80px below the section's top. */}
      <div
        data-section-theme="light"
        aria-hidden
        style={{
          position: "absolute",
          top: "calc(100vh + 80px)",
          left: 0,
          width: 1,
          height: 1,
          pointerEvents: "none",
        }}
      />
      <Container>
        {/* Eyebrow + centered headline + centered body. Headline + body
            use currentColor so they fade with the wrapper's theme
            transition automatically — eyebrow stays persimmon, which
            reads on both dark and light backgrounds. */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <ScrollReveal>
            <div style={{ marginBottom: 16 }}>
              <span
                style={{
                  display: "inline-block",
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: T.persimmon600,
                  fontWeight: 600,
                }}
              >
                Built for your format
              </span>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <Heading size={52} color="currentColor" style={{ marginBottom: 20, maxWidth: 980, marginLeft: "auto", marginRight: "auto" }}>
              Whatever your restaurant looks like, Nova runs on it.
            </Heading>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <Body color="currentColor" style={{ maxWidth: 760, margin: "0 auto", opacity: 0.7 }}>
              Built for QSR, fast casual, café, full service, franchise, and enterprise at every stage of growth.
            </Body>
          </ScrollReveal>
        </div>
        {/* Format cards cascade in 90ms apart via StaggerGroup.
            alignItems:stretch + height:100% on the wrappers makes every
            card match the tallest one in the row regardless of body
            length. Theme is driven by the absolute light sentinel above
            (top: calc(100vh + 80px)) instead of wrapping the cards in
            their own data-section-theme — keeps the flip from firing
            while the AI Catalogue cards are still on screen. */}
        <StaggerGroup
          perItemDelay={90}
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, alignItems: "stretch" }}
        >
          {formats.map((f) => (
            <ScrollReveal key={f.id} style={{ height: "100%" }}>
              <FormatCard {...f} />
            </ScrollReveal>
          ))}
        </StaggerGroup>
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

function FormatCard({ title, body, cta, bg, icon, iconWidth = 120 }) {
  // Figma 2026 design: rich PNG thumbnail background (atmospheric brand
  // gradient + texture) layered with an SVG icon centered on top. SVG is
  // rendered at a FIXED width + auto height so its natural aspect ratio is
  // preserved — no squishing of the steering wheel, bell+hand, etc.
  //
  // Hover: bg + icon scale together (1.06) inside the rounded overflow
  // boundary for a smooth zoom feel.
  // CTA is pinned to the column bottom via marginTop:auto so all 4 cards'
  // "X on Nova" links sit on the same baseline.
  return (
    <article
      className="format-card"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        height: "100%",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        transition: "transform 320ms cubic-bezier(0.2,0,0,1)",
      }}
    >
      {/* Branded thumbnail — PNG bg + SVG icon layered. Both live inside
          the scaling wrapper so hover zoom stays clipped by the rounded
          boundary; they zoom together. */}
      <div
        className="format-card-thumb"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "216 / 295",
          borderRadius: 22,
          overflow: "hidden",
          // Match the section canvas (light) so any PNG corner transparency
          // blends into the page rather than punching a dark hole through.
          background: "transparent",
        }}
      >
        <div
          className="format-card-thumb-inner"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            willChange: "transform",
          }}
        >
          {/* PNG bg — full cover. */}
          <img
            src={bg}
            alt=""
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          {/* SVG icon — fixed width, auto height to preserve aspect ratio. */}
          <img
            src={icon}
            alt=""
            style={{
              position: "relative",
              width: iconWidth,
              height: "auto",
              display: "block",
              filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.25))",
            }}
          />
        </div>
      </div>

      {/* Text block — title, 2-line body, persimmon link. */}
      <div
        style={{
          padding: "12px 6px 0",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "-0.005em",
              // currentColor inherits the wrapper's transitioning text
              // color — bone-900 in light mode, bone-100 (whisper) in
              // dark. Means the card title fades along with the rest of
              // the section's text when the dark→light theme swap fires.
              color: "currentColor",
              lineHeight: 1.56,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: "-0.005em",
              // currentColor + 60% opacity → roughly matches the old
              // T.inkMuted (bone-700) in light mode and lands on
              // bone-100 @ alpha 60 in dark mode as requested.
              color: "currentColor",
              opacity: 0.6,
              lineHeight: 1.4,
            }}
          >
            {body}
          </div>
        </div>
        {/* marginTop: auto pins the CTA to the bottom so all 4 cards' links
            align on the same baseline regardless of body length. */}
        <a
          href="#"
          className="format-card-cta"
          style={{
            marginTop: "auto",
            paddingTop: 16,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: FONT_BODY,
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "-0.005em",
            color: T.persimmon600,
            textDecoration: "none",
            lineHeight: 1.71,
          }}
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
      title: "Plug into your stack. Keep what works.",
      // Trimmed so the body wraps to the same height as steps 02 / 03 —
      // the HowItWorks lottie below is sized to remaining vertical space,
      // so an oversized body was shrinking the lottie on step 01.
      body: "Nova's digital front sits on top of the systems you already run. No rip-and-replace — roll it out on your timeline.",
      accent: T.persimmon500,
    },
    {
      kicker: "Step 02 · Unify",
      title: "Every channel, one data layer.",
      body: "Run POS, kiosk, drive-thru, app, and online ordering on one connected data platform.",
      accent: T.cobalt500,
    },
    {
      kicker: "Step 03 · Improve",
      title: "AI runs the room with you.",
      body: "AI continuously optimizes operations, guest engagement, revenue, and labor using live restaurant data.",
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
          {/* TOP: title + body only — centered. No section label, stepper, or kicker.
              Wrapped in PhaseTransition so step changes crossfade rather than
              hard-snap: outgoing copy fades to opacity 0 while the incoming
              copy mounts and plays its BiMaskReveal bottom-up motion. */}
          <div style={{ paddingTop: 96, paddingBottom: 24, textAlign: "center", flexShrink: 0 }}>
            <PhaseTransition phaseKey={stepIndex} duration={700}>
              <BiMaskReveal delay={0}>
                <div
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 48,
                    // 1.15 + paddingBottom 6 gives descenders ("g" in
                    // "Plug", "y" in "your") enough room below the
                    // baseline to clear BiMaskReveal's clip-path. At
                    // lineHeight 1.08 they were sitting outside the
                    // element box and getting cropped.
                    lineHeight: 1.15,
                    paddingBottom: 6,
                    letterSpacing: "-0.035em",
                    fontWeight: 500,
                    color: "currentColor",
                    // 48px top margin separates the title from the floating header
                    marginTop: 48,
                    marginBottom: 14,
                    maxWidth: 880,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  {step.title}
                </div>
              </BiMaskReveal>
              <BiMaskReveal delay={160}>
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 16,
                    lineHeight: 1.55,
                    color: "currentColor",
                    opacity: 0.7,
                    maxWidth: 620,
                    margin: "0 auto",
                    marginBottom: 48,
                  }}
                >
                  {step.body}
                </div>
              </BiMaskReveal>
            </PhaseTransition>
          </div>

          {/* BOTTOM: visual fills remaining vertical space. Replaces the
              former hand-rolled dark product-mock card — the Lottie stage
              IS the visual now, sized to fit available height as a 1:1
              square (the artist authored the file at 400×400). */}
          <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 40, minHeight: 0 }}>
            <HowVisual stepIndex={stepIndex} />
          </div>
        </Container>
      </div>
    </section>
  );
}

// =========================================================
//  HOWVISUAL — Scroll-synced Lottie stage for HowItWorks
//
//  Replaces the hand-rolled dark product-mock card with the artist's
//  plug-in-stack lotties. Architecture:
//
//  - 3 IDLE lotties (P01, P02, P03) — one per step. All three mount once
//    on first render and loop forever; opacity toggles which one is
//    visible. Keeps memory steady and avoids re-fetch flashes on phase
//    swap.
//  - 4 TRANSITION lotties (forward P01→P02, P02→P03, and the two
//    reverses) — also pre-mounted with autoplay=false. When the user
//    crosses a step boundary, we flip the matching transition's
//    `playKey` to fire `goToAndPlay(0)` and fade it in on top of the
//    idles. On the lottie's `complete` event we hand back to the idle of
//    the destination step.
//
//  Direction rule: forward scroll plays the matching forward transition,
//  backward scroll plays the matching reverse. If the user crosses two
//  boundaries in quick succession we let the in-flight transition finish
//  (text already crossfaded ahead of it — that's fine) and then chain
//  another transition from the just-reached step toward the current
//  stepIndex. So slow scroll = clean per-phase animation; fast scroll =
//  the lottie eventually catches the text up via chained transitions.
// =========================================================
function HowVisual({ stepIndex }) {
  // `activeIdle` = which idle Lottie is currently visible. We only flip
  // this AFTER the transition lottie reaches its last frame — that way
  // the visual swap lands on the artist's intended hand-off frame, not
  // at scroll-cross time.
  const [activeIdle, setActiveIdle] = useState(0);
  // Active transition descriptor or null. `key` matches one of the four
  // pre-mounted transition lotties; `playKey` re-fires the LottiePlayer's
  // replay effect when bumped; `destStep` is the idle that takes over
  // when the transition reaches its final frame.
  const [transition, setTransition] = useState(null);
  // Latest stepIndex driven by scroll — kept in a ref so we can read it
  // synchronously from inside lottie's `complete` event without making
  // the effect's dep list noisy.
  const prevStepRef = useRef(0);

  // Imperative refs to every idle and transition lottie. The transition
  // hand-off relies on `idleRefs[dest].current.goToAndPlay(0)` being
  // called synchronously, BEFORE we flip opacity — otherwise the React
  // commit makes the dest idle visible for one frame at whatever frame
  // it happened to be looping at (the "blink" the user saw).
  const idleRefs = useRef([null, null, null]);
  const transitionRefs = useRef({});

  // Track the previously-visible layer so we can reset it to frame 0
  // the moment it becomes invisible. Without this, any layer that's
  // already been played (idle P01 after autoplaying then pausing
  // mid-loop, or any transition after completing at frame 120) stays
  // pinned at its stale frame — and the NEXT time it becomes visible
  // there's a one-frame window where the user sees that stale frame
  // before the imperative goToAndPlay(0) paint catches up. That window
  // was the reverse-scroll blink.
  const prevVisibleIdleRef = useRef(0);
  const prevVisibleTransitionRef = useRef(null);

  // Build the file slug for a single-step transition between two steps.
  const slugFor = (from, to) => {
    const forward = to > from;
    return forward
      ? `p0${from + 1}-p0${to + 1}`
      : `reverse-p0${from + 1}-p0${to + 1}`;
  };

  // React to scroll-driven stepIndex changes. If no transition is in
  // flight, kick off the appropriate single-step transition; otherwise
  // just remember the new stepIndex — the in-flight transition's
  // onComplete will chain forward toward it.
  useEffect(() => {
    const prev = prevStepRef.current;
    if (prev === stepIndex) return;
    prevStepRef.current = stepIndex;
    if (transition) return; // chained handling lives in onComplete
    const next = prev + (stepIndex > prev ? 1 : -1);
    const transKey = slugFor(prev, next);
    // Synchronously prime the incoming transition at frame 0 BEFORE we
    // flip its `paused` and opacity via setState. Otherwise — if this
    // transition has been played before — it's still sitting at its
    // last frame (frame 120), and the React commit briefly shows that
    // stale frame before the playKey effect catches up.
    transitionRefs.current[transKey]?.goToAndPlay(0, true);
    setTransition({
      key: transKey,
      playKey: Date.now(),
      destStep: next,
    });
  }, [stepIndex, transition]);

  // Outgoing-layer cleanup: the moment a layer becomes invisible, snap
  // its SVG to frame 0 + stop. That way the NEXT time it's activated
  // there's no window where it briefly shows a stale frame. Runs after
  // paint, but that's fine — the layer is already invisible by then.
  useEffect(() => {
    const currentIdle = transition ? null : activeIdle;
    const prevIdle = prevVisibleIdleRef.current;
    if (prevIdle !== null && prevIdle !== currentIdle) {
      try { idleRefs.current[prevIdle]?.goToAndStop(0, true); } catch (e) { /* noop */ }
    }
    prevVisibleIdleRef.current = currentIdle;

    const currentTrans = transition?.key || null;
    const prevTrans = prevVisibleTransitionRef.current;
    if (prevTrans && prevTrans !== currentTrans) {
      try { transitionRefs.current[prevTrans]?.goToAndStop(0, true); } catch (e) { /* noop */ }
    }
    prevVisibleTransitionRef.current = currentTrans;
  }, [activeIdle, transition]);

  const onTransitionComplete = () => {
    if (!transition) return;
    const dest = transition.destStep;
    const latest = prevStepRef.current;

    if (dest === latest) {
      // SYNCHRONOUSLY prime the dest idle at frame 0 + playing BEFORE we
      // flip React state. By the time the next render commits and the
      // idle becomes visible, the lottie is already past frame 0 by a
      // tick or two — but critically it's playing from the matching
      // "at rest" start, not catching mid-loop. This is what kills the
      // blink: the transition's last frame and the idle's frame 0 are
      // the same visual, so the hard-cut between them is invisible.
      idleRefs.current[dest]?.goToAndPlay(0, true);
      setActiveIdle(dest);
      setTransition(null);
    } else {
      // User scrolled past us mid-transition. Chain one more single-step
      // transition toward the latest step. Prime the chained transition
      // at frame 0 synchronously so the swap from the just-completed
      // transition (now at its last frame 120) to the next transition
      // is invisible — both should depict the same intermediate step.
      const nextDest = dest + (latest > dest ? 1 : -1);
      const nextKey = slugFor(dest, nextDest);
      transitionRefs.current[nextKey]?.goToAndPlay(0, true);
      setActiveIdle(dest);
      setTransition({
        key: nextKey,
        playKey: Date.now(),
        destStep: nextDest,
      });
    }
  };

  const idles = [0, 1, 2];
  const transitionKeys = [
    "p01-p02",
    "p02-p03",
    "reverse-p02-p01",
    "reverse-p03-p02",
  ];

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        aspectRatio: "1 / 1",
        maxWidth: "100%",
        maxHeight: "100%",
        margin: "0 auto",
      }}
    >
      {/* Idle layer — all 3 mounted, only the active one visible.
          Hard-cut opacity (no transition) plus the synchronous
          goToAndPlay(0) in onTransitionComplete means the swap from
          transition lottie → idle lottie lands on two matching frames.
          Inactive idles are paused to keep them out of the CPU loop. */}
      {idles.map((i) => {
        const visible = !transition && activeIdle === i;
        return (
          <LottiePlayer
            key={`idle-${i}`}
            ref={(el) => { idleRefs.current[i] = el; }}
            src={`/lotties/howitworks/p0${i + 1}.json`}
            loop
            autoplay={i === 0}
            paused={!visible}
            ariaLabel={`Plug-in-stack step ${i + 1} idle animation`}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: visible ? 1 : 0,
              pointerEvents: "none",
            }}
          />
        );
      })}
      {/* Transition layer — all 4 mounted paused; the active one is
          visible (hard cut) and replays from frame 0 via `playKey`
          whenever it becomes active. On `complete` it hands off to the
          dest idle. */}
      {transitionKeys.map((tKey) => {
        const active = transition?.key === tKey;
        return (
          <LottiePlayer
            key={`trans-${tKey}`}
            ref={(el) => { transitionRefs.current[tKey] = el; }}
            src={`/lotties/howitworks/${tKey}.json`}
            loop={false}
            autoplay={false}
            paused={!active}
            playKey={active ? transition.playKey : 0}
            onComplete={active ? onTransitionComplete : undefined}
            ariaLabel={`Plug-in-stack transition ${tKey}`}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: active ? 1 : 0,
              pointerEvents: "none",
            }}
          />
        );
      })}
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
          <ScrollReveal>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {/* Override SectionLabel's default 28px bottom margin so the
                  visual gap to the headline below lands at exactly 16px. */}
              <SectionLabel label="Customer outcomes" color={T.matcha600} marginBottom={16} />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <Heading size={56} color="currentColor" style={{ marginBottom: 20, lineHeight: 1.20 }}>
              What operators see in the
              <br />
              <span style={{ color: T.persimmon600 }}>first 90 days</span>.
            </Heading>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <Body color="currentColor" style={{ maxWidth: 680, margin: "0 auto", opacity: 0.7 }}>
              From enterprise chains consolidating eleven contracts to emerging brands launching their first AI-native location.
            </Body>
          </ScrollReveal>
        </div>

        {/* Three expandable panels. The ScrollReveal wrapper is the actual
            flex child of the row container, so the size transition has to
            live on it — animating the inner OutcomePanel's flex while the
            wrapper jumps was the cause of the "things jumping around" feel.
            We override ScrollReveal's transition string to include flex,
            and compute the per-item stagger delay manually since we're not
            wrapping in StaggerGroup. Inner OutcomePanel stays at 100% width
            of its wrapper and no longer animates flex itself. */}
        <div style={{ display: "flex", gap: 16, height: 560, alignItems: "stretch" }}>
          {cards.map((c, i) => {
            const isExpanded = expanded === i;
            const stagDelay = i * 100;
            return (
              <ScrollReveal
                key={c.headline}
                delay={stagDelay}
                style={{
                  display: "flex",
                  flex: isExpanded ? "1 1 0" : "0 0 240px",
                  minWidth: 0,
                  // Override ScrollReveal's internal transition string so the
                  // wrapper smoothly animates `flex` alongside the reveal
                  // properties. Smooth ease-out (no spring overshoot) keeps
                  // sibling panels from shimmying as the expansion settles.
                  transition:
                    `opacity ${REVEAL_DURATION}ms ${REVEAL_EASE} ${stagDelay}ms, ` +
                    `transform ${REVEAL_DURATION}ms ${REVEAL_EASE} ${stagDelay}ms, ` +
                    `flex 640ms cubic-bezier(0.22, 1, 0.36, 1)`,
                }}
              >
                <OutcomePanel
                  card={c}
                  expanded={isExpanded}
                  onActivate={() => setExpanded(i)}
                />
              </ScrollReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function OutcomePanel({ card, expanded, onActivate }) {
  const { brand, kicker, headline, quote, who, role, photoBg, photoAlt, features } = card;
  // Click-to-expand. Enter/Space activate via keyboard for accessibility.
  // The actual size change is owned by the ScrollReveal wrapper above so
  // OutcomePanel just fills 100% of whatever width its wrapper gives it —
  // animating flex in two places was what made the row "jump".
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
        // Fill the ScrollReveal wrapper. Wrapper owns the size transition.
        flex: "1 1 auto",
        width: "100%",
        minWidth: 0,
        background: T.surface,
        // Border defaults to T.hairline (light mode); CSS `.outcome-panel`
        // rule swaps it to a lighter midnight gray when wrapper is dark.
        border: `1px solid ${expanded ? T.divider : T.hairline}`,
        borderRadius: 28,
        overflow: "hidden",
        display: "flex",
        cursor: "pointer",
        transition:
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
    <section data-section-theme="dark" style={{ color: T.whisper, padding: "120px 0", position: "relative", overflow: "visible" }}>
      {/* Decorative glows removed — the dark canvas reads cleaner without
          the persimmon/nebula blooms competing with the CTA. */}
      <Container narrow>
        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* "Book a demo" eyebrow with the persimmon dot removed — the
              section's intent is already clear from the Display headline
              and the primary CTA below it. */}
          <ScrollReveal delay={80}>
            <Display size={72} color={T.whisper}>
              See how modern restaurant operations <span style={{ color: T.persimmon500 }}>run on Nova</span>.
            </Display>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <Body color={T.whisperSoft} size={19} style={{ maxWidth: 620, margin: "32px auto 0" }}>
              Bring your operations, technology, or digital team. We&apos;ll show how Nova simplifies restaurant operations through one connected AI-native platform.
            </Body>
          </ScrollReveal>
          {/* CTA row uses FadeReveal so the FlowCTA's gradient bg + ring + drop
              shadow render without any clip-path interference. */}
          <FadeReveal delay={240}>
            <div style={{ marginTop: 44, display: "flex", gap: 12, justifyContent: "center" }}>
              <FlowCTA onDark lottieSrc="/lotties/book-a-demo-trailing-v2.json">Book a demo</FlowCTA>
              <Button variant="invertGhost">Talk to sales</Button>
            </div>
          </FadeReveal>
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
            <Button
              variant="primary"
              lottieSrc="/lotties/book-a-demo-arrowless-v2.json"
              style={{
                // -2px horizontal padding (20 → 18) so the Lottie's authored
                // canvas aligns perfectly with the button bounds.
                padding: "10px 18px",
              }}
            >
              Book a demo
            </Button>
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
