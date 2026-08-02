"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useTransform } from "motion/react";
import type { Project } from "@/app/lib/data/projects";
import { EASE_OUT } from "@/app/lib/motion";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { useProximity } from "@/app/lib/components/shared/CursorField";
import { ProjectLinks, ProjectSkills } from "./ProjectMeta";
import { projectYear, shortTitle } from "./utils";

/**
 * A single project, full width, in ordinary document flow.
 *
 * This replaced a pinned horizontal rail. The rail had to reserve a whole
 * viewport of scroll height per card, which meant its content — one card
 * tall — could never fill the space it claimed, so it left a void above
 * and below no matter how the frame was sized or centred. Laying the
 * projects out as wide rows costs nothing in vertical rhythm, gives each
 * screenshot roughly twice the width it had in the rail, and leaves the
 * page scrolling at the reader's own pace.
 */
export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduceMotion = useMotionPreference();
  const articleRef = useRef<HTMLElement>(null);
  const proximity = useProximity(articleRef, 320);
  const glowOpacity = useTransform(proximity, [0, 1], [0, 0.06]);
  const [active, setActive] = useState(false);
  const year = projectYear(project.subtitle);

  return (
    <motion.article
      ref={articleRef}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, ease: EASE_OUT }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocusCapture={() => setActive(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setActive(false);
      }}
      className="group relative isolate grid gap-x-10 gap-y-5 border-t border-border py-10 first:border-t-0 first:pt-0 last:pb-0 lg:grid-cols-[minmax(0,57fr)_minmax(0,43fr)] lg:py-14 lg:last:pb-0"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-6 -inset-y-2 -z-10 bg-accent blur-3xl"
        style={{ opacity: glowOpacity }}
      />

      <div className="relative aspect-[16/10] overflow-hidden bg-card">
        <motion.div
          className="absolute inset-0"
          animate={{ scale: !reduceMotion && active ? 1.03 : 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.65, ease: EASE_OUT }}
        >
          <Image
            src={project.image}
            alt={shortTitle(project.title)}
            fill
            sizes="(min-width: 1024px) 57vw, 100vw"
            className="object-cover"
          />
        </motion.div>
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent"
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.28, ease: EASE_OUT }}
        />
      </div>

      <div className="flex flex-col lg:justify-center">
        <div className="mb-3 flex items-center gap-3">
          {/* The index is the rail's one genuinely useful leftover: it
            * gives the list a sense of extent without a progress bar. */}
          <span aria-hidden="true" className="text-sm tabular-nums text-dim2">
            {String(index + 2).padStart(2, "0")}
          </span>
          <span aria-hidden="true" className="h-px w-8 bg-border" />
          {year && <span className="text-sm tabular-nums text-dim2">{year}</span>}
        </div>
        <h3 className="font-display text-[1.5rem] font-bold leading-tight tracking-[-0.02em] text-fg lg:text-[1.75rem]">
          {shortTitle(project.title)}
        </h3>
        <p className="mt-3 max-w-xl text-[0.9rem] leading-[1.7] text-dim">{project.description}</p>
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
