"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useTransform } from "motion/react";
import type { Project } from "@/app/lib/data/projects";
import { EASE_OUT } from "@/app/lib/motion";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { useProximity } from "@/app/lib/components/shared/CursorField";
import DrawnRule from "@/app/lib/components/shared/DrawnRule";
import { beats } from "@/app/lib/tempo";
import { ProjectLinks, ProjectSkills } from "./ProjectMeta";
import { dateRange } from "@/app/lib/format";

export default function ProjectCard({
  project,
  sequenceIndex,
}: {
  project: Project;
  sequenceIndex: number;
}) {
  const reduceMotion = useMotionPreference();
  const articleRef = useRef<HTMLElement>(null);
  const proximity = useProximity(articleRef, 320);
  const glowOpacity = useTransform(proximity, [0, 1], [0, 0.06]);
  const [active, setActive] = useState(false);
  const reversesTrajectory = sequenceIndex % 2 === 1;

  return (
    <motion.article
      ref={articleRef}
      initial={reduceMotion ? false : undefined}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocusCapture={() => setActive(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setActive(false);
      }}
      className="group relative isolate grid gap-y-5 py-10 first:pt-0 last:pb-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-0 lg:py-16 lg:last:pb-0"
    >
      <div className="absolute -inset-x-6 top-0 sm:-inset-x-8 lg:-inset-x-12 [article:first-child_&]:hidden">
        <DrawnRule />
      </div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-6 -inset-y-2 -z-10 bg-accent blur-3xl"
        style={{ opacity: glowOpacity }}
      />

      <motion.div
        className={`relative aspect-[16/10] overflow-hidden ${reversesTrajectory ? "lg:order-2" : ""}`}
        initial={reduceMotion ? false : "hidden"}
        whileInView="shown"
        viewport={{ once: true, margin: "100000px 0px -18% 0px" }}
        variants={{
          hidden: {
            clipPath: reversesTrajectory
              ? "inset(0 0 0 100%)"
              : "inset(0 100% 0 0)",
          },
          shown: {
            clipPath: "inset(0 0% 0 0)",
            transition: {
              duration: reduceMotion ? 0 : beats(1.4),
              ease: EASE_OUT,
              delay: reduceMotion ? 0 : beats(0.15),
            },
          },
        }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(min-width: 1024px) 56vw, 100vw"
          className="object-cover"
        />
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-[linear-gradient(90deg,var(--accent),color-mix(in_srgb,var(--accent)_42%,transparent),transparent)]"
          animate={{ scaleX: active ? 1 : 0.25 }}
          transition={{
            duration: reduceMotion ? 0 : beats(0.45),
            ease: EASE_OUT,
          }}
        />
      </motion.div>

      <div
        className={`flex flex-col lg:justify-center ${reversesTrajectory ? "lg:order-1 lg:pr-12" : "lg:pl-12"}`}
      >
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "100000px 0px -18% 0px" }}
          transition={{
            duration: reduceMotion ? 0 : beats(0.6),
            ease: EASE_OUT,
            delay: reduceMotion ? 0 : beats(0.23),
          }}
        >
          {project.subtitle && (
            <p className="mb-3 text-[length:var(--text-body)] tabular-nums tracking-[var(--track-text-sm)] text-dim">
              {dateRange(project.subtitle)}
            </p>
          )}
          <h3 className="font-display text-[length:var(--size-display-md)] font-semibold leading-tight tracking-[var(--track-display-md)] text-fg text-balance line-clamp-3">
            {project.title}
          </h3>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "100000px 0px -18% 0px" }}
          transition={{
            duration: reduceMotion ? 0 : beats(0.6),
            ease: EASE_OUT,
            delay: reduceMotion ? 0 : beats(0.3),
          }}
        >
          <p className="mt-3 max-w-[var(--measure-body)] text-[length:var(--text-body)] leading-[var(--leading-body)] text-dim">
            {project.description}
          </p>
          <div className="mt-5">
            <ProjectSkills skills={project.skills} />
          </div>
          <div className="mt-6">
            <ProjectLinks project={project} />
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
}
