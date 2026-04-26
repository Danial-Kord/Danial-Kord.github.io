import { skillGroups } from "@/lib/site-data";
import { SectionHeader } from "./SectionHeader";

export function SkillsSection() {
  return (
    <section id="skills" className="border-b border-rule">
      <div className="mx-auto max-w-[1240px] px-5 py-20">
        <SectionHeader num="006" kicker="stack" title="Skills." />

        <div className="mt-12 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g) => (
            <div key={g.group} className="bg-bg p-6">
              <div className="label mb-4">{g.group}</div>
              <div className="flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <span
                    key={it}
                    className="border border-rule px-2.5 py-1 font-mono text-[11.5px] tracking-[0.04em] text-fg"
                  >
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
