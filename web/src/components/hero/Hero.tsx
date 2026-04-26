"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-bg" aria-hidden />,
});

const bootLines = [
  "> kordmodanlou.engine v1.0",
  "> compiling shaders ...... ok",
  "> loading scene: lab.hdr ... ok",
  "> registering 4 stations ... ok",
  "> ready.",
];

export function Hero() {
  const [bootIdx, setBootIdx] = useState(0);
  const [bootDone, setBootDone] = useState(false);

  useEffect(() => {
    if (bootIdx >= bootLines.length) {
      const t = setTimeout(() => setBootDone(true), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setBootIdx((i) => i + 1), 220);
    return () => clearTimeout(t);
  }, [bootIdx]);

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden border-b border-rule">
      {/* canvas */}
      <div className="absolute inset-0">
        <HeroScene />
      </div>

      {/* corner brackets — viewport chrome */}
      <Brackets />

      {/* scanlines + vignette */}
      <div className="scanlines pointer-events-none absolute inset-0 z-10" />
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(closest-side at 50% 60%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* boot text — fades out once done */}
      <div
        className={`pointer-events-none absolute left-6 top-6 z-20 font-mono text-[12px] leading-relaxed text-accent transition-opacity duration-700 ${
          bootDone ? "opacity-0" : "opacity-90"
        }`}
      >
        {bootLines.slice(0, bootIdx).map((l, i) => (
          <div key={i}>{l}</div>
        ))}
        {bootIdx < bootLines.length && <span className="animate-pulse">_</span>}
      </div>

      {/* center identity block */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-[14%] z-20 flex flex-col items-center text-center transition-all duration-1000 ${
          bootDone ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="label mb-3 text-fg-dim">
          <span className="text-accent">●</span>{" "}
          live · webgl2 · click any station
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
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-2 transition-opacity duration-700 ${
          bootDone ? "opacity-70" : "opacity-0"
        }`}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-fg-dim">
          scroll
        </span>
        <ArrowDown className="h-3.5 w-3.5 animate-bounce text-fg-dim" />
      </div>

      {/* HUD top-right: fake fps / device */}
      <div className="pointer-events-none absolute right-6 top-6 z-20 text-right font-mono text-[10px] tracking-[0.18em] text-fg-mute">
        <div>
          fps <span className="text-accent">60</span>
        </div>
        <div>
          dpr <span className="text-accent">auto</span>
        </div>
        <div>
          gpu <span className="text-accent">webgl2</span>
        </div>
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
