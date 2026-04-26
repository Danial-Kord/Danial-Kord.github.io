import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Danial Kordmodanlou — ML and game-engine engineer working at the intersection of real-time graphics, VR, and applied AI.",
};

const timeline = [
  {
    when: "2026 — present",
    where: "Vector Institute × DXTR",
    role: "Machine Learning Associate",
    body: "Building a VR firefighter training MVP: LSTM skill-deviation detection on full-body Quest telemetry, with an LLM coaching layer that turns deviation signals into real-time natural-language feedback.",
  },
  {
    when: "2025 — 2026",
    where: "DreamForge",
    role: "Senior Unity Developer",
    body: "Core contributor to an AI-driven game engine that procedurally generates 3D worlds from text prompts. Procedural wall-cutout system (CSG + 4 silhouette strategies), multi-mode Cinemachine camera with 3-ray spherecast occlusion, Docker + Azure CI/CD.",
  },
  {
    when: "2024 — present",
    where: "York University · BioMotion Lab",
    role: "Research Assistant & TA",
    body: "VR and motion-capture research using Meta Quest, ARKit, Unity, and Unreal. Designed VR illusion experiments for the Cubics project; built the Deep iOS app for immersive telecommunication. Java OOP TA for four semesters.",
  },
  {
    when: "2023 — 2025",
    where: "TectoTrack",
    role: "Software Developer",
    body: "Crowd-simulation systems for high-traffic environments (airports, train stations, malls) in Unity. Pathfinding integration and real-time agent-behavior tooling.",
  },
  {
    when: "2023 — 2024",
    where: "Techu",
    role: "Lead Unity Developer",
    body: "Shipped a strategic multiplayer card game; integrated Photon and PlayFab; built a reinforcement-learning AI opponent.",
  },
  {
    when: "2022",
    where: "Open source · DigiHuman (BSc thesis)",
    role: "Author",
    body: "Real-time markerless mocap pipeline (BlazePose + MediaPipe) feeding Unity humanoid rigs, plus a single-photo → rigged-character pipeline (PIFuHD + RigNet + Blender). 500+ stars on GitHub.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[1240px] px-5 pb-20 pt-16">
      <div className="text-scrim">
        <div className="label mb-4">section · about</div>
        <h1 className="font-display text-5xl font-light tracking-tight text-fg sm:text-6xl">
          Hybrid by design.
        </h1>
      </div>
      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5 text-lg leading-relaxed text-fg-dim">
          <p className="text-scrim">
            I'm <span className="text-fg">Danial Kordmodanlou</span> — a
            graduate student at York University and an engineer who lives where
            machine learning meets real-time systems. I've spent equal time in
            Unity, in PyTorch notebooks, and in the messy integration code that
            connects them.
          </p>
          <p className="text-scrim">
            The work I'm proudest of is the work that crosses boundaries: a
            real-time mocap pipeline that wires four research models into a
            game engine, a procedural geometry system that lets an LLM emit
            playable rooms, a VR training MVP whose coach is an LLM reading
            sequence-model output. None of these projects sit cleanly in "ML"
            or "graphics" or "gameplay" — they live in the seams.
          </p>
          <p className="text-scrim">
            I'm interested in roles where that intersection is the point:
            gameplay engineering at studios shipping ambitious real-time
            systems, applied-ML and LLM teams at companies building embodied
            or interactive products, AR/VR research-engineering, anything
            adjacent.
          </p>
        </div>

        <aside className="text-scrim border border-rule">
          <div className="label mb-3">vitals</div>
          <dl className="space-y-3 font-mono text-[13px]">
            <Row k="based" v="Toronto, ON" />
            <Row k="email" v="Danial.Kordmodanlou@gmail.com" />
            <Row k="github" v="Danial-Kord" />
            <Row k="linkedin" v="/in/danial-kord" />
            <Row k="languages" v="English · Persian" />
            <Row k="status" v="open to roles" accent />
          </dl>
        </aside>
      </div>

      <div className="mt-20">
        <div className="label text-scrim mb-6">timeline</div>
        <ul className="border-t border-rule">
          {timeline.map((t) => (
            <li key={t.where} className="border-b border-rule py-7">
              <div className="text-scrim">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[180px_220px_1fr]">
                  <div className="font-mono text-[12px] tracking-[0.14em] uppercase text-fg-mute">
                    {t.when}
                  </div>
                  <div>
                    <div className="font-display text-lg text-fg">{t.where}</div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                      {t.role}
                    </div>
                  </div>
                  <div className="text-fg-dim">{t.body}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
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
