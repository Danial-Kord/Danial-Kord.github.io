import Image from "next/image";
import { bio } from "@/lib/site-data";
import { SectionHeader } from "./SectionHeader";

export function AboutSection() {
  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-[1240px] px-5 py-20">
        <SectionHeader fullWidth num="001" kicker="intro" title="Intro">
          <div className="grid gap-10 lg:grid-cols-[auto_1fr_minmax(320px,30rem)] lg:items-start lg:gap-10">
            <div className="flex justify-center lg:justify-start lg:pt-1">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-rule shadow-[0_0_0_1px_rgba(127,255,212,0.2)] sm:h-28 sm:w-28">
                <Image
                  src="/images/Dani.jpg"
                  alt={bio.name}
                  fill
                  sizes="112px"
                  className="object-cover object-[center_25%]"
                  priority
                />
              </div>
            </div>

            <p className="min-w-0 text-lg leading-relaxed text-fg-dim lg:pt-1">
              {bio.about}
            </p>

            <aside className="glass-inner min-w-0 border border-rule p-6 lg:w-full">
              <div className="label mb-3">vitals</div>
              <dl className="space-y-3 font-mono text-[13px]">
                <Row k="based" v={bio.location} />
                <Row k="email" v={bio.email} />
                <Row k="github" v="Danial-Kord" />
                <Row k="linkedin" v="/in/danial-kord" />
                <Row k="languages" v={bio.language} />
                <Row k="status" v="open to roles" accent />
              </dl>
            </aside>
          </div>
        </SectionHeader>
      </div>
    </section>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-1 border-b border-rule pb-3 sm:flex-row sm:items-baseline sm:gap-4 sm:pb-2">
      <dt className="shrink-0 text-fg-mute uppercase text-[11px] tracking-[0.14em]">
        {k}
      </dt>
      <dd
        className={`min-w-0 flex-1 break-words text-right text-[13px] ${accent ? "text-accent" : "text-fg"}`}
      >
        {v}
      </dd>
    </div>
  );
}
