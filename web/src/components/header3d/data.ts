/**
 * Planets that double as the site's primary navigation.
 *
 * Each entry is a section the user can jump to from the 3D header.
 * Order matters: index 0 is the innermost orbit (largest, closest planet),
 * index N-1 is the outermost.
 *
 * `phase` lets us spread planets around the sun at start so they don't
 * cluster on one side. `tilt` rotates each orbital plane slightly so the
 * scene reads as 3D, not 2D.
 */

export type SectionPlanet = {
  /** human-facing nav label */
  label: string;
  /** id of the section on the home page (without #) */
  anchor: string;
  /** orbit radius (scene units) */
  radius: number;
  /** planet sphere radius */
  size: number;
  /** angular speed (rad/sec) */
  speed: number;
  /** initial orbital angle (rad) */
  phase: number;
  /** orbital plane tilt (rad) — small numbers, just enough for 3D */
  tilt: number;
  /** primary planet color (hex) */
  hue: string;
  /** short caption shown when planet is hovered */
  caption: string;
};

export const sections: SectionPlanet[] = [
  {
    label: "Projects",
    anchor: "portfolio",
    radius: 1.95,
    size: 0.30,
    speed: 0.18,
    phase: 0.4,
    tilt: 0.06,
    hue: "#7fffd4",
    caption: "Selected work · case studies",
  },
  {
    label: "Experience",
    anchor: "experience",
    radius: 2.65,
    size: 0.25,
    speed: 0.13,
    phase: 1.6,
    tilt: -0.09,
    hue: "#ff8db1",
    caption: "Roles & teams",
  },
  {
    label: "Research",
    anchor: "education",
    radius: 3.35,
    size: 0.22,
    speed: 0.10,
    phase: 2.7,
    tilt: 0.13,
    hue: "#b89cff",
    caption: "Education · papers · conferences",
  },
  {
    label: "Honors",
    anchor: "awards",
    radius: 4.05,
    size: 0.20,
    speed: 0.085,
    phase: 4.0,
    tilt: -0.05,
    hue: "#f5c451",
    caption: "Awards & recognition",
  },
  {
    label: "Skills",
    anchor: "skills",
    radius: 4.75,
    size: 0.18,
    speed: 0.072,
    phase: 5.1,
    tilt: 0.08,
    hue: "#7fb8ff",
    caption: "Stack · tools · languages",
  },
  {
    label: "Contact",
    anchor: "contact",
    radius: 5.45,
    size: 0.17,
    speed: 0.06,
    phase: 6.0,
    tilt: -0.11,
    hue: "#e8eaf2",
    caption: "Email · CV · channels",
  },
];
