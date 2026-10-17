"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import type { Experience } from "@/app/lib/data/experience";
import { EASE_OUT, SPRING_UI } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { dateRange } from "@/app/lib/format";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import DrawnRule from "@/app/lib/components/shared/DrawnRule";

const FEATURED = 3;

function CompactExperience({ experience }: { experience: Experience }) {
  const reduceMotion = useMotionPreference();
  const [isOpen, setIsOpen] = useState(false);
  const [renderOpen, setRenderOpen] = useState(false);

  return (
    <motion.details
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100000px 0px -10% 0px" }}
      transition={{ duration: reduceMotion ? 0 : beats(0.5), ease: EASE_OUT }}
      open={renderOpen}
      className="group border-b border-border"
    >
      <summary
        onClick={(event) => {
          event.preventDefault();
          if (isOpen) {
            setIsOpen(false);
          } else {
            setRenderOpen(true);
            setIsOpen(true);
          }
        }}
        className="flex cursor-pointer list-none items-center justify-between gap-5 px-6 py-4 text-fg marker:hidden focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent sm:px-8 lg:px-12 [&::-webkit-details-marker]:hidden"
      >
        <span className="flex min-w-0 flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3">
          <span className="shrink-0 text-[length:var(--text-meta)] font-medium tabular-nums tracking-[var(--track-text-sm)] text-dim2">
            {dateRange(experience.period)}
          </span>
          <h3 className="text-[length:var(--text-body)] font-semibold tracking-[var(--track-text-sm)] text-fg">
            {experience.company}
            <span className="font-normal text-dim">
              {" "}
              {"\u00b7"} {experience.title}
            </span>
          </h3>
        </span>
        <Plus
          aria-hidden="true"
          className={`size-4 shrink-0 text-accent transition-transform duration-[160ms] ease-[var(--ease-press)] ${isOpen ? "rotate-45" : ""}`}
          strokeWidth={1.75}
        />
      </summary>
      <motion.div
        inert={!isOpen}
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={reduceMotion ? { duration: 0 } : SPRING_UI}
        onAnimationComplete={() => {
          if (!isOpen) setRenderOpen(false);
        }}
        className="block overflow-hidden"
      >
        <div className="px-6 pb-6 pt-1 sm:px-8 lg:px-12">
          <p className="text-[length:var(--text-micro)] leading-snug tracking-[var(--track-text-sm)] text-dim">
            {experience.location}
          </p>
          <ul className="mt-4 max-w-[var(--measure-body)] space-y-2">
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
          </ul>
          {experience.skills && (
            <ul
              className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5"
              aria-label="Skills and tools"
            >
              {experience.skills.map((skill) => (
                <li
                  key={skill}
                  className="text-[length:var(--text-meta)] tracking-[var(--track-text-sm)] text-dim before:mr-1.5 before:text-accent before:content-['/']"
                >
                  {skill}
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </motion.details>
  );
}

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

  const featured = experiences.slice(0, FEATURED);
  const rest = experiences.slice(FEATURED);

  return (
    <>
      <ol className="relative -mx-6 sm:-mx-8 lg:-mx-12">
        {featured.map((experience) => (
          <motion.li
            key={experience.company + experience.title}
            initial={reduceMotion ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0, margin: "100000px 0px -6% 0px" }}
            variants={row}
            className="group relative grid gap-y-5 px-6 py-8 sm:px-8 lg:grid-cols-16 lg:gap-x-0 lg:px-0 lg:py-10"
          >
            <DrawnRule className="absolute inset-x-0 bottom-0" />
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
                {experience.roles ? (
                  <ul className="mt-1 space-y-0.5">
                    {experience.roles.map((role) => (
                      <li
                        key={role.title}
                        className="text-[length:var(--text-body)] leading-snug text-dim"
                      >
                        {role.title}
                        <span className="tabular-nums text-dim2">
                          {" \u00b7 "}
                          {dateRange(role.period)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-[length:var(--text-body)] leading-snug text-dim">
                    {experience.title}
                  </p>
                )}
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
      <div className="-mx-6 sm:-mx-8 lg:-mx-12">
        {rest.map((experience) => (
          <CompactExperience
            key={experience.company + experience.title}
            experience={experience}
          />
        ))}
      </div>
    </>
  );
}
