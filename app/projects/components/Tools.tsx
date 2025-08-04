"use client";
import Card from "@/app/components/Card";
import { skillsList } from "./skills";
import React from "react";
import { motion } from "motion/react";

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
  <motion.div
    whileHover={{
      y: -5,
      transition: { duration: 0.2 },
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    }}
    className={`flex flex-col items-center justify-center bg-on-surface border-2 border-surface/5 rounded-lg p-3 gap-1 ${iconColors[colorClass]}`}
  >
    <div className="relative flex items-center justify-center mb-1">
      <Icon className="w-7 h-7 lg:w-8 lg:h-8 transition-colors duration-300 drop-shadow" />
    </div>
    <span className="block text-sm font-ibm uppercase text-surface transition-colors duration-300">
      {label}
    </span>
  </motion.div>
);

export default function Tools() {
  return (
    <Card
      className="col-span-2 p-0"
      transition={{ type: "tween", ease: "easeInOut" }}
    >
      <div className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-3 bg-background relative z-20 text-primary border-b border-secondary rounded-t-xl">
        <span className="w-3 h-3 rounded-full bg-surface" />
        <span className="w-3 h-3 rounded-full bg-surface" />
        <span className="w-3 h-3 rounded-full bg-surface" />
        <span className="ml-2 text-xs font-mono text-surface/60">
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
        <div className="grid grid-cols-1 w-full">
          {["frontend", "backend"].map((category) => (
            <div key={category}>
              <div className="flex items-center gap-2 mt-6 mb-2">
                <span className="text-xl font-semibold text-surface/80 font-mono text-center">
                  {category === "frontend" ? "// Frontend" : "// Backend"}
                </span>
                <div className="flex-1 h-px bg-surface/20 ml-2" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
                {skillsList
                  .filter((s) => s.type === category)
                  .map(({ icon, label, colorClass }) => (
                    <ToolIcon
                      icon={icon}
                      label={label}
                      colorClass={colorClass as keyof typeof iconColors}
                      key={label}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
