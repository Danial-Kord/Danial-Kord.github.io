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
  image: string;            // path under /public or absolute URL
  href?: string;
  /** if true, render as wide hero card spanning the full row */
  feature?: boolean;
  /** `contain` for logos / transparent PNGs (default cover) */
  imageFit?: "cover" | "contain";
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
    image: "/images/techu-logo.png",
    href: "https://techuonthechair.com/",
    imageFit: "contain",
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
  /** extra call-to-action buttons (e.g., "Play"), rendered next to `link` */
  cta?: { label: string; href: string }[];
};

export const experience: Experience[] = [
  {
    when: "Jan 2026 — Mar 2026",
    org: "Vector Institute",
    role: "Machine Learning Associate (MLA)",
    blurb:
      "Partnering with DXTR to develop an MVP for a real-time VR firefighter training system, focusing on skill deviation detection using headset telemetry.",
    bullets: [
      "Developed an LSTM-based model to predict and detect skill deviations based on the last step of the sequence.",
      "Designed and architected an LLM-driven coaching layer that interprets pose deviation data to provide immediate, natural-language feedback to trainees.",
      "Engineered a redundant full-body pose collection pipeline using Meta Quest SDK to ensure cross-platform compatibility and reliable telemetry capture.",
      "Collaborated on data integration and evaluation of pose deviation models for high-fidelity training scenarios.",
    ],
  },
  {
    when: "Dec 2025 — Feb 2026",
    org: "DreamForge",
    role: "Senior Unity Developer",
    blurb:
      "Core contributor to DreamForge, an AI-driven game engine that procedurally generates complete 3D game worlds from text prompts.",
    bullets: [
      "Implemented a procedural wall cutout system using CSG boolean subtraction with four interchangeable silhouette strategies (convex hull, radial ray casting, voxel boundary tracing, alpha-shape concave hull), BFS connected-component filtering, and ear-clipping triangulation for mesh extrusion.",
      "Built CI/CD pipelines using Docker, Azure Container Instances, .NET, GitHub Actions, and Slack webhooks for automated exception analysis, PR creation, and deployment notifications.",
      "Architected a multi-mode camera system using Cinemachine with adaptive framing optimization, multi-candidate camera selection with occlusion filtering, bone-based NPC framing, 3-ray spherecast occlusion fading, and dynamic room-geometry yaw constraints with velocity damping.",
      "Designed a polygon-based room shape system with grid-based flood fill validation and geometry utilities (segment intersection, polygon scaling, convex hull).",
    ],
    link: { label: "DreamForge", href: "https://www.playdreamforge.com/" },
  },
  {
    when: "Jan 2024 — present",
    org: "York University",
    role: "Research Assistant & Teaching Assistant",
    blurb:
      "VR and motion-capture projects using Meta Quest, ARKit, Unity3D, and Unreal Engine.",
    bullets: [
      "Designed experiments for VR illusions in the Cubics project and developed the Deep app for immersive iOS-based telecommunication.",
      "Taught Java-based object-oriented programming labs for four semesters.",
    ],
  },
  {
    when: "Aug 2023 — Feb 2025",
    org: "TectoTrack",
    role: "Software Developer",
    blurb:
      "Simulation systems for high-traffic environments such as airports, train stations, and malls using Unity3D.",
    bullets: [
      "Integrated pathfinding algorithms to enable adaptive and efficient crowd navigation.",
      "Created tools to visualize and modify agent behavior in real time for simulation control and testing.",
    ],
  },
  {
    when: "Jan 2023 — Aug 2024",
    org: "Techu",
    role: "Lead Unity3D Game Developer",
    blurb:
      "Led development of Techu, a strategic card game — gameplay, AI, and multiplayer integrations.",
    bullets: [
      "Integrated online multiplayer using Photon and PlayFab, improving engagement and online interaction.",
      "Developed an AI agent using reinforcement learning principles.",
    ],
    link: { label: "Techu project", href: "https://techuonthechair.com/" },
  },
  {
    when: "Jan 2022 — present",
    org: "IAESTE",
    role: "Full-Stack Developer (volunteer)",
    blurb:
      "Volunteer full-stack developer for IAESTE (International Association for the Exchange of Students for Technical Experience).",
    bullets: [
      "Developed and maintained web applications for non-profit projects with Vue.js and Django, improving functionality and user experience.",
    ],
  },
  {
    when: "Sep 2017 — Aug 2022",
    org: "Amirkabir University of Technology (AUT)",
    role: "Teaching Assistant & Technical Staff",
    blurb:
      "Technical staff for AUT Game Development Events for two consecutive years — organizing technical aspects, content, and tutoring — plus teaching assistant roles across several courses.",
    bullets: [
      "Organized and managed event technology, prepared participant materials, and tutored attendees to promote game development education and community.",
      "Assisted in teaching Principles of Artificial Intelligence, Advanced Computer Programming with Java, and Fundamentals of Computer Programming with C.",
    ],
  },
  {
    when: "Jul 2020 — Aug 2020",
    org: "Sepantab",
    role: "Intern",
    blurb:
      "Internship at Sepantab, an IoT startup, during the first summer after the pandemic began. Built an online mobile game for café customers to use while waiting for orders — simple engagement and light rewards while orders are prepared.",
  },
  {
    when: "Jan 2019 — Apr 2020",
    org: "Pherma",
    role: "Game Developer",
    blurb:
      "Game developer on a small team shipping hyper-casual and adventure games for iOS, Android, and Windows.",
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
    when: "2024 — 2025",
    degree: "MSc",
    field: "Computer Science",
    school: "York University, Toronto, Ontario",
    blurb:
      "Master's work at the intersection of virtual reality and telecommunication: facial expression and motion capture on 3D virtual characters. Leverages Unity3D, Unreal Engine, and ARKit to bridge virtual and real-world interaction — pushing C# and C++ depth for game development and XR.",
    stats: ["CGPA: 4.0 / 4.0"],
  },
  {
    when: "2017 — 2022",
    degree: "BSc",
    field: "Computer Engineering",
    school: "Amirkabir University of Technology (AUT)",
    blurb:
      "Early focus on game development; after an AI course, deepened into generative models via Stanford and Coursera (GANs, deep networks) during the pandemic. Fascinated by generative models in computer vision. Thesis (eight months): pose estimation, automatic 3D animation generation, and 3D rigged character mesh generation.",
    stats: [
      "Relevant courses: Data Structures 18.25, Advanced Programming 18.5, Principles of Computer & Programming 20, Information Retrieval 18.75, Data Mining 18.1, Software Testing 19.9",
      "GPA: 3.88 / 4.0",
      "CGPA: 3.73 / 4.0 (17.41 / 20.0) — 140 / 140 credits",
    ],
  },
  {
    when: "2013 — 2017",
    degree: "High School Diploma",
    field: "Mathematics & Physics",
    school: "Allameh Helli (NODET)",
    blurb:
      "Completed in NODET (National Organization for Development of Exceptional Talents). Robotics workshops with open-weight football robots; competed at RoboCup and placed 4th of 32 teams.",
    stats: ["CGPA: 4.0 / 4.0 (19.56 / 20.0)"],
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
    year: "2026",
    title: "3rd place — EvenUp-Tech Hackathon",
    body: "Built CaseLogic with hybrid retrieval (vector + keyword), a verification layer, and agentic planning — 24-hour build.",
  },
  {
    year: "2025",
    title: "Lab2Market — $10,000 funding",
    body: "Secured funding for innovative research commercialization.",
  },
  {
    year: "2025",
    title: "Boson AI + MScAC Hackathon (semi-finalist)",
    body: "Advanced to semi-finals in a competitive AI hackathon.",
  },
  {
    year: "2025",
    title: "47th European Conference on Visual Perception (ECVP 2025)",
    body: "Mainz, Germany — presented research on depth perception, stereopsis, and motion parallax in VR.",
  },
  {
    year: "2024",
    title: "Fully funded MSc, York University",
    body: "Full scholarship for Master's in Computer Science.",
  },
  {
    year: "2023",
    title: "500+ ⭐ on DigiHuman (open source)",
    body: "Recognized open-source contribution to computer vision and animation.",
  },
  {
    year: "2023",
    title: "Top 0.5% — AI graduate national exam",
    body: "Exceptional performance in the national artificial intelligence examination.",
  },
  {
    year: "2015",
    title: "4th place — National RoboCup",
    body: "Ranked 4th among 32 teams in the robotics competition.",
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
    "MSc Computer Science at York University (Toronto, Ontario), focused on VR — facial expression and motion capture for 3D virtual characters with Unity3D, Unreal Engine, and ARKit, bridging virtual and real-world interaction. I build hybrid systems where ML, real-time graphics, and game engines meet: mocap pipelines, AI-driven engines, VR training, and LLM systems.",
};
