import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch — open to gameplay, real-time graphics, ML and LLM systems roles.",
};

const channels = [
  { label: "email", value: "Danial.Kordmodanlou@gmail.com", href: "mailto:Danial.Kordmodanlou@gmail.com" },
  { label: "github", value: "github.com/Danial-Kord", href: "https://github.com/Danial-Kord" },
  { label: "linkedin", value: "linkedin.com/in/danial-kord", href: "https://www.linkedin.com/in/danial-kord" },
  { label: "telegram", value: "@Danial_km", href: "https://telegram.me/Danial_km" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-[1240px] px-5 pb-20 pt-16">
      <div className="label mb-4">section · contact</div>
      <h1 className="font-display text-5xl font-light tracking-tight text-fg sm:text-6xl">
        Let's <span className="text-accent">talk</span>.
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-dim">
        Best for: gameplay or graphics engineering, applied ML and LLM systems,
        AR/VR research engineering, or interesting collaborations at the
        intersection.
      </p>

      <div className="mt-12 grid gap-px border border-rule bg-rule sm:grid-cols-2">
        {channels.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel={c.href.startsWith("http") ? "noreferrer" : undefined}
            className="group flex items-center justify-between gap-4 bg-bg p-6 transition-colors hover:bg-bg-1"
          >
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-mute">
                {c.label}
              </div>
              <div className="mt-1 font-display text-xl text-fg transition-colors group-hover:text-accent">
                {c.value}
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-fg-dim transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
          </a>
        ))}
      </div>

      <div className="mt-12 border border-rule bg-bg-1 p-6">
        <div className="label mb-2">response time</div>
        <p className="text-fg-dim">
          Usually within 48 hours. For roles, attaching a job description gets
          you the fastest reply.
        </p>
      </div>
    </div>
  );
}
