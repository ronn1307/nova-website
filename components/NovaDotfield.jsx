"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * NovaDotfield · GPU-accelerated cursor "vacuum" dot grid.
 *
 * One THREE.Points object holds the entire grid as vertices. The vertex
 * shader (run once per dot per frame on the GPU) pushes each dot away from
 * the cursor; the fragment shader fades dots near the cursor to zero so the
 * center reads as an empty pocket. Cursor position is eased on the CPU,
 * which gives the soft trailing "spring" feel without per-dot physics state.
 *
 * Three interactions:
 *   1. Cursor vacuum    — dots flee + fade around the cursor (uMouse + uPush).
 *   2. Liquid return    — when the cursor is stationary, uPush scales toward
 *                          zero on a cubic ease-OUT curve so dots move fast
 *                          first then decelerate as they approach the grid
 *                          (true liquid settle). When the cursor moves again
 *                          uPush springs back to full.
 *   3. Click burst      — pointerdown plays an attack/release envelope: the
 *                          dots snap APART from the click point creating a
 *                          vacuum hole (~135ms quick rise), then ease back
 *                          together over ~615ms cubic ease-out. Burst pushes
 *                          positions only — alpha is untouched so the dots
 *                          stay visible through the whole motion.
 *
 * Renders as `position: absolute; inset: 0` inside its parent with a fully
 * transparent WebGL canvas — the parent's bg shows through, so theme-
 * transition fades on an ancestor (e.g. the wrapper's `[data-theme]` bg
 * crossfade) drive the perceived bg under the dots automatically.
 *
 * Honours `prefers-reduced-motion` — no animation, single static render.
 */
export default function NovaDotfield({
  // Slightly sparser than the original 10px grid — more breathing room,
  // less dense atmospheric feel.
  spacing = 14,
  dotSize = 2.2,
  radius = 176,
  push = 73,
  ease = 0.19,
  // 75% dot opacity — present enough to read clearly as a cream speckle,
  // still soft enough to feel atmospheric.
  baseAlpha = 0.75,
  // Soft cream. With baseAlpha 0.35 over the light canvas (#FAFAFB) this
  // composites as ~#FCF4E9 — a subtle, atmospheric warm cream tint that
  // reads as creamy speckle without pulling into peach/orange. We'll add
  // the full cream/sand ramp to Figma primitives later (this is ~cream-150
  // in the eventual scale).
  dot = 0xffe9c8,
  // bg controls the WebGL clear color (renderer.setClearColor). Pass the
  // wrapper canvas color. The renderer is OPAQUE — see the comment in the
  // renderer setup below for why we can't use a transparent canvas.
  bg = 0xfafafb,
  // bgDark is the wrapper's dark-theme canvas color. We animate the
  // clear color light↔dark over 900ms when the wrapper's [data-theme]
  // attribute flips, so the dotfield bg tracks the section's bg fade.
  bgDark = 0x171721,
  style,
  className,
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || typeof window === "undefined") return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let W = mount.clientWidth;
    let H = mount.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // OPAQUE canvas (alpha: false). Tried transparent canvases earlier so the
    // wrapper bg could show through during the theme transition — but Chrome
    // composited the canvas with straight-alpha math even with
    // premultipliedAlpha:true on the context, double-multiplying the dot
    // alpha and turning soft cream into contrasty grey (dot RGB ≈ #C2C0BF
    // instead of the expected #FCF1E5). Opaque canvas keeps all blending
    // inside the WebGL pipeline — Three.js composites in linear space, the
    // browser just blits the result, no compositor math to break.
    //
    // To preserve the theme-transition feel, we animate the clear color
    // light↔dark on a MutationObserver tied to the wrapper's [data-theme].
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(bg, 1);
    renderer.setSize(W, H);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -W / 2,
      W / 2,
      H / 2,
      -H / 2,
      0.1,
      10
    );
    camera.position.z = 1;

    // Default Three.js color management is fine now that the canvas is
    // opaque — blending happens in linear space inside WebGL, and
    // outputColorSpace=SRGB (default) maps it back to sRGB for display.
    const uniforms = {
      uMouse: { value: new THREE.Vector2(-99999, -99999) },
      uRadius: { value: radius },
      uPush: { value: push },
      uSize: { value: dotSize },
      uDpr: { value: dpr },
      uColor: { value: new THREE.Color(dot) },
      uBaseAlpha: { value: baseAlpha },
      // Click burst: position + current force (decays per-frame on the CPU).
      // Burst pushes dots outward without fading them — we want to see the
      // dots flying, not a hole at the click point.
      uBurstCenter: { value: new THREE.Vector2(-99999, -99999) },
      uBurstForce: { value: 0 },
      uBurstRadius: { value: radius * 2.4 },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      vertexShader: `
        uniform vec2  uMouse;
        uniform float uRadius;
        uniform float uPush;
        uniform float uSize;
        uniform float uDpr;
        uniform vec2  uBurstCenter;
        uniform float uBurstForce;
        uniform float uBurstRadius;
        varying float vForce;
        void main() {
          vec3 p = position;
          // --- cursor vacuum push ---
          vec2 d = p.xy - uMouse;
          float dist = length(d);
          float f = 0.0;
          if (dist < uRadius) {
            f = 1.0 - dist / uRadius;
            f = f * f * (3.0 - 2.0 * f);
            vec2 dir = dist > 0.0001 ? d / dist : vec2(0.0);
            p.xy += dir * f * uPush;
          }
          vForce = f;
          // --- click burst displacement (additive, doesn't affect alpha) ---
          if (uBurstForce > 0.0) {
            vec2 db = p.xy - uBurstCenter;
            float distB = length(db);
            if (distB < uBurstRadius) {
              float bf = 1.0 - distB / uBurstRadius;
              bf = bf * bf * (3.0 - 2.0 * bf);
              vec2 dirB = distB > 0.0001 ? db / distB : vec2(0.0);
              p.xy += dirB * bf * uBurstForce;
            }
          }
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = uSize * uDpr;
        }
      `,
      fragmentShader: `
        uniform vec3  uColor;
        uniform float uBaseAlpha;
        varying float vForce;
        void main() {
          float r = length(gl_PointCoord - vec2(0.5));
          if (r > 0.5) discard;
          float edge = smoothstep(0.5, 0.42, r);
          float alpha = uBaseAlpha * (1.0 - vForce) * edge;
          // Straight (non-premultiplied) output. The WebGL transparent
          // material composites src*alpha + dest*(1-alpha) onto the clear
          // colour, which gives a correct sRGB cream tint on display.
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });

    let points;
    function buildGrid() {
      if (points) {
        scene.remove(points);
        points.geometry.dispose();
      }
      const cols = Math.ceil(W / spacing) + 2;
      const rows = Math.ceil(H / spacing) + 2;
      const startX = -((cols - 1) * spacing) / 2;
      const startY = -((rows - 1) * spacing) / 2;
      const arr = new Float32Array(cols * rows * 3);
      let i = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          arr[i++] = startX + c * spacing;
          arr[i++] = startY + r * spacing;
          arr[i++] = 0;
        }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
      points = new THREE.Points(geo, material);
      scene.add(points);
    }
    buildGrid();

    const target = new THREE.Vector2(-99999, -99999);
    const eased = new THREE.Vector2(-99999, -99999);

    // --- liquid-return state ---
    // Track when the cursor last moved. If it's been stationary past a small
    // grace window, scale uPush down toward zero — dots gently flow back to
    // the grid even while the cursor sits in place. When the cursor moves
    // again, the scale eases back up to 1 and the vacuum returns.
    let lastMoveAt = -Infinity;
    let pushScale = 1.0;
    const STILL_GRACE_MS = 220;   // tiny pause before we start letting dots return
    const STILL_DECAY_MS = 1100;  // total time to fully decay after grace

    // --- click burst state ---
    const burstCenter = new THREE.Vector2(-99999, -99999);
    let burstStart = -Infinity;
    let burstActive = false;
    const BURST_DURATION_MS = 750;
    const BURST_STRENGTH = 240;   // peak outward push in px

    function toLocal(clientX, clientY) {
      const rect = renderer.domElement.getBoundingClientRect();
      target.x = clientX - rect.left - W / 2;
      target.y = -(clientY - rect.top - H / 2);
    }
    const onPointerMove = (e) => {
      toLocal(e.clientX, e.clientY);
      lastMoveAt = performance.now();
    };
    const onPointerLeave = () => {
      target.set(-99999, -99999);
      // Treat "left" as "stationary long ago" so the dots quickly settle.
      lastMoveAt = -Infinity;
    };
    const onPointerDown = (e) => {
      toLocal(e.clientX, e.clientY);
      burstCenter.copy(target);
      burstStart = performance.now();
      burstActive = true;
      // Also count as a fresh move so the vacuum is at full strength.
      lastMoveAt = burstStart;
    };

    if (!reduceMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave);
      window.addEventListener("pointerdown", onPointerDown, { passive: true });
    }

    // ResizeObserver tracks the parent, not the window — handles section
    // changes (sticky scroll, viewport resize, etc.) more accurately.
    const onResize = () => {
      W = mount.clientWidth;
      H = mount.clientHeight;
      if (W === 0 || H === 0) return;
      renderer.setSize(W, H);
      camera.left = -W / 2;
      camera.right = W / 2;
      camera.top = H / 2;
      camera.bottom = -H / 2;
      camera.updateProjectionMatrix();
      buildGrid();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // --- theme-tracking clear color ---
    // The wrapper component sets [data-theme="light"|"dark"] and animates its
    // own bg over 900ms. We mirror that on the WebGL clear color so the dot
    // grid bg stays in lockstep with the section bg during scroll-theme handoff.
    // Implementation: walk up from mount to find the [data-theme] host, watch
    // attribute changes, lerp current → target each frame.
    const themeHost = mount.closest("[data-theme]") || document.documentElement;
    const initialTheme = themeHost.getAttribute("data-theme") || "light";

    // Three.js Colors interpolate cleanly in linear space — Three.js stores
    // them linear under the hood and outputColorSpace=SRGB maps the
    // interpolated result back to sRGB on display.
    const lightClear = new THREE.Color(bg);
    const darkClear = new THREE.Color(bgDark);
    const currentClear = new THREE.Color().copy(
      initialTheme === "dark" ? darkClear : lightClear
    );
    let targetClear = initialTheme === "dark" ? darkClear : lightClear;
    // Apply the initial clear immediately so first paint isn't a flash.
    renderer.setClearColor(currentClear, 1);

    const onThemeChange = () => {
      const t = themeHost.getAttribute("data-theme");
      targetClear = t === "dark" ? darkClear : lightClear;
    };
    const themeObserver = new MutationObserver(onThemeChange);
    themeObserver.observe(themeHost, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Lerp constant chosen to roughly match the wrapper's 900ms cubic-bezier
    // transition. At ~60fps, k=0.04 gives ~90% completion in ~900ms.
    const CLEAR_LERP = 0.04;

    let raf;
    function frame() {
      const now = performance.now();

      // Cursor easing (soft trailing spring).
      eased.x += (target.x - eased.x) * ease;
      eased.y += (target.y - eased.y) * ease;
      uniforms.uMouse.value.set(eased.x, eased.y);

      // Liquid return: how long has the cursor been still?
      // Cubic ease-OUT — dots move fast at the start of the return then
      // decelerate as they approach the grid (speed → 0 at rest).
      // d/dt of (1-t)^3 is -3(1-t)^2, max at t=0, zero at t=1.
      const stillFor = now - lastMoveAt;
      let targetPushScale;
      if (stillFor < STILL_GRACE_MS) {
        targetPushScale = 1.0;
      } else {
        const t = Math.min((stillFor - STILL_GRACE_MS) / STILL_DECAY_MS, 1);
        const inv = 1 - t;
        targetPushScale = inv * inv * inv;
      }
      pushScale += (targetPushScale - pushScale) * 0.12;
      uniforms.uPush.value = push * pushScale;

      // Click burst — ATTACK / RELEASE envelope.
      //   t < ATTACK : quick rise from 0 → peak  (snap apart, creating vacuum)
      //   t ≥ ATTACK : long cubic ease-out from peak → 0  (slow return together)
      // Position only — vForce is untouched, so dots stay visible the whole time.
      if (burstActive) {
        const elapsed = now - burstStart;
        if (elapsed >= BURST_DURATION_MS) {
          burstActive = false;
          uniforms.uBurstForce.value = 0;
        } else {
          const t = elapsed / BURST_DURATION_MS;
          const ATTACK = 0.18; // 18% of duration for attack to peak
          let env;
          if (t < ATTACK) {
            const subT = t / ATTACK;
            // Quadratic ease-out — fast rise that decelerates into the peak
            env = 1 - (1 - subT) * (1 - subT);
          } else {
            const subT = (t - ATTACK) / (1 - ATTACK);
            const inv = 1 - subT;
            // Cubic ease-out release — fast at the start, slow as dots
            // approach the grid again
            env = inv * inv * inv;
          }
          uniforms.uBurstForce.value = BURST_STRENGTH * env;
          uniforms.uBurstCenter.value.copy(burstCenter);
        }
      }

      // Theme-driven clear color: smoothly approach the target each frame
      // so light↔dark crossfade matches the wrapper's bg transition.
      const before = currentClear.getHex();
      currentClear.lerp(targetClear, CLEAR_LERP);
      if (currentClear.getHex() !== before) {
        renderer.setClearColor(currentClear, 1);
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    if (reduceMotion) {
      renderer.render(scene, camera);
    } else {
      frame();
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointerdown", onPointerDown);
      if (points) {
        scene.remove(points);
        points.geometry.dispose();
      }
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [spacing, dotSize, radius, push, ease, baseAlpha, dot, bg, bgDark]);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none", // hero content stays interactive
        zIndex: 0,
        ...style,
      }}
    />
  );
}
