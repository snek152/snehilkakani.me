"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { experiences } from "@/app/lib/data/experience";
import { EASE_OUT } from "@/app/lib/motion";

import ExperienceAccordion from "./ExperienceAccordion";
import FeaturedExperience from "./FeaturedExperience";
import IndexStrip from "./IndexStrip";
import ManifestoHeading from "./ManifestoHeading";
import Marquee from "./Marquee";

const featuredExperience = experiences[0];
const remainingExperiences = experiences.slice(1);

export default function HomeContent() {
  const reduceMotion = useReducedMotion();
  const entrance = reduceMotion ? undefined : { opacity: 1, y: 0 };
  const headingRef = useRef<HTMLDivElement>(null);
  // The heading scramble-decodes the instant the reader scrolls this far
  // into view, echoing the loader's decode motif rather than a plain fade.
  const manifestoActive = useInView(headingRef, { once: true, margin: "0px 0px -35% 0px" });

  return (
    <div className="px-6 pb-20 sm:px-8 lg:px-12 lg:pb-24">
      <Marquee />

      <IndexStrip />

      <motion.section
        aria-labelledby="experience-heading"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        whileInView={entrance}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        className="mt-12"
      >
        <div ref={headingRef} className="mb-5 flex items-end justify-between gap-6">
          <ManifestoHeading
            text="Experience"
            active={manifestoActive}
            className="font-display text-[1.6rem] font-bold tracking-[-0.02em] text-fg"
          />
        </div>
        <FeaturedExperience experience={featuredExperience} />
        <ExperienceAccordion experiences={remainingExperiences} />
      </motion.section>
    </div>
  );
}
