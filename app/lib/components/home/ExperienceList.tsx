"use client";

import { motion } from "motion/react";
import type { Experience } from "@/app/lib/data/experience";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import DrawnRule from "@/app/lib/components/shared/DrawnRule";

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

  // Parts of a row arrive in reading order rather than as one block: the
  // dates first, then who and what, then the detail. Small enough that
  // it registers as the row settling rather than as a sequence.
  const row = {
    hidden: {},
    shown: { transition: { staggerChildren: beats(0.12), delayChildren: beats(0.05) } },
  };
  const part = {
    hidden: reduceMotion ? {} : { opacity: 0, y: 12 },
    shown: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : beats(0.7), ease: EASE_OUT },
    },
  };

  return (
    // Full bleed so the four columns are true page quarters — the same
    // 25% stops Hero draws its grid on and the index above divides at.
    // The boundary between the date column and the entry therefore falls
    // exactly on Hero's first line, at every width, instead of landing
    // near it by coincidence. `gap-x` is deliberately zero: a gap would
    // shrink the columns and push that boundary off the stop.
    <ol className="relative -mx-6 sm:-mx-8 lg:-mx-12">
      <DrawnRule className="absolute inset-x-0 top-0" />
      {experiences.map((experience) => (
        <motion.li
          key={experience.company + experience.title}
          initial={reduceMotion ? false : "hidden"}
          whileInView="shown"
          // Fires once the row is genuinely on screen rather than as it
          // clears the fold. Triggering sooner sounds like it shows more
          // of the animation and does the opposite: the row is still
          // below the viewport while it plays, so it is finished by the
          // time it can be seen. Only the trigger point moves — every
          // duration, delay and curve below is unchanged.
          viewport={{ once: true, amount: 0, margin: "0px 0px -18% 0px" }}
          variants={row}
          className="group relative grid gap-y-4 px-6 py-8 sm:px-8 lg:grid-cols-4 lg:gap-x-0 lg:px-0 lg:py-10"
        >
          {/* Drawn across as the row arrives, so the layout itself is
            * what moves.
            *
            * The final row skips its rule — the footer's own top border
            * closes the list a few dozen pixels below, and the two
            * together read as a doubled border. */}
          <DrawnRule className="absolute inset-x-0 bottom-0 [li:last-child_&]:hidden" />
          {/* Dates in their own column: the point of a history is the
            * sequence, and a reader scanning for "when" shouldn't have to
            * find it inside each card's prose.
            *
            * Tried pinning this while its entry is read, so the list
            * would be something you can feel your place in. It doesn't
            * work here and the measurements say why: these rows are
            * ~280px in a ~900px viewport, so the whole entry is on screen
            * at once and there is no place to lose. Pinned near the top
            * edge it engages only as the entry leaves, after it has been
            * read; pinned at a reading line it holds the date up to 136px
            * below its own heading, which reads as a misalignment next to
            * the neighbouring rows whose dates are still level with
            * theirs. Worth revisiting if an entry ever runs longer than a
            * screen. */}
          <motion.div variants={part} className="lg:pl-12 lg:pr-6">
            <p className="text-sm tabular-nums text-dim">{experience.period}</p>
            <p className="mt-1 text-sm text-dim2">{experience.location}</p>
          </motion.div>

          <div className="lg:col-span-3 lg:pl-10 lg:pr-12">
            <motion.div variants={part} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="font-display text-[1.35rem] font-bold tracking-[-0.02em] text-fg lg:text-[1.6rem]">
                {experience.company}
              </h3>
              <span className="text-base text-dim">{experience.title}</span>
            </motion.div>
            <motion.ul variants={part} className="mt-4 space-y-2">
              {experience.description.map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-[0.95rem] leading-[1.7] text-dim">
                  <span aria-hidden="true" className="mt-[0.65rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/50" />
                  <span>{line}</span>
                </li>
              ))}
            </motion.ul>
            {experience.skills && (
              /* The chips land one after another along the row, on the
                * same left-to-right axis the rule above was struck on —
                * so the last thing in the entry arrives travelling the
                * same direction as the first. */
              <motion.ul
                variants={{ hidden: {}, shown: { transition: { staggerChildren: beats(0.07) } } }}
                className="mt-5 flex flex-wrap gap-2"
              >
                {experience.skills.map((skill) => (
                  <motion.li
                    key={skill}
                    variants={{
                      hidden: reduceMotion ? {} : { opacity: 0, x: -10 },
                      shown: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: reduceMotion ? 0 : beats(0.55), ease: EASE_OUT },
                      },
                    }}
                    className="border border-border px-2.5 py-1 text-sm text-dim"
                  >
                    {skill}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
