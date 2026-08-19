"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { Project } from "@/app/lib/data/projects";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { dateRange } from "@/app/lib/format";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { ProjectLinks, ProjectSkills } from "./ProjectMeta";

export default function FeaturedProject({ project }: { project: Project }) {
  const reduceMotion = useMotionPreference();
  const [active, setActive] = useState(false);

  const cropTransition = {
    duration: reduceMotion ? 0 : beats(1),
    ease: EASE_OUT,
  };

  const secondary = project.secondaryImage;

  const primaryImage = (
    <div className="absolute inset-0">
      <Image
        src={project.image}
        alt={project.title}
        fill
        priority
        sizes={secondary ? "50vw" : "(min-width: 1024px) 55vw, 100vw"}
        className="object-cover"
      />
    </div>
  );

  const signalSeam = (
    <motion.span
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-px origin-left bg-[linear-gradient(90deg,var(--accent),color-mix(in_srgb,var(--accent)_38%,transparent),transparent)]"
      animate={{ scaleX: active ? 1 : 0.38 }}
      transition={cropTransition}
    />
  );

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : beats(0.75), ease: EASE_OUT }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocusCapture={() => setActive(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setActive(false);
      }}
      className={`group relative grid overflow-hidden border-t border-border ${
        secondary ? "" : "lg:grid-cols-[minmax(0,1.28fr)_minmax(20rem,0.72fr)]"
      }`}
    >
      {secondary ? (
        <div className="relative overflow-hidden">
          <div className="grid aspect-[2/1] grid-cols-2 border-b border-border">
            <div className="relative overflow-hidden">
              {primaryImage}
            </div>
            <div className="relative overflow-hidden border-l border-border">
              <div className="absolute inset-0">
                <Image
                  src={secondary}
                  alt=""
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          {signalSeam}
        </div>
      ) : (
        <div className="relative min-h-[260px] overflow-hidden border-b border-border sm:min-h-[340px] lg:min-h-[430px] lg:border-b-0 lg:border-r">
          {primaryImage}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-[18%] w-px bg-[linear-gradient(to_bottom,transparent,color-mix(in_srgb,var(--accent)_62%,transparent),transparent)]"
          />
          {signalSeam}
        </div>
      )}

      <div
        className={`relative flex flex-col justify-end px-0 py-8 sm:py-10 lg:px-8 ${
          secondary ? "" : "lg:py-12"
        }`}
      >
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 h-px w-24 bg-[linear-gradient(90deg,var(--accent),transparent)]"
        />
        {project.subtitle && (
          <p className="mb-2 text-[length:var(--text-body)] tabular-nums tracking-[var(--track-text-sm)] text-dim">
            {dateRange(project.subtitle)}
          </p>
        )}
        <h3 className="font-display text-[length:var(--size-display-md)] font-semibold leading-tight tracking-[var(--track-display-md)] text-fg text-balance">
          {project.title}
        </h3>
        <p className="mt-3 text-[length:var(--text-body)] leading-[var(--leading-body)] text-dim">
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
