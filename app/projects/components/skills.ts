import {
  SiCss,
  SiFirebase,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiPrisma,
  SiPython,
  SiPytorch,
  SiReact,
  SiSvelte,
  SiTailwindcss,
  SiTypescript,
  // SiVuedotjs,
} from "@icons-pack/react-simple-icons";

export const skillsList: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  colorClass: string;
  type: "frontend" | "backend";
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
    icon: SiGit,
    label: "Git",
    colorClass: "SiGit",
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
    icon: SiPytorch,
    label: "PyTorch",
    colorClass: "SiPytorch",
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
];
