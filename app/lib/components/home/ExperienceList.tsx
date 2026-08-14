"use client";

import { motion } from "motion/react";
import type { Experience } from "@/app/lib/data/experience";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { dateRange } from "@/app/lib/format";
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

  // Parts of a row arrive in dependency order rather than as one block:
  // the date column — what a reader scans first, and the leftmost — leads,
  // then the company/bullets column follows as a single unit beats(0.1)
  // behind it. Two steps, not three: staggering the heading and bullets
  // as their own separate beats against the date would read as a cascade
  // rather than "when, then what".
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
  // The company heading and its bullets, staggered against each other by
  // a much smaller beat so they read as one column arriving, not a
  // further cascade off the date column. Keeps the last bullet within
  // beats(0.35) of the rule.
  const content = {
    hidden: {},
    shown: { transition: { staggerChildren: beats(0.06) } },
  };

  return (
    // Full bleed so the four columns are true page quarters — the same
    // 25% stops Hero draws its grid on and the index above divides at.
    // The boundary between the date column and the entry therefore falls
    // exactly on Hero's first line, at every width, instead of landing
    // near it by coincidence. `gap-x` is deliberately zero: a gap would
    // shrink the columns and push that boundary off the stop.
    <ol className="relative -mx-6 sm:-mx-8 lg:-mx-12">
      {/* The list's opening rule starts in the shared reading band, then the
        * rows make their own entrance. Its small beat offset preserves a
        * deliberate opening without coupling the content reveal to the
        * structural line. */}
      <DrawnRule className="absolute inset-x-0 top-0" delay={reduceMotion ? 0 : beats(0.15)} />
      {experiences.map((experience) => (
        <motion.li
          key={experience.company + experience.title}
          initial={reduceMotion ? false : "hidden"}
          whileInView="shown"
          // The huge top margin is the same trick `DrawnRule` uses, and for
          // the same reason: with no top margin a row the reader skipped —
          // scrollbar drag, End key, a reload at a restored position — never
          // fired, and its children stayed at `opacity: 0` permanently.
          // Measured: 10 skill chips invisible on desktop and 15 on mobile
          // after jumping to the foot of the page. It makes "already scrolled
          // past" count as seen.
          //
          // The row deliberately keeps its own observer margin. `DrawnRule`
          // enters a fixed 240px reading band while this keeps its established
          // -6% reveal point; matching them would couple the line to the
          // content merely to make both land in lockstep.
          viewport={{ once: true, amount: 0, margin: "100000px 0px -6% 0px" }}
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
          {/* Hierarchy by size, not by fading: both lines used to be 14px a
            * grey apart, putting the page's least legible text (`dim2`, at
            * 4.87:1) under the column a reader scans first. */}
          <motion.div variants={part} className="lg:pl-12 lg:pr-6">
            <p className="text-[length:var(--text-meta)] font-medium leading-snug tabular-nums text-fg">
              {dateRange(experience.period)}
            </p>
            {/* 0.8rem sans: at this size the face's default fit reads
              * cramped against the 0.9rem date above it. +0.01em is the
              * counterpart to the negative tracking the display sizes
              * carry — same rule, other end of the scale. */}
            <p className="mt-1.5 text-[length:var(--text-micro)] leading-snug tracking-[var(--track-text-sm)] text-dim">{experience.location}</p>
          </motion.div>

          <motion.div variants={content} className="lg:col-span-3 lg:pl-10 lg:pr-12">
            <motion.div variants={part} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="font-display text-[length:var(--size-display-md)] font-semibold tracking-[var(--track-display-md)] text-fg">
                {experience.company}
              </h3>
              <span className="text-[length:var(--text-meta)] tracking-[var(--track-text-sm)] text-dim">{experience.title}</span>
            </motion.div>
            <motion.ul variants={part} className="mt-4 space-y-2">
              {experience.description.map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-[length:var(--text-body)] leading-[var(--leading-body)] max-w-[var(--measure-body)] text-dim">
                  <span aria-hidden="true" className="mt-[0.65rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent/50" />
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
                    className="border border-border px-2.5 py-1 text-[length:var(--text-meta)] tracking-[var(--track-text-sm)] text-dim"
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
