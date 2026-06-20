"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

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
 *
 * Extras:
 * - `loop={false}` plays once and fires `onComplete` when the final frame
 *   is reached. Used by the HowItWorks scroll-synced transition layer to
 *   know when to hand back to the idle Lottie.
 * - `speed` multiplies playback rate (default 1).
 * - `playKey` — bumping this value rewinds the animation to frame 0 and
 *   plays it. Works for both loop=true and loop=false. Lets one mounted
 *   player handle repeated one-shots without remount churn.
 * - `paused` — declarative pause/play toggle. When `paused=true`, the
 *   animation stops at its current frame (handy for keeping invisible
 *   idle layers from burning CPU).
 * - Forwarded ref exposes imperative `goToAndPlay`, `goToAndStop`,
 *   `play`, `pause` so a parent can do exact-timing handoffs (eg.
 *   reset the dest idle to frame 0 synchronously, before flipping
 *   opacity, so the swap lands on a known frame instead of catching
 *   the idle mid-loop).
 */
const LottiePlayer = forwardRef(function LottiePlayer(
  {
    src,
    loop = true,
    autoplay = true,
    fallback = null,
    style,
    className,
    ariaLabel,
    onComplete,
    speed = 1,
    playKey,
    paused = false,
  },
  ref
) {
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const [ready, setReady] = useState(false);
  // Stash the latest onComplete in a ref so we don't have to re-init the
  // animation when the parent passes a new callback closure each render.
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useImperativeHandle(
    ref,
    () => ({
      goToAndPlay: (frame, isFrame = true) =>
        animRef.current?.goToAndPlay(frame, isFrame),
      goToAndStop: (frame, isFrame = true) =>
        animRef.current?.goToAndStop(frame, isFrame),
      play: () => animRef.current?.play(),
      pause: () => animRef.current?.pause(),
      // Returns the current absolute frame index of the animation, or 0
      // if it hasn't loaded yet. Used by BenefitsVisual to sync the
      // light/dark P03 variants — when the page theme flips while the
      // user is on P03, we read the active variant's frame and start the
      // other one from the same frame so the visual continues without
      // restarting mid-loop.
      getCurrentFrame: () => animRef.current?.currentFrame ?? 0,
      isReady: () => !!animRef.current,
    }),
    []
  );

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
        anim.setSpeed(speed);
        if (!loop) {
          anim.addEventListener("complete", () => {
            if (onCompleteRef.current) onCompleteRef.current();
          });
        }
        // Apply initial paused state if set
        if (paused) {
          try { anim.pause(); } catch (e) { /* noop */ }
        }
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
    // `paused` is intentionally NOT in deps — we apply it on init above,
    // then react to changes via the dedicated effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, loop, autoplay, speed]);

  // Pause/play in response to paused prop changes.
  useEffect(() => {
    if (!animRef.current) return;
    try {
      if (paused) animRef.current.pause();
      else animRef.current.play();
    } catch (e) { /* noop */ }
  }, [paused, ready]);

  // Replay-on-key: bumping `playKey` rewinds the animation to frame 0 and
  // plays it. Used by the HowItWorks transition layer to re-fire the
  // same one-shot multiple times without remount.
  useEffect(() => {
    if (!animRef.current) return;
    try {
      animRef.current.goToAndPlay(0, true);
    } catch (e) { /* noop */ }
  }, [playKey]);

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
});

export default LottiePlayer;
