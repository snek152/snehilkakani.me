"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { experiences } from "@/app/lib/data/experience";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";

import ExperienceList from "./ExperienceList";

import ManifestoHeading from "./ManifestoHeading";
import GridIndex from "./GridIndex";

export default function HomeContent() {
  const reduceMotion = useMotionPreference();
  const headingRef = useRef<HTMLDivElement>(null);
  // The heading scramble-decodes the instant it comes into view, echoing
  // the loader's decode motif rather than a plain fade.
  const headingActive = useInView(headingRef, { once: true });

  return (
    <div className="px-6 pb-20 sm:px-8 lg:px-12 lg:pb-12">
      <GridIndex />

      <motion.section
        aria-labelledby="experience-heading"
        className="mt-12"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: beats(0.75), ease: EASE_OUT }}
      >
        <div ref={headingRef} className="mb-6">
          <ManifestoHeading
            id="experience-heading"
            text="Experience"
            active={headingActive}
            className="font-display text-[length:var(--size-display-md)] font-semibold tracking-[var(--track-display-md)] text-fg"
          />
        </div>
        <ExperienceList experiences={experiences} />
      </motion.section>

    </div>
  );
}
