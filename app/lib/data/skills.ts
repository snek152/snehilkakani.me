import { createElement } from "react";
import {
  SiC,
  SiClaude,
  SiCursor,
  SiGithubcopilot,
  SiGraphql,
  SiLanggraph,
  SiOllama,
  SiCss,
  SiDeepgram,
  SiElectron,
  SiFastapi,
  SiFigma,
  SiFirebase,
  SiGit,
  SiGooglegemini,
  SiHtml5,
  SiJavascript,
  SiJupyter,
  SiLangchain,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenjdk,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiPytorch,
  SiReact,
  SiSupabase,
  SiSvelte,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
} from "@icons-pack/react-simple-icons";
function PiIcon({ className }: { className?: string }) {
  return createElement(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "currentColor",
      className,
      "aria-hidden": true,
    },
    createElement("path", {
      d: "M0 0v24h6v-6h6v-6H6V6h6v6h6V0Zm18 12v12h6V12Z",
    }),
  );
}
function CodexIcon({ className }: { className?: string }) {
  return createElement(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "currentColor",
      className,
      "aria-hidden": true,
    },
    createElement("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M8.086.457a6.105 6.105 0 013.046-.415c1.333.153 2.521.72 3.564 1.7a.117.117 0 00.107.029c1.408-.346 2.762-.224 4.061.366l.063.03.154.076c1.357.703 2.33 1.77 2.918 3.198.278.679.418 1.388.421 2.126a5.655 5.655 0 01-.18 1.631.167.167 0 00.04.155 5.982 5.982 0 011.578 2.891c.385 1.901-.01 3.615-1.183 5.14l-.182.22a6.063 6.063 0 01-2.934 1.851.162.162 0 00-.108.102c-.255.736-.511 1.364-.987 1.992-1.199 1.582-2.962 2.462-4.948 2.451-1.583-.008-2.986-.587-4.21-1.736a.145.145 0 00-.14-.032c-.518.167-1.04.191-1.604.185a5.924 5.924 0 01-2.595-.622 6.058 6.058 0 01-2.146-1.781c-.203-.269-.404-.522-.551-.821a7.74 7.74 0 01-.495-1.283 6.11 6.11 0 01-.017-3.064.166.166 0 00.008-.074.115.115 0 00-.037-.064 5.958 5.958 0 01-1.38-2.202 5.196 5.196 0 01-.333-1.589 6.915 6.915 0 01.188-2.132c.45-1.484 1.309-2.648 2.577-3.493.282-.188.55-.334.802-.438.286-.12.573-.22.861-.304a.129.129 0 00.087-.087A6.016 6.016 0 015.635 2.31C6.315 1.464 7.132.846 8.086.457zm-.804 7.85a.848.848 0 00-1.473.842l1.694 2.965-1.688 2.848a.849.849 0 001.46.864l1.94-3.272a.849.849 0 00.007-.854l-1.94-3.393zm5.446 6.24a.849.849 0 000 1.695h4.848a.849.849 0 000-1.696h-4.848z",
    }),
  );
}

export const skillTypes = [
  "language",
  "aiSystems",
  "webPlatforms",
  "dataWorkflow",
] as const;

export const skillsList: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  colorClass: string;
  type: (typeof skillTypes)[number];
}[] = [
  {
    icon: SiTypescript,
    label: "TypeScript",
    colorClass: "SiTypescript",
    type: "language",
  },
  {
    icon: SiJavascript,
    label: "JavaScript",
    colorClass: "SiJavascript",
    type: "language",
  },
  {
    icon: SiPython,
    label: "Python",
    colorClass: "SiPython",
    type: "language",
  },
  {
    icon: SiOpenjdk,
    label: "Java",
    colorClass: "SiJava",
    type: "language",
  },
  {
    icon: SiC,
    label: "C",
    colorClass: "SiC",
    type: "language",
  },
  {
    icon: SiHtml5,
    label: "HTML5",
    colorClass: "SiHtml5",
    type: "language",
  },
  {
    icon: SiCss,
    label: "CSS3",
    colorClass: "SiCss",
    type: "language",
  },
  {
    icon: SiPytorch,
    label: "PyTorch",
    colorClass: "SiPytorch",
    type: "aiSystems",
  },
  {
    icon: SiLangchain,
    label: "LangChain",
    colorClass: "SiLangchain",
    type: "aiSystems",
  },
  {
    icon: SiLanggraph,
    label: "LangGraph",
    colorClass: "SiLanggraph",
    type: "aiSystems",
  },
  {
    icon: SiDeepgram,
    label: "Deepgram",
    colorClass: "SiDeepgram",
    type: "aiSystems",
  },
  {
    icon: SiClaude,
    label: "Claude",
    colorClass: "SiClaude",
    type: "aiSystems",
  },
  {
    icon: SiGooglegemini,
    label: "Gemini",
    colorClass: "SiGooglegemini",
    type: "aiSystems",
  },
  {
    icon: SiCursor,
    label: "Cursor",
    colorClass: "SiCursor",
    type: "aiSystems",
  },
  {
    icon: SiGithubcopilot,
    label: "Copilot",
    colorClass: "SiGithubcopilot",
    type: "aiSystems",
  },
  {
    icon: CodexIcon,
    label: "Codex",
    colorClass: "Codex",
    type: "aiSystems",
  },
  {
    icon: SiOllama,
    label: "Ollama",
    colorClass: "SiOllama",
    type: "aiSystems",
  },
  {
    icon: PiIcon,
    label: "Pi",
    colorClass: "Pi",
    type: "aiSystems",
  },
  {
    icon: SiReact,
    label: "React",
    colorClass: "SiReact",
    type: "webPlatforms",
  },
  {
    icon: SiNextdotjs,
    label: "Next.js",
    colorClass: "SiNextdotjs",
    type: "webPlatforms",
  },
  {
    icon: SiTailwindcss,
    label: "Tailwind",
    colorClass: "SiTailwindcss",
    type: "webPlatforms",
  },
  {
    icon: SiSvelte,
    label: "Svelte",
    colorClass: "SiSvelte",
    type: "webPlatforms",
  },
  {
    icon: SiVuedotjs,
    label: "Vue.js",
    colorClass: "SiVuedotjs",
    type: "webPlatforms",
  },
  {
    icon: SiGraphql,
    label: "GraphQL",
    colorClass: "SiGraphql",
    type: "dataWorkflow",
  },
  {
    icon: SiFastapi,
    label: "FastAPI",
    colorClass: "SiFastapi",
    type: "webPlatforms",
  },
  {
    icon: SiNodedotjs,
    label: "Node.js",
    colorClass: "SiNodedotjs",
    type: "webPlatforms",
  },
  {
    icon: SiElectron,
    label: "Electron",
    colorClass: "SiElectron",
    type: "webPlatforms",
  },
  {
    icon: SiJupyter,
    label: "Jupyter",
    colorClass: "SiJupyter",
    type: "dataWorkflow",
  },
  {
    icon: SiPostgresql,
    label: "PostgreSQL",
    colorClass: "SiPostgresql",
    type: "dataWorkflow",
  },
  {
    icon: SiPrisma,
    label: "Prisma",
    colorClass: "SiPrisma",
    type: "dataWorkflow",
  },
  {
    icon: SiFirebase,
    label: "Firebase",
    colorClass: "SiFirebase",
    type: "dataWorkflow",
  },
  {
    icon: SiSupabase,
    label: "Supabase",
    colorClass: "SiSupabase",
    type: "dataWorkflow",
  },
  {
    icon: SiGit,
    label: "Git",
    colorClass: "SiGit",
    type: "dataWorkflow",
  },
  {
    icon: SiFigma,
    label: "Figma",
    colorClass: "SiFigma",
    type: "dataWorkflow",
  },
];
