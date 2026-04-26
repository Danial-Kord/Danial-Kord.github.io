import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileCode2 } from "lucide-react";
import { imgProjects } from "@/lib/site-data";
import { SectionHeader } from "./SectionHeader";

export function ProjectsSection() {
  const feature = imgProjects.find((p) => p.feature);
  const rest = imgProjects.filter((p) => !p.feature);

  return (
    <section id="portfolio" className="border-b border-rule">
      <div className="mx-auto max-w-[1240px] px-5 py-20">
        <SectionHeader
          num="002"
          kicker="portfolio"
          title="Projects."
          intro="Selected work across game development, ML, computer vision, and systems. The four highlighted projects have full case studies; the rest live here as a gallery."
        >
          <div className="grid gap-6">
            {feature && <FeatureCard p={feature} />}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <ProjectCard key={p.title} p={p} />
              ))}
            </div>
          </div>
        </SectionHeader>
      </div>
    </section>
  );
}

/* -------------------- feature (DigiHuman, full-width) -------------------- */
function FeatureCard({ p }: { p: (typeof imgProjects)[number] }) {
  return (
    <article className="group relative grid overflow-hidden border border-rule bg-transparent lg:grid-cols-[1.4fr_1fr]">
      {/* image */}
      <div className="relative aspect-[16/9] overflow-hidden border-b border-rule lg:aspect-auto lg:border-b-0 lg:border-r">
        {p.image.startsWith("http") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.image}
            alt={p.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <Image
            src={p.image}
            alt={p.title}
            fill
            sizes="(min-width:1024px) 60vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            unoptimized={p.image.endsWith(".gif")}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-bg/40 via-transparent to-transparent" />
        <div className="glass-inner pointer-events-none absolute left-3 top-3 border border-accent/40 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          ● featured · 500+ ★
        </div>
      </div>

      {/* body */}
      <div className="glass-inner flex flex-col justify-between gap-6 p-7">
        <div>
          <div className="label mb-3">case study · open-source</div>
          <h3 className="font-display text-3xl tracking-tight text-fg">{p.title}</h3>
          <p className="mt-3 text-fg-dim">{p.blurb}</p>
          <div className="mt-4 font-mono text-[11.5px] tracking-[0.04em] text-fg-mute">
            {p.stack}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {p.caseStudySlug && (
            <Link
              href={`/work/${p.caseStudySlug}`}
              className="group/btn inline-flex items-center gap-2 border border-accent bg-accent/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-accent transition-colors hover:bg-accent hover:text-bg"
            >
              <FileCode2 className="h-3.5 w-3.5" /> read case study
            </Link>
          )}
          {p.href && (
            <a
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-rule-strong px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
            >
              repo <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/* -------------------- standard card -------------------- */
function ProjectCard({ p }: { p: (typeof imgProjects)[number] }) {
  const inner = (
    <article className="group relative flex h-full flex-col overflow-hidden border border-rule bg-transparent transition-colors hover:border-accent/50">
      {/* image */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-rule">
        {p.image.startsWith("http") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.image}
            alt={p.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
        ) : (
          <Image
            src={p.image}
            alt={p.title}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            unoptimized={p.image.endsWith(".gif")}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/50 via-transparent to-transparent" />
        {p.caseStudySlug && (
          <div className="glass-inner pointer-events-none absolute left-2 top-2 border border-accent/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
            case study
          </div>
        )}
      </div>

      {/* body */}
      <div className="glass-inner flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-tight tracking-tight text-fg transition-colors group-hover:text-accent">
            {p.title}
          </h3>
          {p.href && (
            <ArrowUpRight className="h-4 w-4 shrink-0 text-fg-dim transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
          )}
        </div>
        <p className="text-[14px] leading-relaxed text-fg-dim">{p.blurb}</p>
        <div className="mt-auto pt-2 font-mono text-[10.5px] tracking-[0.04em] text-fg-mute">
          {p.stack}
        </div>
      </div>
    </article>
  );

  // priority: case study > external link > no link
  if (p.caseStudySlug) {
    return (
      <Link href={`/work/${p.caseStudySlug}`} className="block h-full">
        {inner}
      </Link>
    );
  }
  if (p.href) {
    return (
      <a href={p.href} target="_blank" rel="noreferrer" className="block h-full">
        {inner}
      </a>
    );
  }
  return inner;
}
