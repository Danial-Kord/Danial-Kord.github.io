"use client";

/**
 * Cinematic 3D site header.
 *
 *  - Scene is dynamic-imported so WebGL code never runs on the server.
 *  - `useWebGL()` probes a real WebGL2/WebGL context once on mount; if it
 *    can't get one (or the user prefers reduced motion), we render a
 *    static `<Fallback />` with the same identity + anchor links.
 *  - Click on a planet → 600ms FOV "zoom kick" + smooth-scroll to that
 *    section's anchor. Camera returns to baseline; the user lands at the
 *    right section without losing the scene.
 *  - Identity (name + tagline) is overlaid bottom-center so a recruiter
 *    sees who they're looking at within the first frame.
 */

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";

import type { SectionPlanet } from "./data";
import type { V3 } from "./SolarScene";
import { Fallback } from "./Fallback";

const SolarScene = dynamic(() => import("./SolarScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#04060f]" aria-hidden />,
});

/** Probe for WebGL2 / WebGL availability. Runs once on mount. */
function useWebGL(): boolean | null {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOk(false);
      return;
    }
    try {
      const c = document.createElement("canvas");
      const g =
        (c.getContext("webgl2") as WebGL2RenderingContext | null) ||
        (c.getContext("webgl") as WebGLRenderingContext | null) ||
        (c.getContext("experimental-webgl") as WebGLRenderingContext | null);
      setOk(!!g);
    } catch {
      setOk(false);
    }
  }, []);
  return ok;
}

/** Smooth-scroll to a section anchor with a glow pulse on arrival. */
function scrollToAnchor(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  el.classList.add("anchor-target");
  window.setTimeout(() => el.classList.remove("anchor-target"), 1400);
}

export function Header3D() {
  const webglOk = useWebGL();

  const [hovered, setHovered] = useState<SectionPlanet | null>(null);
  const [selectedAnchor, setSelectedAnchor] = useState<string | null>(null);
  /** world-space position of the clicked planet (snapshot at click time) */
  const [target, setTarget] = useState<V3 | null>(null);

  const releaseTimer = useRef<number | null>(null);
  const scrollTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (releaseTimer.current) window.clearTimeout(releaseTimer.current);
      if (scrollTimer.current) window.clearTimeout(scrollTimer.current);
    };
  }, []);

  const handleSelect = useCallback((anchor: string, position: V3) => {
    setSelectedAnchor(anchor);
    setTarget(position);

    // Camera flies for ~900ms — long enough to read as a real cinematic zoom,
    // short enough that the page-scroll afterwards still feels snappy.
    if (releaseTimer.current) window.clearTimeout(releaseTimer.current);
    releaseTimer.current = window.setTimeout(() => {
      setTarget(null);
      setSelectedAnchor(null);
    }, 900);

    // Scroll fires partway through the flight so the camera-zoom and the
    // page-scroll feel like one continuous motion arriving at the section.
    if (scrollTimer.current) window.clearTimeout(scrollTimer.current);
    scrollTimer.current = window.setTimeout(() => scrollToAnchor(anchor), 380);
  }, []);

  // ----- non-WebGL path -----
  if (webglOk === false) return <Fallback />;
  // ----- still detecting -----
  if (webglOk === null) {
    return (
      <section
        className="relative h-[100svh] min-h-[640px] w-full overflow-hidden border-b border-rule"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[#04060f]" />
      </section>
    );
  }

  // ----- WebGL: full 3D header -----
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden border-b border-rule">
      {/* canvas */}
      <div className="absolute inset-0">
        <SolarScene
          target={target}
          selectedAnchor={selectedAnchor}
          onSelect={handleSelect}
          onHoverChange={setHovered}
        />
      </div>

      {/* viewport chrome */}
      <Brackets />

      {/* scanlines + soft vignette */}
      <div className="scanlines pointer-events-none absolute inset-0 z-10" />
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(closest-side at 50% 55%, transparent 35%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* HUD top-left: live readout that updates on hover */}
      <div className="pointer-events-none absolute left-6 top-6 z-20 max-w-[260px] font-mono text-[11px] leading-relaxed text-fg-dim">
        <div className="label mb-1.5 text-fg-mute">solar map</div>
        <div className="text-accent/90">
          ● {hovered ? hovered.label : "stand-by"}
        </div>
        <div className="mt-0.5 text-fg-dim">
          {hovered ? hovered.caption : "hover or click a planet to navigate"}
        </div>
      </div>

      {/* HUD top-right: scene stats */}
      <div className="pointer-events-none absolute right-6 top-6 z-20 text-right font-mono text-[10px] tracking-[0.18em] text-fg-mute">
        <div>fps <span className="text-accent">60</span></div>
        <div>dpr <span className="text-accent">auto</span></div>
        <div>gpu <span className="text-accent">webgl2</span></div>
      </div>

      {/* identity */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[15%] z-20 flex flex-col items-center text-center">
        <div className="label mb-3 text-fg-dim">
          <span className="text-accent">●</span> live · holographic map · 6 stations
        </div>
        <h1 className="font-display text-5xl font-light tracking-tight text-fg sm:text-6xl md:text-7xl">
          Danial <span className="text-accent">Kordmodanlou</span>
        </h1>
        <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.28em] text-fg-dim">
          ML <span className="text-accent">×</span> real-time systems{" "}
          <span className="text-accent">×</span> game engineering
        </p>
      </div>

      {/* scroll hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-2 opacity-70">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-fg-dim">
          scroll
        </span>
        <ArrowDown className="h-3.5 w-3.5 animate-bounce text-fg-dim" />
      </div>
    </section>
  );
}

function Brackets() {
  const sz = "h-4 w-4 border-fg-dim";
  return (
    <>
      <div className={`pointer-events-none absolute left-3 top-3 z-20 border-l border-t ${sz}`} />
      <div className={`pointer-events-none absolute right-3 top-3 z-20 border-r border-t ${sz}`} />
      <div className={`pointer-events-none absolute bottom-3 left-3 z-20 border-b border-l ${sz}`} />
      <div className={`pointer-events-none absolute bottom-3 right-3 z-20 border-b border-r ${sz}`} />
    </>
  );
}
