"use client";

import { motion, useReducedMotion } from "motion/react";
import { experiences } from "@/app/lib/data/experience";
import { EASE_OUT } from "@/app/lib/motion";
import ViewfinderFrame from "@/app/lib/components/shared/ViewfinderFrame";
import Clock from "./Clock";
import ExperienceAccordion from "./ExperienceAccordion";
import FeaturedExperience from "./FeaturedExperience";
import Marquee from "./Marquee";

const featuredExperience = experiences[0];
const remainingExperiences = experiences.slice(1);

const STATUS = [
  { label: "Currently at", value: `${featuredExperience.company} — ${featuredExperience.title}` },
  { label: "Studying", value: "Computer Science @ Cal Poly SLO" },
  { label: "Based", value: "San Luis Obispo, CA" },
  { label: "Seeking", value: "Software engineering internships" },
];

export default function HomeContent() {
  const reduceMotion = useReducedMotion();
  const entrance = reduceMotion ? undefined : { opacity: 1, y: 0 };

  return (
    <div className="px-6 pt-16 pb-20 sm:px-8 lg:px-12 lg:pt-20 lg:pb-24">
      <motion.section
        aria-labelledby="home-introduction"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        whileInView={entrance}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
        className="mb-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-[3fr_2fr] lg:gap-20"
      >
        <div>
          <p id="home-introduction" className="mt-4 max-w-2xl text-[0.975rem] leading-[1.82] text-dim">
            Computer science student at Cal Poly SLO. I build software, produce music, and shoot photos.
            Open to internships and interesting problems.
          </p>
        </div>

        <ViewfinderFrame>
          <div className="border border-border p-4">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              {STATUS.map(({ label, value }) => (
                <div key={label}>
                <dt className="mb-1 text-sm font-medium text-dim2">{label}</dt>
                  <dd className="text-[0.92rem] leading-5 font-medium text-fg">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 border-t border-border pt-4">
              <p className="text-sm font-medium text-dim2">Pacific time</p>
              <p className="mt-1 min-h-5 text-sm tabular-nums text-fg">
                <Clock />
              </p>
            </div>
          </div>
        </ViewfinderFrame>
      </motion.section>

      <Marquee />

      <motion.section
        aria-labelledby="experience-heading"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        whileInView={entrance}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        className="mt-20"
      >
        <div className="mb-5 flex items-end justify-between gap-6">
          <h2
            id="experience-heading"
            className="font-display text-[1.6rem] font-bold tracking-[-0.02em] text-fg"
          >
            Experience
          </h2>
        </div>
        <FeaturedExperience experience={featuredExperience} />
        <ExperienceAccordion experiences={remainingExperiences} />
      </motion.section>
    </div>
  );
}
