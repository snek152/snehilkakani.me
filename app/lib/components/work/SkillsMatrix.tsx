"use client";

import { motion, useReducedMotion } from "motion/react";
import { skillsList, skillTypes } from "@/app/lib/data/skills";
import { EASE_OUT } from "@/app/lib/motion";

type SkillType = (typeof skillTypes)[number];

const CATEGORY_LABELS: Record<SkillType, string> = {
  frontend: "Frontend",
  backend: "Backend",
  AI: "AI / ML",
  other: "Tools",
};

export default function SkillsMatrix() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      aria-labelledby="skills-heading"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 22 }}
      className="mt-20 border-t border-border pt-14 lg:mt-24 lg:pt-16"
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <h2
          id="skills-heading"
          className="font-display text-2xl font-bold tracking-[-0.02em] text-fg"
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
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, y: 12, rotate: categoryIndex % 2 === 0 ? -0.7 : 0.7 }
              }
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: categoryIndex * 0.08,
                    }
              }
              className="border-b border-r border-border p-5 sm:p-6"
            >
              <div className="mb-4 flex items-center gap-2">
                <span className="h-4 w-0.5 bg-accent" aria-hidden="true" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.04em] text-fg">
                  {CATEGORY_LABELS[type]}
                </h3>
                <span className="ml-auto text-sm tabular-nums text-dim2">
                  {String(skills.length).padStart(2, "0")}
                </span>
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
                    <span className="text-sm text-dim transition-colors duration-150 group-hover/skill:text-fg">
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
