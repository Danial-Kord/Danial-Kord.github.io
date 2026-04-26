/**
 * Bottom debug strip — engine-viewport flavor.
 * Pure decoration in M1; in M2 will stream real GitHub commits.
 */
const lines = [
  "[boot] kordmodanlou.engine · webgl2 · device-pixel-ratio=auto",
  "[scene] hero.scene loaded · 4 stations registered",
  "[gpu]   target 60fps · adaptive lod=on · postprocessing=off",
  "[net]   github://Danial-Kord · last sync ok",
];

export function ConsoleStrip() {
  return (
    <div className="border-t border-rule bg-bg-1/70">
      <div className="mx-auto max-w-[1240px] px-5 py-2.5">
        <div className="flex items-center gap-3 overflow-hidden font-mono text-[11px] text-fg-mute">
          <span className="inline-block h-1.5 w-1.5 shrink-0 bg-accent shadow-[0_0_8px_var(--accent)]" />
          <div className="flex min-w-0 gap-6 overflow-hidden whitespace-nowrap">
            {lines.map((l, i) => (
              <span key={i} className="shrink-0">
                <span className="text-accent/70">{l.split("]")[0]}]</span>
                {l.split("]")[1]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
