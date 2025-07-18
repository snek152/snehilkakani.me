"use client";
import Card from "@/app/components/Card";
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

const iconClasses =
  "lg:w-8 lg:h-8 h-6 w-6 text-surface/80 transition-colors duration-300 drop-shadow-md";
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

export default function Tools() {
  return (
    <Card className="col-span-2 p-0" initial={false}>
      <div className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-3 bg-background relative z-20 text-primary border-b border-secondary rounded-t-xl">
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
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke="#fbfbfb"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="relative z-10 px-2 lg:px-10 py-4 lg:py-5 flex flex-col items-center">
        <h1 className="text-3xl lg:text-4xl font-bold text-center tracking-tight text-surface mb-2 font-domine">
          <span className="text-primary">{"<"}</span>My Tools
          <span className="text-primary">{"/>"}</span>
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 w-full">
          <section className="space-y-2 flex flex-col items-center">
            <h2 className="text-lg font-semibold text-surface/80 font-mono text-center">
              {"// Frontend"}
            </h2>
            <div className="flex flex-wrap gap-3 items-center justify-center">
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
          <section className="space-y-2 flex flex-col items-center">
            <h2 className="text-lg font-semibold text-surface/80 font-mono text-center">
              {"// Backend"}
            </h2>
            <div className="flex flex-wrap gap-4 items-center">
              <SiPython className={`${iconClasses} ${iconColors.SiPython}`} />
              <SiFirebase
                className={`${iconClasses} ${iconColors.SiFirebase}`}
              />
              <SiPytorch className={`${iconClasses} ${iconColors.SiPytorch}`} />
              <SiNodedotjs
                className={`${iconClasses} ${iconColors.SiNodedotjs}`}
              />
              <SiPrisma className={`${iconClasses} ${iconColors.SiPrisma}`} />
            </div>
          </section>
        </div>
      </div>
    </Card>
  );
}
