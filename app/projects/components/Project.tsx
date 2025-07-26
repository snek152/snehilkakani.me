import Image from "next/image";
import { Project as ProjectT } from "../projects";
// import Card from "@/app/components/Card";
import { ArrowUpRightIcon } from "@heroicons/react/16/solid";
import React from "react";
import { motion } from "motion/react";

/*
initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.5,
            delay: 0.08 * (beats.findIndex((b) => b.name === beat.name) % 2),
          }}
 */
const Project = React.memo(({ project }: { project: ProjectT }) => {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      //   animate={{ y: 0, opacity: 1 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
        // stiffness: 60,
        delay: 0.8,
        // damping: 20,
        type: "tween",
      }}
    >
      <section
        style={{ willChange: "transform, opacity" }}
        className="w-full border-secondary bg-background relative p-0 rounded-xl overflow-hidden border-[1.5px] shadow-lg"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between gap-2 px-2 lg:px-4 py-2 lg:py-3 bg-background relative z-30 text-primary border-b border-secondary rounded-t-xl">
          {/* <span className="w-3 h-3 rounded-full bg-surface" />
        <span className="w-3 h-3 rounded-full bg-surface" />
        <span className="w-3 h-3 rounded-full bg-surface" /> */}
          <span className="text-xs font-mono text-surface/60">
            projects/{project.slug}.tsx
          </span>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center flex-shrink-0 w-5 h-5 rounded-full transition-colors duration-200 text-xs font-mono text-surface bg-primary"
              title="More information"
            >
              {/* learn more */}
              <ArrowUpRightIcon className="w-4 h-4 text-surface" />
            </a>
          )}
        </div>
        {/* Subtle grid background */}
        {/* Main content */}
        <div className="relative bg-background flex flex-col items-center">
          <Image
            src={project.image}
            alt={project.title}
            fill
            // loading="lazy"
            // quality={10}
            placeholder="empty"
            className="object-cover opacity-60"
          />
          <div className="px-6 py-6 relative z-30 flex bg-background/90 m-6 rounded-xl flex-col items-left text-left overflow-hidden border border-secondary/30">
            {/* <div className="absolute inset-0 pointer-events-none opacity-10 z-0 rounded-xl overflow-hidden">
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
            </div> */}
            <h1 className="text-2xl font-bold tracking-tight text-surface mb-2 font-domine">
              <span className="text-primary">{"<"}</span>
              {project.title}
              <span className="text-primary">{"/>"}</span>
            </h1>
            {project.subtitle && (
              <h2 className="text-sm font-semibold text-surface/80 font-mono text-left mb-3">
                <span className="text-surface/80">{"// "}</span>
                {project.subtitle}
              </h2>
            )}
            <p className="text-surface text-base w-full mb-5 font-ibm leading-relaxed">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 justify-center w-full">
              {project.skills.map(
                (skill, index) =>
                  skill && (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-primary/60 via-primary/40 to-primary/60 text-surface px-3 py-1 rounded-full text-sm font-ibm border-2 border-primary/70 shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200 font-semibold"
                    >
                      {skill}
                    </span>
                  )
              )}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
});

Project.displayName = "Project";
export default Project;
