export const profile = {
  name: "David Kuriyan E",
  firstName: "David",
  headline: "Cybersecurity Engineer",
  roles: ["Cybersecurity Engineer", "Security Analyst", "Ethical Hacker"],
  tagline: "I build secure systems — and break weak ones.",
  location: "Dindigul, Tamil Nadu, India",
  email: "davidkuriyan20@gmail.com",
  phone: "+91 96261 44272",
  github: "https://github.com/DavidKuriyan",
  githubHandle: "DavidKuriyan",
  linkedin: "https://www.linkedin.com/in/david-kuriyan",
  linkedinHandle: "david-kuriyan",
  availability: "Open to internships & freelance",
};

export const about = {
  lead: "Cybersecurity undergraduate building a career at the intersection of networking and information security.",
  body: [
    "I'm pursuing a B.E. in Computer Science and Engineering (Cyber Security), with hands-on exposure to penetration testing, vulnerability assessment, OSINT, and security analysis using industry-standard tools.",
    "I've developed security-focused software and full applications end to end — from a carrier-grade passive network intrusion detection system to a modular OSINT framework. I care about problem-solving, exploring technology, and building solutions that are both secure and efficient.",
  ],
  focus: ["VAPT", "Application Security", "Network Analysis", "OSINT"],
};

// Catchy capability domains — surfaced as highlight chips
export const capabilities = [
  { term: "VAPT", note: "Vulnerability Assessment & Penetration Testing" },
  { term: "Application Security", note: "Breaking apps before attackers do" },
  { term: "Network Analysis", note: "Reading the wire, packet by packet" },
  { term: "OWASP Top 10", note: "The attacker's playbook, memorized" },
  { term: "Vulnerability Scanning", note: "Nessus & OpenVAS at scale" },
  { term: "Pentest Labs", note: "Hands-on with Metasploitable 2" },
  { term: "Risk Assessment", note: "Find it, rank it, report it" },
  { term: "OSINT", note: "Intelligence from public signals" },
];

// Soft-skill / operator traits — catchy one-liners
export const traits = [
  { term: "Problem-Solving", note: "Comfortable in the unknown" },
  { term: "Analytical Thinking", note: "Patterns in the noise" },
  { term: "Debug & Troubleshoot", note: "Break it, then fix it" },
  { term: "Self-Learning", note: "Always leveling up" },
  { term: "Adaptability", note: "Threats change, so do I" },
  { term: "Time Management", note: "Priorities under pressure" },
  { term: "Technical Communication", note: "Findings people act on" },
  { term: "Documentation", note: "Reproducible, every time" },
  { term: "Team Collaboration", note: "Better together" },
];

export const currently = {
  label: "Currently",
  line: "Deepening my skills in VAPT and detection engineering — building tools that find problems before attackers do.",
};

export const marquee = [
  "OPEN TO INTERNSHIPS",
  "VAPT & PENTESTING",
  "SECURITY ANALYSIS",
  "OSINT",
  "NETWORK DEFENSE",
];

export type StackGroup = "Security" | "Development";

export type Tool = {
  name: string;
  group: StackGroup;
  /** real brand SVG under /public/logos */
  logo?: string;
  /** custom inline SVG mark key */
  mark?: "nmap" | "zap" | "nikto" | "nessus" | "openvas" | "java";
  /** brand color for glow/tint */
  color?: string;
};

export const arsenal: Tool[] = [
  // Security tooling
  { name: "Burp Suite", group: "Security", logo: "/logos/burpsuite.svg", color: "#ff667f" },
  { name: "OWASP ZAP", group: "Security", mark: "zap", color: "#00a5ef" },
  { name: "Nmap", group: "Security", mark: "nmap", color: "#00d294" },
  { name: "Nikto", group: "Security", mark: "nikto", color: "#ffb020" },
  { name: "Wireshark", group: "Security", logo: "/logos/wireshark.svg", color: "#00a5ef" },
  { name: "Metasploit", group: "Security", logo: "/logos/metasploit.svg", color: "#ff667f" },
  { name: "Nessus Essentials", group: "Security", mark: "nessus", color: "#00d294" },
  { name: "OpenVAS", group: "Security", mark: "openvas", color: "#00a5ef" },
  { name: "Metasploitable 2", group: "Security", logo: "/logos/metasploit.svg", color: "#ffb020" },
  // Development
  { name: "Python", group: "Development", logo: "/logos/python.svg", color: "#00a5ef" },
  { name: "Java", group: "Development", logo: "/logos/java.svg", color: "#ff667f" },
  { name: "Git", group: "Development", logo: "/logos/git.svg", color: "#ff667f" },
  { name: "GitHub", group: "Development", logo: "/logos/github.svg", color: "#d4d4d4" },
];

export type Project = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  highlights: string[];
  accent: string;
  link?: string;
};

export const projects: Project[] = [
  {
    id: "nids",
    title: "Centralized NIDS",
    tagline: "Carrier-grade passive intrusion detection",
    description:
      "A lightweight, carrier-grade, passive Network Intrusion Detection System designed for both edge monitoring and centralized security operations. It passively inspects traffic to surface suspicious activity without disrupting the network.",
    stack: ["Python", "Network Analysis", "Packet Inspection", "Detection Rules"],
    highlights: [
      "Passive monitoring — no inline disruption",
      "Edge sensors feeding a central console",
      "Built for carrier-grade traffic volumes",
    ],
    accent: "#00d294",
  },
  {
    id: "argus",
    title: "Argus OSINT Framework",
    tagline: "Modular reconnaissance & threat intelligence",
    description:
      "A modular OSINT framework for automated reconnaissance and threat intelligence analysis. Pluggable modules gather and correlate public information to build a clearer picture of a target's exposure.",
    stack: ["Python", "OSINT", "Automation", "Threat Intelligence"],
    highlights: [
      "Modular architecture — add new collectors easily",
      "Automated recon pipelines",
      "Correlates public data into actionable intel",
    ],
    accent: "#00a5ef",
  },
  {
    id: "talenthub",
    title: "TalentHub",
    tagline: "Full-stack recruitment platform",
    description:
      "A recruitment platform enabling job posting, candidate matching, interview management, and payments. Built end to end — a demonstration that I can ship secure, working products, not just find flaws in them.",
    stack: ["Full-Stack", "Candidate Matching", "Interview Mgmt", "Payments"],
    highlights: [
      "Job posting & candidate matching engine",
      "Interview scheduling & management",
      "Integrated payments",
    ],
    accent: "#ff667f",
  },
];

export const experience = [
  {
    role: "Ethical Hacking Intern",
    company: "Hackup Technology Pvt. Ltd.",
    period: "Jul 2026 – Oct 2026",
    location: "Coimbatore, Tamil Nadu",
    points: [
      "Completed a 3-month internship covering ethical hacking, web application penetration testing, IoT security, and network hardening.",
      "Gained practical exposure to vulnerability assessment and incident handling through real-time projects.",
    ],
  },
];

export const credentials = [
  {
    title: "Networking Basics",
    issuer: "Cisco",
  },
  {
    title: "Scientific Computing with Python",
    issuer: "freeCodeCamp",
  },
  {
    title: "Introduction to Cybersecurity",
    issuer: "Fortinet",
  },
];

export const education = [
  {
    degree: "B.E. Computer Science & Engineering (Cyber Security)",
    institution: "SSM Institute of Engineering and Technology, Dindigul",
    period: "2023 – Present",
    detail: "CGPA: 7.6",
  },
  {
    degree: "Higher Secondary (12th Grade)",
    institution: "St. Mary's Hr. Sec. School, Dindigul",
    period: "2021 – 2023",
    detail: "76%",
  },
];
