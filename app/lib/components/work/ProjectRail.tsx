"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Project } from "@/app/lib/data/projects";
import ProjectCard from "./ProjectCard";

/**
 * Desktop-only scroll translation for the secondary projects. The document
 * remains the scroll source: this section is simply tall enough for its sticky
 * rail to advance one card at a time. Touch and reduced-motion layouts retain
 * the ordinary grid rendered by WorkPage.
 */
export default function ProjectRail({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const distance = Math.max(projects.length - 1, 0) * 72;
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${distance}vw`]);

  if (reduceMotion || projects.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="project-rail-heading"
      className="relative hidden lg:block"
      style={{ height: `${Math.max(projects.length * 72, 180)}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden py-14">
        <header className="mb-8 flex items-end justify-between border-b border-border pb-5">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Selected studies
            </p>
            <h2 id="project-rail-heading" className="font-display text-4xl font-extrabold tracking-[-0.03em] text-fg">
              More work, in sequence.
            </h2>
          </div>
          <p className="text-sm tabular-nums text-dim2">SCROLL TO ADVANCE</p>
        </header>

        <motion.div style={{ x }} className="flex flex-1 gap-[8vw] pr-[12vw] will-change-transform">
          {projects.map((project, index) => (
            <div key={project.title} className="w-[64vw] shrink-0">
              <div className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-dim2">
                <span className="text-accent">{String(index + 2).padStart(2, "0")}</span>
                <span className="h-px w-8 bg-border" />
                <span>{String(projects.length + 1).padStart(2, "0")}</span>
              </div>
              <ProjectCard project={project} index={index} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
