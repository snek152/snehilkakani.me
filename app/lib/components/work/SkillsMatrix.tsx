"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { skillsList, skillTypes } from "@/app/lib/data/skills";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";

type SkillType = (typeof skillTypes)[number];

const CATEGORY_LABELS: Record<SkillType, string> = {
  frontend: "Frontend",
  backend: "Backend",
  AI: "AI / ML",
  other: "Tools",
};

export default function SkillsMatrix() {
  const reduceMotion = useMotionPreference();

  return (
    <motion.section
      aria-labelledby="skills-heading"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}

      transition={{ duration: reduceMotion ? 0 : beats(0.75), ease: EASE_OUT }}
      className="mt-14 border-t border-border pt-10 lg:mt-16 lg:pt-12"
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <h2
          id="skills-heading"
          className="font-display text-[length:var(--size-display-md)] font-semibold tracking-[var(--track-display-md)] text-fg"
        >
          Skills &amp; tools
        </h2>
      </div>

      <div className="grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-4">
        {skillTypes.map((type, categoryIndex) => {
          const skills = skillsList.filter((skill) => skill.type === type);

          return (
            <motion.div
              key={type}

              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -18% 0px" }}
              transition={{
                duration: reduceMotion ? 0 : beats(0.7),
                ease: EASE_OUT,
                delay: reduceMotion ? 0 : categoryIndex * beats(0.14),
              }}
              className="relative border-b border-border p-5 sm:p-6"
            >

              <motion.span
                aria-hidden="true"
                className="absolute inset-y-0 right-0 hidden w-px bg-border sm:block"
                style={{ transformOrigin: "top" }}
                initial={reduceMotion ? false : { scaleY: 0 }}
                whileInView={reduceMotion ? undefined : { scaleY: 1 }}
                viewport={{ once: true, margin: "100000px 0px -18% 0px" }}
                transition={{
                  duration: reduceMotion ? 0 : beats(1.1),
                  ease: EASE_OUT,
                  delay: reduceMotion ? 0 : categoryIndex * beats(0.1),
                }}
              />
              <div className="mb-4 flex items-center gap-2">
                <span className="h-4 w-0.5 bg-accent" aria-hidden="true" />
                <h3 className="text-[length:var(--text-meta)] font-semibold uppercase tracking-[0.08em] text-fg">
                  {CATEGORY_LABELS[type]}
                </h3>
              </div>

              <ul>
                {skills.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="group/skill flex items-center gap-3 border-b border-border py-2.5 last:border-b-0"
                  >
                    <span aria-hidden="true">
                      <Icon className="size-3.5 shrink-0 text-dim2 transition-colors duration-150 group-hover/skill:text-accent" />
                    </span>
                    <span className="text-[length:var(--text-meta)] tracking-[var(--track-text-sm)] text-dim transition-colors duration-150 group-hover/skill:text-fg">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
