"use client";
import Card from "@/app/lib/components/Card";
import { skillsList, skillTypes } from "../data/skills";
import React from "react";
import * as motion from "motion/react-m";

const iconColors = {
  SiJavascript: "text-yellow-400",
  SiTypescript: "text-blue-500",
  SiHtml5: "text-orange-500",
  SiCss: "text-purple-500",
  SiReact: "text-cyan-400",
  SiNextdotjs: "text-white",
  SiTailwindcss: "text-teal-400",
  SiSvelte: "text-orange-400",
  SiGit: "text-orange-600",
  SiPython: "text-yellow-300",
  SiFirebase: "text-yellow-500",
  SiPytorch: "text-red-500",
  SiNodedotjs: "text-green-600",
  SiPrisma: "text-teal-700",
  SiFastapi: "text-teal-600",
  SiVuedotjs: "text-green-400",
  SiCanva: "text-cyan-400",
  SiFigma: "text-orange-600",
  SiJava: "text-white",
  SiJupyter: "text-orange-500",
};

const ToolIcon = ({
  icon: Icon,
  label,
  colorClass,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  colorClass: keyof typeof iconColors;
}) => (
  <div
    // whileHover={{
    //   y: -8,
    //   scale: 1.05,
    //   rotate: 1,
    //   transition: {
    //     duration: 0.1,
    //     ease: [0.25, 0.46, 0.45, 0.94],
    //   },
    // }}
    // transition={{
    //   duration: 0.1,
    // }}
    className={`flex flex-col items-center justify-center bg-on-surface/80 border-2 border-surface/5 rounded-lg p-3 gap-1 ${iconColors[colorClass]} hover:border-surface/20 hover:-translate-y-2 hover:scale-105 hover:rotate-1 cursor-default transition-all duration-300 hover:shadow-lg`}
  >
    <div className="relative flex items-center justify-center mb-1">
      <Icon className="w-7 h-7 lg:w-8 lg:h-8 transition-colors duration-300 drop-shadow" />
    </div>
    <span className="block text-sm font-ibm font-medium uppercase text-surface transition-colors duration-300 tracking-wide">
      {label}
    </span>
  </div>
);

export default function Tools() {
  return (
    <Card className="col-span-2 p-0">
      <div className="flex items-center gap-2 px-2 lg:px-3 py-1.5 lg:py-2.5 bg-background relative z-20 text-primary border-b border-secondary rounded-t-xl">
        <span className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-surface" />
        <span className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-surface" />
        <span className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-surface" />
        {/* <span className="ml-1 text-xs font-mono text-surface/60">
          projects/tools.tsx
        </span> */}
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
      <div className="relative z-10 px-2 lg:px-5 py-4 lg:py-5 flex flex-col items-center">
        <h1 className="text-3xl lg:text-4xl font-bold text-center tracking-tight text-surface mb-2 font-domine">
          <span className="text-primary">{"<"}</span>My Tools
          <span className="text-primary">{"/>"}</span>
        </h1>
        <div className="grid lg:grid-cols-2 px-3 py-1 w-full gap-10">
          {skillTypes.map((category) => (
            <div key={category}>
              <motion.div
                className="flex items-center gap-2 mb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <span className="text-xl font-semibold text-surface/80 font-mono tracking-tight text-center">
                  {"// " + category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
                <motion.div
                  className="flex-1 h-px bg-surface/20 ml-2"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                  style={{ originX: 0 }}
                />
              </motion.div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {skillsList
                  .filter((s) => s.type === category)
                  .map(({ icon, label, colorClass }, index) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.08,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    >
                      <ToolIcon
                        icon={icon}
                        label={label}
                        colorClass={colorClass as keyof typeof iconColors}
                      />
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
