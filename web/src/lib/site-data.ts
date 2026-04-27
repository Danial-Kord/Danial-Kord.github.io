/**
 * Content data for all "narrative" sections on the home page.
 * Mirrors the original Creative-CV site (about, projects with thumbnails,
 * experience, education, awards, skills) — but in the engine aesthetic.
 */

export type ImgProject = {
  /** stable id used as anchor target (id={`project-${slug}`}) */
  slug: string;
  title: string;
  blurb: string;
  stack: string;
  image: string;            // path under /public
  href?: string;
  /** if true, render as wide hero card spanning the full row */
  feature?: boolean;
};

export const imgProjects: ImgProject[] = [
  {
    slug: "digihuman",
    title: "DigiHuman",
    blurb:
      "Real-time markerless mocap pipeline. BlazePose + MediaPipe drive a Unity humanoid; PIFuHD + RigNet turn one photo into a rigged 3D character.",
    stack: "Unity3D · Python · MediaPipe · BlazePose · PIFuHD · RigNet",
    image: "/images/figure_headphone.gif",
    href: "https://github.com/Danial-Kord/DigiHuman",
    feature: true,
  },
  {
    slug: "dreamforge",
    title: "DreamForge",
    blurb:
      "AI game engine that procedurally generates 3D worlds from text prompts. Built the wall-cutout system, cinematic camera, and CI/CD.",
    stack: "Unity · C# · LLMs · Docker · Azure",
    image: "/images/dreamForge.png",
    href: "https://www.youtube.com/watch?v=O6LgZn5o7ko",
  },
  {
    slug: "hypervigilance",
    title: "HYPERVIGILANCE",
    blurb:
      "GameCraft 2025 jam demo — narrative experience inside the mind of a character with paranoia disorder. Mood, perception shifts, trust mechanics.",
    stack: "Unity3D · Game Jam · Narrative Design",
    image: "/images/hypervigilance.gif",
    href: "https://tahaelmi.itch.io/hypervigilance",
  },
  {
    slug: "techu",
    title: "Techu",
    blurb:
      "Strategic multiplayer card game. Reinforcement-learning AI opponent; Photon + PlayFab for online play.",
    stack: "Unity3D · Photon · PlayFab · C# · RL",
    image: "https://techuonthechair.com/wp-content/uploads/2024/08/Gameplay1-1024x569.jpg",
    href: "https://techuonthechair.com/",
  },
  {
    slug: "backgammon3d",
    title: "Backgammon3D",
    blurb:
      "Turn-based multiplayer with offline + AI modes. Monte Carlo tree search drives AI decisions; Photon manages the online platform.",
    stack: "C# · Unity · Photon",
    image: "/images/Backgammon 3D.jpg",
  },
  {
    slug: "ai-visualization",
    title: "AI Visualization",
    blurb:
      "Visual content created during my AI-course teaching assistant role. Animations published on YouTube to explain core concepts.",
    stack: "Python · Manim",
    image: "/images/AI_Visual.jpg",
    href: "https://github.com/Danial-Kord/Artificial-Intelligence-Visualization",
  },
  {
    slug: "search-engine",
    title: "Search Engine",
    blurb:
      "Information-retrieval course project — built a search engine from scratch. KNN classification, K-means preprocessing, tf-idf, champion lists.",
    stack: "Python · tf-idf · KNN · K-means",
    image: "/images/search-engines.png",
    href: "https://github.com/Danial-Kord/Information_Retrieval_Search_Engine",
  },
  {
    slug: "poem-writer-detector",
    title: "Poem Writer Detector",
    blurb:
      "NLP project guessing the author of a poem from text. Bigram + unigram language models reach 86% accuracy.",
    stack: "Python · NLP",
    image: "/images/book.jpg",
    href: "https://github.com/Danial-Kord/AI_Cource_Projects",
  },
  {
    slug: "solar-system-opengl",
    title: "Solar System (OpenGL)",
    blurb:
      "Real-time solar-system simulation written in raw OpenGL. Orbital mechanics, lighting, textured planets.",
    stack: "C++ · OpenGL",
    image: "/images/solarSystem.gif",
    href: "https://github.com/Danial-Kord/Solar-System-OpenGL",
  },
  {
    slug: "panorama",
    title: "Panorama",
    blurb:
      "Panoramic image-stitching app for seamless 360° images. Feature detection + matching with OpenCV; intuitive upload UI.",
    stack: "Python · OpenCV · GUI",
    image: "/images/panorama.jpg",
    href: "https://github.com/Danial-Kord/Panorama",
  },
  {
    slug: "deep-learning-practices",
    title: "Deep Learning Practices",
    blurb:
      "Course-based DL learning track — hand-digit recognition, MNIST GANs, cat/dog classifiers — at both low (NumPy) and high (Keras/TF) levels.",
    stack: "Python · Keras · TensorFlow · NumPy",
    image: "/images/NeuralNetworks.jpg",
    href: "https://github.com/Danial-Kord/deep-learning-studies.git",
  },
  {
    slug: "url-shortener",
    title: "URL Shortener SaaS",
    blurb:
      "URL-shortener service in Java + MySQL. Containerized with Docker and orchestrated on Kubernetes for concurrent multi-instance ops.",
    stack: "Docker · Kubernetes · Java · MySQL",
    image: "/images/urlShortener.png",
    href: "https://github.com/Danial-Kord/Cloud-Computing-Project.git",
  },
  {
    slug: "xv6",
    title: "XV6",
    blurb:
      "Modified the XV6 OS — added syscalls, swapped CPU scheduling algorithms, and customized kernel behavior.",
    stack: "C · XV6",
    image: "/images/os.jpg",
    href: "https://github.com/Danial-Kord/XV6",
  },
  {
    slug: "ringball",
    title: "RingBall",
    blurb:
      "Hyper-casual iOS game using 3D mesh pathfinding for smooth on-mesh movement.",
    stack: "C# · Unity · Analytics",
    image: "/images/ringball.jpg",
  },
  {
    slug: "jnormal-tanks",
    title: "JNormal Tanks",
    blurb:
      "First game I ever shipped — a multiplayer P2P tank game in pure Java. Final project for advanced programming.",
    stack: "Java · P2P",
    image: "/images/tanks.jpg",
  },
  {
    slug: "hanoi-towers",
    title: "Hanoi Towers",
    blurb:
      "My very first programming project. The C-language Tower of Hanoi that lit the spark for everything since.",
    stack: "C",
    image: "/images/hanoi.gif",
  },
];

/* -------------------------------- experience -------------------------------- */

export type Experience = {
  when: string;
  org: string;
  role: string;
  blurb?: string;
  bullets?: string[];
  link?: { label: string; href: string };
  /** small visual preview shown alongside the bullets */
  preview?: { image: string; alt: string };
  /** extra call-to-action buttons (e.g., "Play"), rendered next to `link` */
  cta?: { label: string; href: string }[];
};

export const experience: Experience[] = [
  {
    when: "Jan 2026 — Mar 2026",
    org: "Vector Institute",
    role: "Machine Learning Associate (MLA)",
    blurb:
      "Partnering with DXTR on a real-time VR firefighter training MVP focused on skill-deviation detection from headset telemetry.",
    bullets: [
      "Built an LSTM-based model that predicts and detects skill deviations on the last step of a sequence window.",
      "Designed an LLM-driven coaching layer that turns deviation signals into immediate natural-language feedback.",
      "Engineered a redundant full-body pose pipeline on the MetaQuest SDK for cross-firmware reliability.",
      "Collaborated on data integration and evaluation of pose-deviation models for high-fidelity training scenarios.",
    ],
  },
  {
    when: "Dec 2025 — Feb 2026",
    org: "DreamForge",
    role: "Senior Unity Developer",
    blurb:
      "Core contributor to DreamForge, an AI-driven game engine that procedurally generates complete 3D game worlds from text prompts.",
    bullets: [
      "Procedural wall-cutout system — CSG boolean subtraction with four interchangeable silhouette strategies (convex hull, radial ray casting, voxel boundary tracing, alpha-shape concave hull), BFS island filtering, ear-clipping triangulation, mesh extrusion.",
      "CI/CD pipelines: Docker, Azure Container Instances, .NET, GitHub Actions, Slack — automated exception analysis, PR creation, deploy notifications.",
      "Multi-mode Cinemachine camera: adaptive framing, multi-candidate selection with occlusion filtering, bone-based NPC framing, 3-ray spherecast occlusion fading, velocity-damped yaw constraints.",
      "Polygon-based room-shape system with grid flood-fill validation and reusable geometry utilities.",
    ],
    link: { label: "playdreamforge.com", href: "https://www.playdreamforge.com/" },
  },
  {
    when: "Jan 2024 — present",
    org: "York University",
    role: "Research Assistant & Teaching Assistant",
    blurb:
      "VR and motion-capture research using Meta Quest, ARKit, Unity3D, and Unreal Engine.",
    bullets: [
      "Designed VR-illusion experiments for the Cubics project; built the Deep app for immersive iOS-based telecommunication.",
      "Java OOP labs — TA across four semesters.",
    ],
  },
  {
    when: "Aug 2023 — Feb 2025",
    org: "TectoTrack",
    role: "Software Developer",
    blurb:
      "Crowd-simulation systems for high-traffic environments (airports, stations, malls) in Unity3D.",
    bullets: [
      "Integrated pathfinding for adaptive, efficient agent navigation.",
      "Built tooling to visualize and modify agent behavior in real time.",
    ],
  },
  {
    when: "Jan 2023 — Aug 2024",
    org: "Techu",
    role: "Lead Unity3D Game Developer",
    blurb:
      "Led development of Techu, a strategic card game — gameplay, AI, and live-ops integrations.",
    bullets: [
      "Online multiplayer via Photon + PlayFab.",
      "RL-based AI opponent agent.",
    ],
    link: { label: "techuonthechair.com", href: "https://techuonthechair.com/" },
    preview: {
      image:
        "https://techuonthechair.com/wp-content/uploads/2024/08/Gameplay1-1024x569.jpg",
      alt: "Techu gameplay screenshot",
    },
    cta: [{ label: "Play now", href: "https://app.techuonthechair.com/" }],
  },
  {
    when: "Jan 2022 — present",
    org: "IAESTE",
    role: "Full-Stack Developer (volunteer)",
    blurb:
      "Volunteer full-stack work for the International Association for the Exchange of Students for Technical Experience.",
    bullets: [
      "Built and maintained non-profit web applications in Vue.js and Django.",
    ],
  },
  {
    when: "Sep 2017 — Aug 2022",
    org: "Amirkabir University (AUT)",
    role: "Teaching Assistant & Technical Staff",
    blurb:
      "Two-year technical-staff role at AUT Game Development Events; TA across multiple courses.",
    bullets: [
      "Organized event tech, prepared content, tutored participants.",
      "TA'd Principles of AI, Advanced Java OOP, and Fundamentals of C.",
    ],
  },
  {
    when: "Jul 2020 — Aug 2020",
    org: "Sepantab",
    role: "Intern",
    blurb:
      "Pandemic-summer internship at an IoT startup. Shipped an online mobile game for cafe customers to play while orders are prepared.",
  },
  {
    when: "Jan 2019 — Apr 2020",
    org: "Pherma",
    role: "Game Developer",
    blurb:
      "Hyper-casual and adventure games for iOS, Android, and Windows in a small, friendly team.",
  },
];

/* -------------------------------- education -------------------------------- */

export type Education = {
  when: string;
  degree: string;
  field: string;
  school: string;
  blurb: string;
  stats: string[];
};

export const education: Education[] = [
  {
    when: "2024 — present",
    degree: "MSc",
    field: "Computer Science",
    school: "York University, Toronto",
    blurb:
      "Exploring the intersection of VR and telecommunication via facial expression and motion capture on 3D characters. Working in Unity3D, Unreal, and ARKit; pushing C#/C++ depth.",
    stats: ["CGPA 4.0 / 4.0"],
  },
  {
    when: "2017 — 2022",
    degree: "BSc",
    field: "Computer Engineering",
    school: "Amirkabir University of Technology (AUT)",
    blurb:
      "Pivoted from gameplay to AI mid-degree. Took GANs and DNNs deep through Stanford and Coursera; finished with an eight-month thesis on pose estimation, automatic 3D animation, and rigged-mesh generation.",
    stats: ["GPA 3.88 / 4.0", "CGPA 3.73 / 4.0", "140 / 140 credits"],
  },
  {
    when: "2013 — 2017",
    degree: "Diploma",
    field: "Mathematics & Physics",
    school: "Allameh Helli (NODET)",
    blurb:
      "Robotics workshops, open-weight football robots, RoboCup competition.",
    stats: ["CGPA 4.0 / 4.0 (19.56 / 20)"],
  },
];

/* -------------------------------- awards / honors -------------------------------- */

export type Award = {
  year: string;
  title: string;
  body: string;
};

export const awards: Award[] = [
  {
    year: "2025",
    title: "Lab2Market — $10,000 funding",
    body: "Secured funding for innovative research commercialization.",
  },
  {
    year: "2025",
    title: "Boson AI + MScAC Hackathon — Semi-finalist",
    body: "Advanced to semi-finals in a competitive AI hackathon.",
  },
  {
    year: "2025",
    title: "47th European Conference on Visual Perception (ECVP 2025)",
    body: "Mainz, Germany. Presented research on depth perception, stereopsis, and motion parallax in VR.",
  },
  {
    year: "2024",
    title: "Fully funded MSc, York University",
    body: "Full scholarship for the Master's in Computer Science.",
  },
  {
    year: "2023",
    title: "500+ ⭐ on DigiHuman (open source)",
    body: "Recognized open-source contribution to computer vision and animation.",
  },
  {
    year: "2023",
    title: "Top 0.5% — AI Graduate National Exam",
    body: "Exceptional performance in the national AI graduate examination.",
  },
  {
    year: "2015",
    title: "4th Place — National RoboCup",
    body: "Competed among 32 teams in robotics.",
  },
];

/* -------------------------------- skills -------------------------------- */

export const skillGroups: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["C#", "C++", "Python", "Java", "TypeScript", "GLSL", "C"],
  },
  {
    group: "Game / Real-time",
    items: ["Unity3D", "Unreal Engine", "Cinemachine", "Mecanim", "Photon", "PlayFab", "OpenGL"],
  },
  {
    group: "ML / AI",
    items: ["PyTorch", "TensorFlow", "Keras", "NumPy", "MediaPipe", "BlazePose", "PIFuHD", "RigNet", "LSTMs", "LLMs", "ONNX"],
  },
  {
    group: "Web / Systems",
    items: ["Next.js", "React", "Vue.js", "FastAPI", "Django", "Spring Boot", "Docker", "Kubernetes", "Azure", "GitHub Actions"],
  },
  {
    group: "XR / Sensing",
    items: ["Meta Quest SDK", "ARKit", "OpenCV", "Blender"],
  },
];

/* -------------------------------- bio -------------------------------- */

export const bio = {
  name: "Danial Kordmodanlou",
  email: "Danial.Kordmodanlou@gmail.com",
  location: "Toronto, ON",
  language: "English · Persian",
  github: "https://github.com/Danial-Kord",
  linkedin: "https://www.linkedin.com/in/danial-kord",
  telegram: "https://telegram.me/Danial_km",
  instagram: "https://www.instagram.com/danial._.km",
  cv: "https://drive.google.com/file/d/1WE7IhSHCR79zJD5mhZ3sAkDQkbu7MgBx/view?usp=sharing",
  about:
    "MSc Computer Science at York University (Toronto), focused on Virtual Reality — facial expression and motion capture for 3D characters with Unity3D, Unreal, and ARKit. I build hybrid systems where ML, real-time graphics, and game engines overlap: real-time mocap pipelines, AI-driven game engines, VR training, and LLM systems.",
};
