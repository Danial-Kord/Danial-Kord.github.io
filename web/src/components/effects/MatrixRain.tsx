"use client";

/**
 * Scroll-reactive Matrix-style ASCII / katakana rain.
 *
 * - Always running, but invisible while the hero is on screen (scrollProgress=0).
 * - Fades in as the user scrolls past the hero.
 * - Scroll *velocity* drives a transient speed + brightness burst, then damps
 *   back to ambient — so it visibly reacts to user motion.
 * - Each column has its own end-Y so the bottom fade has natural variance.
 * - Respects prefers-reduced-motion (renders a single static frame, no anim).
 * - Pauses while the tab is hidden.
 */

import { useEffect, useRef } from "react";

const FONT_SIZE = 14;
const CHARSET =
  "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]()/\\|=+-*&^%$#@!?".split(
    "",
  );

type Column = {
  x: number;
  y: number;
  speed: number;     // base speed (px / frame at 60fps)
  endY: number;      // per-column max y → bottom-fade variance
  len: number;       // trail length (in chars)
  swap: number;      // probability of swapping the head char each frame
  head: string;
  hueShift: number;  // 0..1, slight per-column hue variance
};

export function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!ref.current) return;
    const canvas: HTMLCanvasElement = ref.current;
    const maybeCtx = canvas.getContext("2d", { alpha: true });
    if (!maybeCtx) return;
    const ctx: CanvasRenderingContext2D = maybeCtx;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    let w = 0;
    let h = 0;
    let cols: Column[] = [];

    let lastScrollY = window.scrollY;
    let velocity = 0;
    let scrollProgress = 0; // 0 while hero visible, → 1 after scrolling past it

    function rebuildColumns() {
      const count = Math.floor(w / FONT_SIZE);
      cols = Array.from({ length: count }, (_, i) => freshColumn(i, true));
    }

    function freshColumn(i: number, initial = false): Column {
      return {
        x: i * FONT_SIZE,
        // initial spawn: stagger across the viewport so columns aren't synced;
        // re-spawn: start above the top
        y: initial ? Math.random() * -h * 0.8 : -Math.random() * 240,
        speed: 0.55 + Math.random() * 1.8,
        endY: h * (0.45 + Math.random() * 0.5), // <-- variance: bottom fade per column
        len: 8 + Math.floor(Math.random() * 26),
        swap: 0.04 + Math.random() * 0.12,
        head: CHARSET[(Math.random() * CHARSET.length) | 0],
        hueShift: Math.random(),
      };
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      // start from solid black so the trail-fade trick has something to subtract
      ctx.fillStyle = "rgba(6, 7, 10, 1)";
      ctx.fillRect(0, 0, w, h);
      rebuildColumns();
    }

    function onScroll() {
      const sy = window.scrollY;
      const dy = sy - lastScrollY;
      // accumulate velocity (decays in the frame loop)
      velocity = Math.min(60, velocity + Math.abs(dy));
      lastScrollY = sy;
      // hero is ~100svh; once we've scrolled ~60% past it, full intensity
      const heroEnd = window.innerHeight * 0.6;
      scrollProgress = Math.min(1, Math.max(0, (sy - heroEnd * 0.2) / heroEnd));
    }

    let rafId = 0;
    let lastT = performance.now();

    function step(now: number) {
      const dt = Math.min(48, now - lastT) / 16.6667; // 1.0 at 60fps
      lastT = now;

      // damp scroll velocity each frame
      velocity *= Math.pow(0.9, dt);
      const burst = Math.min(1, velocity / 30); // 0..1 spike from scrolling
      const speedMul = 1 + burst * 4.0;

      // global visibility gate: 0 while on hero, ramps with scroll, gets a
      // transient bump from scroll bursts so the rain feels reactive
      const visibility = Math.min(1, scrollProgress * 0.85 + burst * 0.6);

      // trail fade — slightly faster fade during bursts to keep crisp head chars
      const trailAlpha = 0.07 + burst * 0.05;
      ctx.fillStyle = `rgba(6, 7, 10, ${trailAlpha})`;
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${FONT_SIZE}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.textBaseline = "top";

      for (const c of cols) {
        // bottom-fade variance: closer to endY, dimmer
        const distFromEnd = c.endY - c.y;
        const bottomFade = Math.min(1, Math.max(0, distFromEnd / 90));
        const colVis = visibility * bottomFade;
        if (colVis <= 0.02) {
          // still advance the column so it eventually resets, but skip drawing
          c.y += c.speed * speedMul * dt;
          maybeReset(c);
          continue;
        }

        // occasionally swap the head character
        if (Math.random() < c.swap) {
          c.head = CHARSET[(Math.random() * CHARSET.length) | 0];
        }

        // head — bright, almost white-cyan, with a slight per-column tint
        const headR = 180 + Math.floor(c.hueShift * 30);
        const headG = 255;
        const headB = 220 + Math.floor(c.hueShift * 20);
        ctx.fillStyle = `rgba(${headR}, ${headG}, ${headB}, ${0.95 * colVis})`;
        ctx.fillText(c.head, c.x, c.y);

        // trail — fading mocap-cyan
        for (let i = 1; i < c.len; i++) {
          const ty = c.y - i * FONT_SIZE;
          if (ty < -FONT_SIZE) break;
          const t = i / c.len;
          const a = (1 - t) * 0.55 * colVis;
          if (a < 0.025) continue;
          const ch =
            CHARSET[
              (((ty | 0) + i * 7 + (c.x | 0) * 13) >>> 0) % CHARSET.length
            ];
          // mocap cyan #7fffd4 (127, 255, 212) with a hint of variance
          const r = 110 + Math.floor(c.hueShift * 40);
          const g = 240;
          const b = 200 + Math.floor(c.hueShift * 30);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
          ctx.fillText(ch, c.x, ty);
        }

        c.y += c.speed * speedMul * dt;
        maybeReset(c);
      }

      if (!reduced) rafId = requestAnimationFrame(step);
    }

    function maybeReset(c: Column) {
      // when the column has fully marched past its variance end-y + trail
      if (c.y - c.len * FONT_SIZE > c.endY) {
        Object.assign(c, freshColumn(Math.round(c.x / FONT_SIZE)));
      }
    }

    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        lastT = performance.now();
        if (!reduced) rafId = requestAnimationFrame(step);
      }
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    if (reduced) {
      // single static frame — render a sparse snapshot, then stop
      step(performance.now());
    } else {
      rafId = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        // global bottom fade, layered on top of per-column variance
        WebkitMaskImage:
          "linear-gradient(to bottom, #000 0%, #000 55%, rgba(0,0,0,0.6) 80%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, #000 0%, #000 55%, rgba(0,0,0,0.6) 80%, transparent 100%)",
      }}
    />
  );
}
