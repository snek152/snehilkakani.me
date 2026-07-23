"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Experience } from "@/app/lib/data/experience";
import { EASE_OUT } from "@/app/lib/motion";

type ExperienceRowProps = {
  experience: Experience;
  index: number;
  open: boolean;
  onToggle: () => void;
};

function ExperienceRow({ experience, index, open, onToggle }: ExperienceRowProps) {
  const reduceMotion = useReducedMotion();
  const id = useId();
  const buttonId = `experience-button-${id}`;
  const panelId = `experience-panel-${id}`;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10, rotate: index % 2 === 0 ? -0.5 : 0.5 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 260, damping: 22, delay: index * 0.05 }
      }
    >
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-1 border-b border-border bg-transparent py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)_auto_auto] sm:items-baseline sm:gap-x-6"
      >
        <span className="col-start-1 row-start-1 text-[0.95rem] font-medium text-fg">
          {experience.company}
        </span>
        <span className="col-span-2 col-start-1 row-start-2 text-sm text-dim sm:col-span-1 sm:col-start-2 sm:row-start-1">
          {experience.title}
        </span>
        <span className="col-span-2 col-start-1 row-start-3 text-sm tracking-[0.02em] text-dim2 sm:col-span-1 sm:col-start-3 sm:row-start-1">
          {experience.period}
        </span>
        <span
          aria-hidden="true"
          className={`col-start-2 row-start-1 inline-block text-base leading-none text-dim2 sm:col-start-4 ${
            open ? "rotate-45" : "rotate-0"
          } ${reduceMotion ? "" : "transition-transform duration-150"}`}
        >
          +
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: EASE_OUT }}
            className="overflow-hidden border-b border-border"
          >
            <div className="py-4 sm:pl-[calc(34%+1.5rem)]">
              <p className="mb-3 text-sm font-medium tracking-[0.04em] text-dim2 uppercase">
                {experience.location}
              </p>
              <ul className="space-y-2">
                {experience.description.map((description) => (
                  <li key={description} className="flex gap-3 text-sm leading-7 text-dim">
                    <span aria-hidden="true" className="mt-[0.68rem] h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span>{description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ExperienceAccordion({ experiences }: { experiences: Experience[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="border-t border-border">
      {experiences.map((experience, index) => (
        <ExperienceRow
          key={experience.company + experience.title}
          experience={experience}
          index={index}
          open={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}
