"use client";

import { useEffect, useRef } from "react";

/**
 * DotLottiePlayer · WASM-renderer alternative to LottiePlayer.
 *
 * Built directly on the lower-level @lottiefiles/dotlottie-web class
 * (not the React wrapper) so we can own the canvas + manage bitmap
 * sizing via a ResizeObserver. The React wrapper's internal
 * auto-resize never fires for our absolutely-positioned, opacity-
 * stacked containers — the canvas stays at the HTML default 300×150
 * bitmap even though its CSS size is 394×414, so the rendered frames
 * scale down to a 300×150 region and read as invisible inside the
 * larger container.
 *
 * Why dotlottie-web instead of lottie-web here: some of the artist's
 * AI Catalogue lotties (Upsell + Sales Insights) exercise precomp
 * evaluation paths that lottie-web's classic SVG/canvas renderer
 * fails to populate — the precomp's inner `<g>` ends up empty. The
 * dotlottie wasm renderer evaluates the same files correctly.
 *
 * For the AI Catalogue cards we don't need imperative play/pause/seek
 * (those are only used by the scroll-synced state machines in
 * HowItWorks / Benefits, which keep using LottiePlayer). So this
 * component intentionally stays minimal: load + autoplay + loop.
 */
export default function DotLottiePlayer({
  src,
  loop = true,
  autoplay = true,
  style,
  className,
  ariaLabel,
}) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Resize the canvas bitmap to match its CSS box. Honour devicePixelRatio
    // so we render at native pixel density and don't end up with blurry
    // wasm-rasterized output on retina screens.
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        // Ask the wasm renderer to re-paint at the new bitmap size.
        if (animRef.current && typeof animRef.current.resize === "function") {
          try { animRef.current.resize(); } catch (e) { /* noop */ }
        }
      }
    };

    // Initial size before instantiating so the first paint lands correctly.
    resize();

    // Observe the canvas for any layout-driven size changes (viewport
    // resize, parent re-layout, etc.) and re-fit the bitmap.
    observerRef.current = new ResizeObserver(() => resize());
    observerRef.current.observe(canvas);

    (async () => {
      try {
        const { DotLottie } = await import("@lottiefiles/dotlottie-web");
        if (cancelled) return;
        animRef.current = new DotLottie({
          canvas,
          src,
          loop,
          autoplay,
        });
        // After load, force one more resize call in case the canvas's
        // computed size changed between mount and wasm-ready.
        animRef.current.addEventListener("load", () => {
          resize();
        });
      } catch (e) {
        // swallow
      }
    })();

    return () => {
      cancelled = true;
      if (observerRef.current) {
        try { observerRef.current.disconnect(); } catch (e) { /* noop */ }
      }
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
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
