import { Trophy, Award as AwardIcon, GraduationCap, Mic, Star, Users, BadgeCheck } from "lucide-react";
import { awards } from "@/lib/site-data";
import { SectionHeader } from "./SectionHeader";

const iconFor = (title: string) => {
  if (/funding|robocup/i.test(title)) return Trophy;
  if (/hackathon/i.test(title)) return Users;
  if (/conference|ecvp|presented/i.test(title)) return Mic;
  if (/scholarship|funded msc/i.test(title)) return GraduationCap;
  if (/star|⭐/i.test(title)) return Star;
  if (/exam|top/i.test(title)) return BadgeCheck;
  return AwardIcon;
};

export function AwardsSection() {
  return (
    <section id="awards" className="scroll-mt-16 border-b border-rule">
      <div className="mx-auto max-w-[1240px] px-5 py-20">
        <SectionHeader
          fullWidth
          num="005"
          kicker="honors"
          title="Awards & honors."
          intro="Funding, competitions, scholarships, and conference presentations."
        >
          <ul>
            {awards.map((a, i) => {
              const Icon = iconFor(a.title);
              return (
                <li
                  key={i}
                  className="border-b border-rule py-6 last:border-b-0 last:pb-0"
                >
                  <div className="grid grid-cols-[80px_1fr_auto] items-center gap-6">
                    <div className="font-mono text-[14px] tracking-[0.06em] text-accent">
                      {a.year}
                    </div>
                    <div>
                      <div className="font-display text-[17px] text-fg">{a.title}</div>
                      <div className="text-[14px] text-fg-dim">{a.body}</div>
                    </div>
                    <div className="hidden h-9 w-9 items-center justify-center border border-rule text-fg-dim sm:flex">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionHeader>
      </div>
    </section>
  );
}
