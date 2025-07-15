"use client";
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
} from "@icons-pack/react-simple-icons";
import Card from "../components/Card";

const iconClasses =
  "w-10 h-10 text-surface/80 transition-colors duration-300 drop-shadow-md";
const iconColors: Record<string, string> = {
  SiJavascript: "hover:text-yellow-400",
  SiTypescript: "hover:text-blue-500",
  SiHtml5: "hover:text-orange-500",
  SiCss: "hover:text-purple-500",
  SiReact: "hover:text-cyan-400",
  SiNextdotjs: "hover:text-white",
  SiTailwindcss: "hover:text-teal-400",
  SiSvelte: "hover:text-orange-400",
  SiGit: "hover:text-orange-600",
  SiPython: "hover:text-yellow-300",
  SiFirebase: "hover:text-yellow-500",
  SiPytorch: "hover:text-red-500",
  SiNodedotjs: "hover:text-green-600",
  SiPrisma: "hover:text-teal-700",
};

export default function About() {
  return (
    <div className="min-h-screen w-full grid place-items-center gap-5 px-5 grid-cols-2">
      <Card className="col-span-2 p-0">
        <div className="flex items-center gap-2 px-4 py-3 bg-background relative z-20 text-primary border-b border-secondary rounded-t-xl">
          <span className="w-3 h-3 rounded-full bg-surface" />
          <span className="w-3 h-3 rounded-full bg-surface" />
          <span className="w-3 h-3 rounded-full bg-surface" />
          <span className="ml-4 text-xs font-mono text-surface/60">
            projects/tools.tsx
          </span>
        </div>
        <div className="absolute inset-0 pointer-events-none opacity-10 z-0">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="grid"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 32 0 L 0 0 0 32"
                  fill="none"
                  stroke="#fbfbfb"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative z-10 p-10 space-y-4">
          <h1 className="text-4xl font-bold text-center tracking-tight text-surface mb-2 font-domine">
            <span className="text-primary">{"<"}</span>My Tools
            <span className="text-primary">{"/>"}</span>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-surface/80 font-mono">
                {"// Frontend"}
              </h2>
              <div className="flex flex-wrap gap-4 items-center">
                <SiJavascript
                  className={`${iconClasses} ${iconColors.SiJavascript}`}
                />
                <SiTypescript
                  className={`${iconClasses} ${iconColors.SiTypescript}`}
                />
                <SiHtml5 className={`${iconClasses} ${iconColors.SiHtml5}`} />
                <SiCss className={`${iconClasses} ${iconColors.SiCss}`} />
                <SiReact className={`${iconClasses} ${iconColors.SiReact}`} />
                <SiNextdotjs
                  className={`${iconClasses} ${iconColors.SiNextdotjs}`}
                />
                <SiTailwindcss
                  className={`${iconClasses} ${iconColors.SiTailwindcss}`}
                />
                <SiSvelte className={`${iconClasses} ${iconColors.SiSvelte}`} />
                <SiGit className={`${iconClasses} ${iconColors.SiGit}`} />
              </div>
            </section>
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-surface/80 font-mono">
                {"// Backend"}
              </h2>
              <div className="flex flex-wrap gap-4 items-center">
                <SiPython className={`${iconClasses} ${iconColors.SiPython}`} />
                <SiFirebase
                  className={`${iconClasses} ${iconColors.SiFirebase}`}
                />
                <SiPytorch
                  className={`${iconClasses} ${iconColors.SiPytorch}`}
                />
                <SiNodedotjs
                  className={`${iconClasses} ${iconColors.SiNodedotjs}`}
                />
                <SiPrisma className={`${iconClasses} ${iconColors.SiPrisma}`} />
              </div>
            </section>
          </div>
        </div>
      </Card>
    </div>
  );
}
