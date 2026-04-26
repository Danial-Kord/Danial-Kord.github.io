import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudyFrontmatter } from "@/lib/work";

export function CaseStudyShell({
  fm,
  children,
}: {
  fm: CaseStudyFrontmatter;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto w-full max-w-[1240px] px-5">
      {/* breadcrumb */}
      <div className="mt-10 flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-fg-dim">
        <Link href="/work" className="hover:text-accent">work</Link>
        <span className="text-fg-mute">/</span>
        <span className="text-fg">{fm.slug}</span>
      </div>

      {/* title block */}
      <header className="mt-6 grid gap-10 border-b border-rule pb-12 lg:grid-cols-[1fr_360px]">
        <div>
          <h1 className="font-display text-5xl font-light tracking-tight text-fg sm:text-6xl">
            {fm.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-dim">
            {fm.tagline}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {fm.stack.map((s) => (
              <span
                key={s}
                className="border border-rule px-2 py-1 font-mono text-[11px] tracking-[0.06em] text-fg-dim"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <aside className="grid grid-cols-2 gap-px border border-rule bg-rule">
          <Meta label="role" value={fm.role} />
          <Meta label="year" value={fm.year} />
          {fm.metrics?.slice(0, 4).map((m) => (
            <Meta key={m.label} label={m.label} value={m.value} />
          ))}
        </aside>
      </header>

      {/* body */}
      <div className="prose-engine mx-auto mt-12 max-w-3xl">{children}</div>

      {/* links */}
      {fm.links && fm.links.length > 0 && (
        <div className="mx-auto mt-16 flex max-w-3xl flex-wrap gap-3 border-t border-rule pt-8">
          {fm.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 border border-rule-strong px-4 py-2 font-mono text-[12px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
            >
              {l.label}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ))}
        </div>
      )}

      {/* footer nav back to work */}
      <div className="mx-auto mt-16 max-w-3xl border-t border-rule pt-8">
        <Link
          href="/work"
          className="font-mono text-[12px] uppercase tracking-[0.18em] text-fg-dim hover:text-accent"
        >
          ← all work
        </Link>
      </div>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-mute">
        {label}
      </div>
      <div className="mt-1 font-display text-[15px] text-fg">{value}</div>
    </div>
  );
}
