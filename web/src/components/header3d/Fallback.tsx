import { sections } from "./data";

/**
 * Static, no-WebGL hero. Same identity + working anchor links — recruiter
 * can always reach every section. Used when WebGL is unavailable or the
 * user prefers reduced motion.
 */
export function Fallback() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden border-b border-rule">
      {/* deep-space gradient backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, #0d1530 0%, #04060f 65%)",
        }}
      />
      {/* scanlines vibe */}
      <div className="scanlines pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1240px] flex-col items-center justify-center px-5 text-center">
        <div className="label mb-3">offline navigation</div>
        <h1 className="font-display text-5xl font-light tracking-tight text-fg sm:text-6xl md:text-7xl">
          Danial <span className="text-accent">Kordmodanlou</span>
        </h1>
        <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.28em] text-fg-dim">
          ML <span className="text-accent">×</span> real-time systems{" "}
          <span className="text-accent">×</span> game engineering
        </p>

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {sections.map((s) => (
            <li key={s.anchor}>
              <a
                href={`#${s.anchor}`}
                className="inline-block border border-rule-strong px-4 py-2 font-mono text-[12px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
