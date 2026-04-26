import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lab",
  description: "Smaller experiments — shaders, demos, ML toys.",
};

const planned = [
  {
    name: "in-browser pose puppet",
    body: "MediaPipe Tasks → Three.js bones. Drive a stylized avatar with the visitor's webcam, no install. Direct demo of the DigiHuman pipeline shrunk to fit a browser tab.",
    status: "next",
  },
  {
    name: "shader playground",
    body: "Hand-written GLSL fragments with live uniform sliders — fluid sim, signed-distance field experiments, screen-space dust.",
    status: "soon",
  },
  {
    name: "procedural room generator",
    body: "Type a sentence → see a tiny DreamForge-style room generated and walkable in the browser. The whole pipeline, miniaturized.",
    status: "soon",
  },
  {
    name: "live attention map",
    body: "ONNX Runtime Web running a small vision model in your browser, with live attention visualization on whatever your webcam sees.",
    status: "later",
  },
];

export default function LabPage() {
  return (
    <div className="mx-auto w-full max-w-[1240px] px-5 pb-20 pt-16">
      <div className="label mb-4">section · lab</div>
      <h1 className="font-display text-5xl font-light tracking-tight text-fg sm:text-6xl">
        The lab.
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-dim">
        Smaller experiments — interactive demos, shaders, and ML toys that
        don't earn a full case study but are too fun to throw away. The shelf
        is being stocked.
      </p>

      <ul className="mt-12 grid gap-px border border-rule bg-rule sm:grid-cols-2">
        {planned.map((p) => (
          <li key={p.name} className="bg-bg p-6">
            <div className="flex items-center justify-between">
              <div className="font-display text-lg text-fg">{p.name}</div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                {p.status}
              </span>
            </div>
            <p className="mt-2 text-fg-dim">{p.body}</p>
          </li>
        ))}
      </ul>

      <div className="mt-10 border-t border-rule pt-6 font-mono text-[12px] text-fg-mute">
        // first three demos land in the next milestone. check back soon.
      </div>
    </div>
  );
}
