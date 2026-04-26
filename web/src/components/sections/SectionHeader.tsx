import type { ReactNode } from "react";

export function SectionHeader({
  num,
  kicker,
  title,
  intro,
  children,
  fullWidth = false,
}: {
  num: string;
  kicker: string;
  title: string;
  intro?: string;
  children?: ReactNode;
  /** When true, panel spans the full max-width column (not shrink-wrapped). */
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`text-scrim border border-rule border-l-2 border-l-accent/45${fullWidth ? " text-scrim--full" : ""}`}
    >
      <div className="grid gap-6 lg:grid-cols-[160px_1fr]">
        <div className="label pt-2">
          {num} · {kicker}
        </div>
        <div className="min-w-0">
          <h2 className="font-display text-3xl font-light tracking-tight text-fg sm:text-4xl">
            {title}
          </h2>
          {intro && (
            <p className="mt-3 max-w-2xl text-fg-dim">{intro}</p>
          )}
        </div>
      </div>
      {children ? (
        <div className="mt-8 border-t border-rule pt-10">{children}</div>
      ) : null}
    </div>
  );
}
