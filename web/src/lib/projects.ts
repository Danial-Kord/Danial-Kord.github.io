/**
 * Single source of truth for projects shown across the site:
 * the hero R3F stations, the /work index, and case studies.
 */

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  role: string;
  year: string;
  domain: ("ml" | "graphics" | "vr" | "gameplay" | "llm" | "systems")[];
  stack: string[];
  metrics: { label: string; value: string }[];
  links: { label: string; href: string }[];
  /** position in hero scene: [x, y, z], roughly in meters */
  station: [number, number, number];
  /** accent color for the hero hologram */
  hue: string;
  /** id of the on-page section/card that the station should scroll to */
  anchor: string;
};

export const projects: Project[] = [
  {
    slug: "digihuman",
    title: "DigiHuman",
    tagline:
      "Real-time markerless mocap → 3D avatar pipeline driven by deep pose estimation.",
    role: "Author",
    year: "2022",
    domain: ["ml", "graphics", "gameplay"],
    stack: ["Unity3D", "C#", "Python", "MediaPipe", "BlazePose", "PIFuHD", "RigNet", "Blender"],
    metrics: [
      { label: "GitHub stars", value: "500+" },
      { label: "Inputs", value: "monocular RGB" },
      { label: "Output", value: "rigged humanoid" },
      { label: "License", value: "open-source" },
    ],
    links: [
      { label: "Repo", href: "https://github.com/Danial-Kord/DigiHuman" },
    ],
    station: [-2.6, 0.8, -3.5],
    hue: "#7fffd4",
    anchor: "project-digihuman",
  },
  {
    slug: "dreamforge",
    title: "DreamForge",
    tagline:
      "AI-driven game engine that procedurally generates complete 3D worlds from text prompts.",
    role: "Senior Unity Developer",
    year: "2025–26",
    domain: ["llm", "gameplay", "graphics", "systems"],
    stack: ["Unity", "C#", "LLMs", "Docker", "Azure", "Cinemachine", ".NET", "GitHub Actions"],
    metrics: [
      { label: "Geometry strategies", value: "4" },
      { label: "Camera pipeline", value: "3-ray occlusion" },
      { label: "CI/CD", value: "Docker + Azure ACI" },
      { label: "Triangulation", value: "ear-clipping" },
    ],
    links: [
      { label: "Site", href: "https://www.playdreamforge.com/" },
      { label: "Demo", href: "https://www.youtube.com/watch?v=O6LgZn5o7ko" },
    ],
    station: [2.4, 0.6, -5.2],
    hue: "#ff5c8a",
    anchor: "project-dreamforge",
  },
  {
    slug: "vr-firefighter",
    title: "VR Firefighter Trainer",
    tagline:
      "MetaQuest VR training MVP with LSTM skill-deviation detection and an LLM coaching layer.",
    role: "Machine Learning Associate",
    year: "2026",
    domain: ["ml", "vr", "llm"],
    stack: ["Meta Quest SDK", "Unity", "PyTorch", "LSTM", "LLMs", "Python"],
    metrics: [
      { label: "Telemetry", value: "full-body pose" },
      { label: "Model", value: "LSTM seq-to-1" },
      { label: "Coach", value: "LLM-driven NL" },
      { label: "Partner", value: "DXTR × Vector Inst." },
    ],
    links: [
      { label: "Vector Institute", href: "https://vectorinstitute.ai/" },
    ],
    station: [-3.0, 0.5, -7.4],
    hue: "#f5c451",
    anchor: "experience",
  },
  {
    slug: "llm-cv-builder",
    title: "LLM CV Builder",
    tagline:
      "Full-stack LLM pipeline that ingests a job posting and emits a tailored LaTeX CV + cover letter.",
    role: "Author",
    year: "2025–26",
    domain: ["llm", "systems"],
    stack: ["Python", "FastAPI", "LLMs", "LaTeX", "React"],
    metrics: [
      { label: "Output", value: "LaTeX → PDF" },
      { label: "Inputs", value: "job posting + profile" },
      { label: "Pipeline", value: "ingest → tailor → render" },
      { label: "UI", value: "React" },
    ],
    links: [
      { label: "Repo", href: "https://github.com/Danial-Kord/Latex-CV-Builder" },
    ],
    station: [2.8, 0.9, -9.2],
    hue: "#7fb8ff",
    anchor: "experience",
  },
];

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
