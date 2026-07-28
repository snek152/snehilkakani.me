"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import type { Project } from "@/app/lib/data/projects";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import ProjectCard from "./ProjectCard";

/**
 * Desktop-only scroll translation for the secondary projects. The document
 * remains the scroll source: this section is simply tall enough for its sticky
 * rail to advance one card at a time. Touch and reduced-motion layouts retain
 * the ordinary grid rendered by WorkPage.
 */
export default function ProjectRail({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useMotionPreference();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const distance = Math.max(projects.length - 1, 0) * 72;
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${distance}vw`]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const lastIndex = Math.max(projects.length - 1, 0);
    setActive(Math.min(lastIndex, Math.max(0, Math.round(value * lastIndex))));
  });

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
          <p className="text-sm tabular-nums text-dim2">
            <span className="text-accent">{String(active + 2).padStart(2, "0")}</span>
            <span className="mx-1.5 text-dim2/60">/</span>
            {String(projects.length + 1).padStart(2, "0")}
          </p>
        </header>

        <motion.div style={{ x }} className="flex flex-1 gap-[8vw] pr-[12vw] will-change-transform">
          {projects.map((project, index) => (
            <div key={project.title} className="w-[64vw] shrink-0">
              <ProjectCard project={project} index={index} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
