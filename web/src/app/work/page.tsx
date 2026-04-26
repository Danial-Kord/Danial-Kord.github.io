import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { listCaseStudies } from "@/lib/work";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected case studies in ML, real-time systems, and game engineering.",
};

export default function WorkIndex() {
  const studies = listCaseStudies();
  return (
    <div className="mx-auto w-full max-w-[1240px] px-5 pb-20 pt-16">
      <div className="text-scrim">
        <div className="label mb-4">section · work</div>
        <h1 className="font-display text-5xl font-light tracking-tight text-fg sm:text-6xl">
          Selected work
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-dim">
          Each project is presented as a system, not a screenshot. Architecture,
          constraints, what broke, and what shipped.
        </p>
      </div>

      <ul className="text-scrim mt-14 divide-y divide-rule border-y border-rule">
        {studies.map((cs, i) => (
          <li key={cs.slug}>
            <Link
              href={`/work/${cs.slug}`}
              className="glass-interactive group grid grid-cols-[auto_1fr_auto] items-center gap-6 py-7"
            >
              <span className="font-mono text-[11px] tracking-[0.18em] text-fg-mute">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="font-display text-2xl text-fg transition-colors group-hover:text-accent sm:text-3xl">
                  {cs.title}
                </div>
                <div className="mt-1 text-fg-dim">{cs.tagline}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {cs.stack.slice(0, 6).map((s) => (
                    <span
                      key={s}
                      className="font-mono text-[10.5px] tracking-[0.05em] text-fg-mute"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
                <span>{cs.year}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
