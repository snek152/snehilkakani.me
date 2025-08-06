import {
  SiCanva,
  SiCss,
  SiFastapi,
  SiFigma,
  SiFirebase,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiJupyter,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenjdk,
  SiPrisma,
  SiPython,
  SiPytorch,
  SiReact,
  SiSvelte,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
  // SiVuedotjs,
} from "@icons-pack/react-simple-icons";

export const skillTypes = ["frontend", "backend", "other", "learning"] as const;

export const skillsList: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  colorClass: string;
  type: (typeof skillTypes)[number];
}[] = [
  {
    icon: SiJavascript,
    label: "JavaScript",
    colorClass: "SiJavascript",
    type: "frontend",
  },
  {
    icon: SiTypescript,
    label: "TypeScript",
    colorClass: "SiTypescript",
    type: "frontend",
  },
  {
    icon: SiHtml5,
    label: "HTML5",
    colorClass: "SiHtml5",
    type: "frontend",
  },
  {
    icon: SiCss,
    label: "CSS3",
    colorClass: "SiCss",
    type: "frontend",
  },
  {
    icon: SiReact,
    label: "React",
    colorClass: "SiReact",
    type: "frontend",
  },
  {
    icon: SiNextdotjs,
    label: "Next.js",
    colorClass: "SiNextdotjs",
    type: "frontend",
  },
  {
    icon: SiTailwindcss,
    label: "Tailwind",
    colorClass: "SiTailwindcss",
    type: "frontend",
  },
  {
    icon: SiSvelte,
    label: "Svelte",
    colorClass: "SiSvelte",
    type: "frontend",
  },
  {
    icon: SiPython,
    label: "Python",
    colorClass: "SiPython",
    type: "backend",
  },
  {
    icon: SiFirebase,
    label: "Firebase",
    colorClass: "SiFirebase",
    type: "backend",
  },
  {
    icon: SiFastapi,
    label: "FastAPI",
    colorClass: "SiFastapi",
    type: "backend",
  },
  {
    icon: SiNodedotjs,
    label: "Node.js",
    colorClass: "SiNodedotjs",
    type: "backend",
  },
  {
    icon: SiPrisma,
    label: "Prisma",
    colorClass: "SiPrisma",
    type: "backend",
  },
  {
    icon: SiGit,
    label: "Git",
    colorClass: "SiGit",
    type: "other",
  },
  {
    icon: SiPytorch,
    label: "PyTorch",
    colorClass: "SiPytorch",
    type: "other",
  },
  {
    icon: SiJupyter,
    label: "Jupyter",
    colorClass: "SiJupyter",
    type: "other",
  },
  {
    icon: SiCanva,
    label: "Canva",
    colorClass: "SiCanva",
    type: "other",
  },
  {
    icon: SiFigma,
    label: "Figma",
    colorClass: "SiFigma",
    type: "other",
  },
  {
    icon: SiOpenjdk,
    label: "Java",
    colorClass: "SiJava",
    type: "other",
  },
  {
    icon: SiVuedotjs,
    label: "Vue.js",
    colorClass: "SiVuedotjs",
    type: "learning",
  },
];
