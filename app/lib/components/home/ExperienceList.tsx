"use client";

import { motion } from "motion/react";
import type { Experience } from "@/app/lib/data/experience";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { dateRange } from "@/app/lib/format";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import DrawnRule from "@/app/lib/components/shared/DrawnRule";

export default function ExperienceList({
  experiences,
}: {
  experiences: Experience[];
}) {
  const reduceMotion = useMotionPreference();

  const row = {
    hidden: {},
    shown: { transition: { staggerChildren: beats(0.1) } },
  };
  const part = {
    hidden: reduceMotion ? {} : { opacity: 0, y: 12 },
    shown: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : beats(0.7), ease: EASE_OUT },
    },
  };

  const content = {
    hidden: {},
    shown: { transition: { staggerChildren: beats(0.06) } },
  };

  return (
    <ol className="relative -mx-6 sm:-mx-8 lg:-mx-12">
      {experiences.map((experience) => (
        <motion.li
          key={experience.company + experience.title}
          initial={reduceMotion ? false : "hidden"}
          whileInView="shown"
          viewport={{ once: true, amount: 0, margin: "100000px 0px -6% 0px" }}
          variants={row}
          className="group relative grid gap-y-5 px-6 py-8 last:pb-0 sm:px-8 lg:grid-cols-16 lg:gap-x-0 lg:px-0 lg:py-10 lg:last:pb-0"
        >
          <DrawnRule className="absolute inset-x-0 bottom-0 [li:last-child_&]:hidden" />
          <motion.div
            variants={part}
            className="lg:col-span-4 lg:border-r lg:border-border lg:pl-12 lg:pr-10 lg:pt-2"
          >
            <p className="text-[length:var(--text-meta)] font-medium leading-snug tabular-nums text-fg">
              {dateRange(experience.period)}
            </p>

            <p className="mt-2 text-[length:var(--text-micro)] leading-snug tracking-[var(--track-text-sm)] text-dim">
              {experience.location}
            </p>
          </motion.div>

          <motion.div
            variants={content}
            className="lg:col-span-12 lg:pl-10 lg:pr-12"
          >
            <motion.div variants={part}>
              <h3 className="font-display text-[length:var(--size-display-md)] font-semibold tracking-[var(--track-display-md)] text-fg">
                {experience.company}
              </h3>
              <p className="mt-1 text-[length:var(--text-body)] leading-snug text-dim">
                {experience.title}
              </p>
            </motion.div>
            <motion.ul variants={part} className="mt-4 space-y-2">
              {experience.description.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2.5 text-[length:var(--text-body)] leading-[var(--leading-body)] text-dim"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.65rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-fg/40"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </motion.ul>
            {experience.skills && (
              <motion.ul
                variants={{
                  hidden: {},
                  shown: { transition: { staggerChildren: beats(0.07) } },
                }}
                className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5"
                aria-label="Skills and tools"
              >
                {experience.skills.map((skill) => (
                  <motion.li
                    key={skill}
                    variants={{
                      hidden: reduceMotion ? {} : { opacity: 0, x: -10 },
                      shown: {
                        opacity: 1,
                        x: 0,
                        transition: {
                          duration: reduceMotion ? 0 : beats(0.55),
                          ease: EASE_OUT,
                        },
                      },
                    }}
                    className="text-[length:var(--text-meta)] tracking-[var(--track-text-sm)] text-dim before:mr-1.5 before:text-accent before:content-['/']"
                  >
                    {skill}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </motion.div>
        </motion.li>
      ))}
    </ol>
  );
}
