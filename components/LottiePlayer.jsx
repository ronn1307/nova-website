"use client";

import { useEffect, useRef, useState } from "react";

/**
 * LottiePlayer · client-only, lazy-loaded, SSR-safe.
 *
 * Both the lottie-react module AND the JSON animation are loaded inside
 * useEffect — so nothing Lottie-related runs during Next.js' SSR pass.
 * That dodges every hydration mismatch class the next/dynamic approach
 * was hitting.
 *
 * Honours `prefers-reduced-motion` automatically — if the user has
 * reduced motion enabled the animation stays paused; we render the
 * fallback (which can be a static SVG poster for that slot).
 */
export default function LottiePlayer({
  src,
  loop = true,
  autoplay = true,
  fallback = null,
  style,
  className,
  ariaLabel,
}) {
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let anim = null;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    (async () => {
      try {
        const [{ default: lottie }, json] = await Promise.all([
          import("lottie-web"),
          fetch(src).then((r) => r.json()),
        ]);
        if (cancelled || !containerRef.current) return;

        anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop,
          autoplay,
          animationData: json,
          rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
        });
        animRef.current = anim;
        setReady(true);
      } catch (e) {
        // swallow — fallback poster stays visible
      }
    })();

    return () => {
      cancelled = true;
      if (animRef.current) {
        try { animRef.current.destroy(); } catch (e) { /* noop */ }
        animRef.current = null;
      }
    };
  }, [src, loop, autoplay]);

  return (
    <div
      className={className}
      style={style}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
    >
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          display: ready ? "block" : "none",
        }}
      />
      {!ready && fallback}
    </div>
  );
}
