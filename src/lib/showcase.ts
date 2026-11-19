import type { ShowcaseModel } from "@/components/ModelShowcaseSection";

export const showcaseModels: ShowcaseModel[] = [
  {
    slug: "network-sphere",
    key: "globe",
    title: "Global Network Sphere",
    subtitle: "Global cybersecurity network",
    tagline: "The whole world, connected and protected.",
    body:
      "A transparent 3D globe built from interconnected cyan nodes and delicate network lines, with a protective shield pulsing at its core. It represents the reality of modern security — threats and defences span the entire planet in real time.",
    features: ["Live rotation", "Sequential link illumination", "Data-packet travel", "Pulsing shield core"],
    glb: "globe.glb",
    spec: "150 network nodes · transparent glass shell · PBR materials",
  },
  {
    slug: "data-cube",
    key: "cube",
    title: "Encrypted Data Cube",
    subtitle: "Encrypted data & layered security",
    tagline: "Layer upon layer of encryption.",
    body:
      "A floating crystal-glass cube with independent internal layers and a bright cyan energy core. Each face carries fine circuit patterns while miniature data structures drift between its edges — a visual for defence-in-depth and encrypted data at rest.",
    features: ["Independent rotating layers", "Per-face circuits", "Energy-core pulse", "Edge particle flow"],
    glb: "cube.glb",
    spec: "3 internal layers · metallic bevels · luminous acrylic",
  },
  {
    slug: "ai-security-core",
    key: "securityCore",
    title: "AI Security Core",
    subtitle: "Intelligent automation core",
    tagline: "Automation with a conscience.",
    body:
      "A crystalline sphere enclosing an illuminated neural processing structure, ringed by interconnected geometric orbits. It stands for AI-driven security automation — continuous analysis, progressive learning, and autonomous response.",
    features: ["Rotating inner core", "Progressive neural glow", "Orbiting energy pulse", "Floating particles"],
    glb: "securityCore.glb",
    spec: "Neural graph interior · 4 geometric rings · polished silver",
  },
];
