import { education } from "@/lib/site-data";
import { SectionHeader } from "./SectionHeader";

export function EducationSection() {
  return (
    <section id="education" className="scroll-mt-16 border-b border-rule">
      <div className="mx-auto max-w-[1240px] px-5 py-20">
        <SectionHeader num="004" kicker="education" title="Education.">
          <div className="grid gap-6 lg:grid-cols-3">
            {education.map((e) => (
              <article
                key={e.school}
                className="glass-card flex flex-col border border-rule p-6"
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-mute">
                  {e.when}
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                    {e.degree}
                  </span>
                  <span className="font-display text-xl text-fg">{e.field}</span>
                </div>
                <div className="mt-1 text-[13px] text-fg-dim">{e.school}</div>
                <p className="mt-4 text-[14.5px] leading-relaxed text-fg-dim">
                  {e.blurb}
                </p>
                <ul className="mt-4 space-y-1 border-t border-rule pt-3">
                  {e.stats.map((s) => (
                    <li
                      key={s}
                      className="font-mono text-[11px] tracking-[0.06em] text-fg"
                    >
                      <span className="text-accent">▸</span> {s}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </SectionHeader>
      </div>
    </section>
  );
}
