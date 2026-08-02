"use client";

import { motion } from "motion/react";
import type { Experience } from "@/app/lib/data/experience";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";

/**
 * The experience history, full width, in ordinary document flow.
 *
 * This replaced a pinned horizontal deck driven by a hand-written scroll
 * snapper. That design had a structural problem no amount of tuning
 * fixed: pinning reserves a viewport of scroll height per card, but a
 * horizontal rail is only one card tall, so the section always claimed
 * far more space than it could fill — hence the persistent void beneath
 * it. The snapping was the second half of the same problem: it animated
 * `window.scrollTo` while the browser's own momentum was still running,
 * so the two fought and the deck visibly corrected backwards.
 *
 * A wide row per role has neither failure mode. Each entry gets the full
 * measure for its bullets instead of a 700px card, the dates line up in
 * their own column so the history is scannable at a glance, and scrolling
 * is just scrolling.
 */
export default function ExperienceList({ experiences }: { experiences: Experience[] }) {
  const reduceMotion = useMotionPreference();

  return (
    <ol className="border-t border-border">
      {experiences.map((experience, index) => (
        <motion.li
          key={experience.company + experience.title}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0 : beats(0.5), ease: EASE_OUT }}
          className="group grid gap-x-10 gap-y-4 border-b border-border py-8 lg:grid-cols-[minmax(0,20fr)_minmax(0,80fr)] lg:py-10"
        >
          {/* Dates in their own column: the point of a history is the
            * sequence, and a reader scanning for "when" shouldn't have to
            * find it inside each card's prose. */}
          <div className="flex items-baseline gap-4 lg:flex-col lg:gap-2">
            <span aria-hidden="true" className="text-sm tabular-nums text-dim2/70">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm tabular-nums text-dim">{experience.period}</p>
              <p className="mt-1 text-sm text-dim2">{experience.location}</p>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="font-display text-[1.35rem] font-bold tracking-[-0.02em] text-fg lg:text-[1.6rem]">
                {experience.company}
              </h3>
              <span className="text-base text-dim">{experience.title}</span>
            </div>
            <ul className="mt-4 space-y-2">
              {experience.description.map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-[0.95rem] leading-[1.7] text-dim">
                  <span aria-hidden="true" className="mt-[0.65rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/50" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            {experience.skills && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {experience.skills.map((skill) => (
                  <li key={skill} className="border border-border px-2.5 py-1 text-sm text-dim">
                    {skill}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
