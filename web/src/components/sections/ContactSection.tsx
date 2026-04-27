import { ArrowUpRight } from "lucide-react";
import { bio } from "@/lib/site-data";
import { SectionHeader } from "./SectionHeader";

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-16">
      <div className="mx-auto max-w-[1240px] px-5 py-24">
        <SectionHeader num="007" kicker="contact" title="Get in touch.">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto]">
            <p className="font-display text-3xl font-light leading-snug tracking-tight text-fg sm:text-4xl">
              Interested in collaborating, or do you want to get in touch?{" "}
              I&apos;m glad to hear from you.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href={`mailto:${bio.email}`}
                className="group inline-flex items-center justify-center gap-2 border border-accent bg-accent/10 px-5 py-3 font-mono text-[12px] uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent hover:text-bg"
              >
                email me <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={bio.cv}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-rule-strong px-5 py-3 font-mono text-[12px] uppercase tracking-[0.18em] text-fg transition-colors hover:border-accent hover:text-accent"
              >
                download cv
              </a>
            </div>
          </div>
        </SectionHeader>
      </div>
    </section>
  );
}
