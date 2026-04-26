import { bio } from "@/lib/site-data";
import { SectionHeader } from "./SectionHeader";

export function AboutSection() {
  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-[1240px] px-5 py-20">
        <SectionHeader num="001" kicker="who" title="Hybrid by design." />
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
          <p className="text-lg leading-relaxed text-fg-dim">{bio.about}</p>

          <aside className="border border-rule p-6">
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
      </div>
    </section>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-rule pb-2">
      <dt className="text-fg-mute uppercase text-[11px] tracking-[0.14em]">{k}</dt>
      <dd className={accent ? "text-accent" : "text-fg"}>{v}</dd>
    </div>
  );
}
