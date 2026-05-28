"use client";
import { useEffect, useState } from "react";

/**
 * Track current scroll position.
 * Used by the sticky-glass nav to compress on scroll.
 */
export function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}

/**
 * Watch sections with [data-section-theme] and report the currently active
 * theme (light | dark) based on which section is in the scroll "hot zone".
 *
 * The hot zone is a horizontal band between 30% and 60% from the top of the
 * viewport (controlled via rootMargin). When a section's body crosses into
 * that band, it becomes the active theme.
 *
 * This is the Mercury-style "tokenized theme on scroll" pattern — the page's
 * background, text color, etc. animate via CSS transitions tied to these
 * token values; sections themselves don't paint their own background.
 */
export function useScrollTheme(initial = "light") {
  const [theme, setTheme] = useState(initial);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sections = document.querySelectorAll("[data-section-theme]");
    if (!sections.length) return;

    // Bottommost-intersecting picker. Walk sections in document order; the
    // last one with any overlap with the viewport wins. This means the
    // moment a new section's top edge crosses the bottom of the viewport,
    // its theme becomes active — exactly the "fire as it enters viewframe"
    // behavior the design calls for. The wrapper's 900ms color transition
    // smooths the swap so there's no hard cut at the section boundary.
    let lastTheme = initial;
    const update = () => {
      const vh = window.innerHeight;
      let active = null;
      sections.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) active = el; // later in DOM overrides
      });
      if (
        active &&
        active.dataset.sectionTheme &&
        active.dataset.sectionTheme !== lastTheme
      ) {
        lastTheme = active.dataset.sectionTheme;
        setTheme(lastTheme);
      }
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [initial]);
  return theme;
}

/**
 * Track mouse position within a referenced element and return parallax-ready
 * offsets — useful for slowly rotating / translating a background visual
 * (like the AI spiral) as the cursor moves over the section.
 *
 * @param {React.RefObject} ref - the bounding element to track mouse within
 * @param {object} options
 * @param {number} options.maxOffset - max pixels to translate by (default 60)
 * @param {number} options.maxRotate - max degrees to rotate (default 6)
 * @returns {{x: number, y: number, rotate: number, active: boolean}}
 */
export function useMouseParallax(ref, { maxOffset = 60, maxRotate = 6 } = {}) {
  const [pos, setPos] = useState({ x: 0, y: 0, rotate: 0, active: false });
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      // normalize cursor position to [-1, 1] around the section center
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      setPos({
        x: nx * maxOffset,
        y: ny * maxOffset * 0.5, // dampen vertical motion
        rotate: nx * maxRotate,
        active: true,
      });
    };
    const onLeave = () => setPos((p) => ({ ...p, active: false, x: 0, y: 0, rotate: 0 }));
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref, maxOffset, maxRotate]);
  return pos;
}

/**
 * Track progress (0..1) through a section that's taller than the viewport.
 * Used by the "Systems that never spoke" sticky-scroll swap.
 * @param {React.RefObject} ref - Ref to the outer (tall) section element.
 */
export function useSectionProgress(ref) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);
  return progress;
}
