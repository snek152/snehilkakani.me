"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Experience } from "@/app/lib/data/experience";
import { EASE_OUT } from "@/app/lib/motion";
import ViewfinderFrame from "@/app/lib/components/shared/ViewfinderFrame";

/** Matches "Won 2nd place ($10K) at Cal Poly's Innovation Quest" style lines. */
const STAT_PATTERN = /\(([^)]+)\)/;
const PLACEMENT_PATTERN = /\b(\d+(?:st|nd|rd|th)\s+place)\b/i;

function extractStat(description: string[]): { amount: string; placement: string } | null {
  for (const line of description) {
    const amountMatch = line.match(STAT_PATTERN);
    const placementMatch = line.match(PLACEMENT_PATTERN);
    if (amountMatch && placementMatch) {
      return { amount: amountMatch[1], placement: placementMatch[1] };
    }
  }
  return null;
}

/**
 * Larger, standalone card for the single most notable experience entry
 * (currently `experiences[0]`, Fere). Distinct from `ExperienceAccordion`
 * rows: always expanded, with a stat callout parsed from the entry's own
 * `description` array (never duplicated as hardcoded data) sitting inside
 * a `ViewfinderFrame` so it reads as "the one that earned a closer look."
 */
export default function FeaturedExperience({ experience }: { experience: Experience }) {
  const reduceMotion = useReducedMotion();
  const stat = extractStat(experience.description);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 22 }}
      className="mb-10 grid grid-cols-1 gap-8 border border-border p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12"
    >
      <div>
        <p className="mb-2 text-sm font-medium tracking-[0.03em] text-dim2 uppercase">{experience.period}</p>
        <h3 className="font-display text-[1.5rem] font-bold tracking-[-0.01em] text-fg">
          {experience.title}
        </h3>
        <p className="mt-1 text-[1rem] text-dim">
          {experience.company} · {experience.location}
        </p>
        <ul className="mt-5 space-y-2.5">
          {experience.description.map((line) => (
            <li key={line} className="flex gap-3 text-[0.92rem] leading-7 text-dim">
              <span aria-hidden="true" className="mt-[0.7rem] h-1 w-1 shrink-0 rounded-full bg-accent" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        {experience.skills && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {experience.skills.map((skill) => (
              <li
                key={skill}
                className="border border-border px-2.5 py-1 text-sm text-dim"
              >
                {skill}
              </li>
            ))}
          </ul>
        )}
      </div>

      {stat && (
        <ViewfinderFrame className="justify-self-center lg:justify-self-end" captionLeft="Result">
          <div className="flex w-[180px] flex-col items-center gap-1 border border-border px-6 py-8 text-center">
            <span className="font-display text-[2.6rem] leading-none font-extrabold tracking-[-0.02em] text-accent">
              {stat.amount}
            </span>
            <span className="mt-1 text-[0.9rem] font-medium text-fg capitalize">{stat.placement}</span>
          </div>
        </ViewfinderFrame>
      )}
    </motion.div>
  );
}
