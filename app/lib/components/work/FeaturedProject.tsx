"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { projects } from "@/app/lib/data/projects";
import type { Project } from "@/app/lib/data/projects";
import { EASE_OUT } from "@/app/lib/motion";
import ViewfinderFrame from "@/app/lib/components/shared/ViewfinderFrame";
import { ProjectLinks, ProjectSkills } from "./ProjectMeta";
import { projectYear, shortTitle } from "./utils";

const TILT_RANGE = 5;

export default function FeaturedProject({ project }: { project: Project }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(false);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springConfig = { stiffness: 300, damping: 30, mass: 0.6 };
  const rotateX = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [TILT_RANGE, -TILT_RANGE]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [-TILT_RANGE, TILT_RANGE]),
    springConfig
  );

  const handleImageMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleImageMouseLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE_OUT }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocusCapture={() => setActive(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setActive(false);
      }}
      className="mb-16 grid overflow-hidden border border-border lg:mb-[4.5rem] lg:grid-cols-[55fr_45fr]"
    >
      <ViewfinderFrame
        className="min-h-[220px] overflow-hidden bg-card [perspective:800px] sm:min-h-[290px] lg:min-h-[360px]"
      >
        <motion.div
          className="absolute inset-0"
          style={
            reduceMotion
              ? undefined
              : { rotateX, rotateY, transformStyle: "preserve-3d" }
          }
          animate={{ scale: !reduceMotion && active ? 1.04 : 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.75, ease: EASE_OUT }}
          onMouseMove={reduceMotion ? undefined : handleImageMouseMove}
          onMouseLeave={reduceMotion ? undefined : handleImageMouseLeave}
        >
          <Image
            src={project.image}
            alt={shortTitle(project.title)}
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
        </motion.div>
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent"
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.28, ease: EASE_OUT }}
        />
      </ViewfinderFrame>

      <div className="flex flex-col justify-end border-t border-border px-6 py-8 sm:px-8 sm:py-9 lg:border-l lg:border-t-0">
        <span className="mb-5 self-start bg-accent px-2.5 py-1 text-sm font-semibold uppercase tracking-[0.08em] text-white">
          Featured
        </span>
        {project.subtitle && (
          <p className="mb-2 text-sm font-medium text-dim2">{project.subtitle}</p>
        )}
        <h2 className="font-display text-[1.85rem] font-extrabold leading-tight tracking-[-0.03em] text-fg">
          {shortTitle(project.title)}
        </h2>
        <p className="mt-3 max-w-xl text-[0.875rem] leading-[1.72] text-dim">
          {project.description}
        </p>
        <div className="mt-5">
          <ProjectSkills skills={project.skills} />
        </div>
        <div className="mt-6">
          <ProjectLinks project={project} />
        </div>
      </div>
    </motion.article>
  );
}
