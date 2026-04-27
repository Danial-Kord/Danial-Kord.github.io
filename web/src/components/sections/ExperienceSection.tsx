import { ArrowUpRight, Play } from "lucide-react";
import { experience } from "@/lib/site-data";
import { SectionHeader } from "./SectionHeader";

export function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-16 border-b border-rule">
      <div className="mx-auto max-w-[1240px] px-5 py-20">
        <SectionHeader
          num="003"
          kicker="experience"
          title="Work."
          intro="Roles where I shipped — research labs, startups, game studios, university teaching."
        >
          <ol>
            {experience.map((e, i) => (
              <li
                key={`${e.org}-${i}`}
                className="border-b border-rule py-8 last:border-b-0 last:pb-0"
              >
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[180px_240px_1fr]">
                  <div className="font-mono text-[12px] uppercase tracking-[0.14em] text-fg-mute">
                    {e.when}
                  </div>
                  <div>
                    <div className="font-display text-lg text-fg">{e.org}</div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                      {e.role}
                    </div>
                  </div>
                  <div className="text-fg-dim">
                    {/* preview image — when provided */}
                    {e.preview && (
                      <a
                        href={e.cta?.[0]?.href ?? e.link?.href ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${e.org}`}
                        className="mb-4 block max-w-[280px]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={e.preview.image}
                          alt={e.preview.alt}
                          className="h-auto w-full object-contain"
                        />
                      </a>
                    )}

                    {e.blurb && <p className="mb-3">{e.blurb}</p>}
                    {e.bullets && (
                      <ul className="space-y-1.5">
                        {e.bullets.map((b, j) => (
                          <li key={j} className="relative pl-5 text-[15px]">
                            <span className="absolute left-0 top-[0.45em] h-px w-3 bg-accent/60" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* CTA buttons + secondary site link */}
                    {(e.link || (e.cta && e.cta.length > 0)) && (
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {e.cta?.map((c) => (
                          <a
                            key={c.href}
                            href={c.href}
                            target="_blank"
                            rel="noreferrer"
                            className="group inline-flex items-center gap-2 border border-accent bg-accent/10 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-accent transition-colors hover:bg-accent hover:text-bg"
                          >
                            <Play className="h-3 w-3" fill="currentColor" />
                            {c.label}
                          </a>
                        ))}
                        {e.link && (
                          <a
                            href={e.link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-accent hover:underline"
                          >
                            {e.link.label} <ArrowUpRight className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </SectionHeader>
      </div>
    </section>
  );
}
