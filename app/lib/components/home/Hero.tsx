"use client";

import Image from "next/image";
import { FileText } from "lucide-react";
import { motion, useTransform, type MotionValue, type Variants } from "motion/react";
import { useIntroReady } from "@/app/lib/components/AppShell";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import ViewfinderFrame from "@/app/lib/components/shared/ViewfinderFrame";
import { BORDERED_CONTROL } from "@/app/lib/components/shared/controls";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { GRID_STOPS } from "@/app/lib/grid";
import RoleCycle from "@/app/lib/components/home/RoleCycle";
import portrait from "@/public/about.jpg";

const NAME_LINES = ["Snehil", "Kakani"];

/* Both hero entrances resolve out of defocus, the same way `fadeUp` does — the
 * loader is releasing as these arrive, so the name and the card come into focus
 * as the instrument above them dissolves. Durations and delays are BPM-grid
 * derived through `beats(...)`. */
const riseVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.985, filter: "blur(9px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: beats(0.8), ease: EASE_OUT },
  },
};

const photoVariants: Variants = {
  hidden: { opacity: 0, x: 24, scale: 0.985, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: beats(1.05), delay: beats(0.25), ease: EASE_OUT },
  },
};

/**
 * Asymmetric hero. `useIntroReady()` releases the name and card under the
 * loader; its structural grid retracts as the section scrolls away.
 */
export default function Hero({
  ref,
  progress,
}: {
  ref?: React.Ref<HTMLElement>;
  progress: MotionValue<number>;
}) {
  const introReady = useIntroReady();
  const reduceMotion = useMotionPreference();
  const state = introReady ? "visible" : "hidden";
  const lineScaleY0 = useTransform(progress, [0, 0.65], reduceMotion ? [1, 1] : [1, 0]);
  const lineScaleY1 = useTransform(progress, [0.04, 0.69], reduceMotion ? [1, 1] : [1, 0]);
  const lineScaleY2 = useTransform(progress, [0.08, 0.73], reduceMotion ? [1, 1] : [1, 0]);
  const lineScaleY3 = useTransform(progress, [0.12, 0.77], reduceMotion ? [1, 1] : [1, 0]);
  const lineScaleY = [lineScaleY0, lineScaleY1, lineScaleY2, lineScaleY3];
  const lineOpacity0 = useTransform(progress, [0, 0.3], reduceMotion ? [0.25, 0.25] : [0.1, 1]);
  const lineOpacity1 = useTransform(progress, [0.04, 0.34], reduceMotion ? [0.25, 0.25] : [0.1, 1]);
  const lineOpacity2 = useTransform(progress, [0.08, 0.38], reduceMotion ? [0.25, 0.25] : [0.1, 1]);
  const lineOpacity3 = useTransform(progress, [0.12, 0.42], reduceMotion ? [0.25, 0.25] : [0.1, 1]);
  const lineOpacity = [lineOpacity0, lineOpacity1, lineOpacity2, lineOpacity3];
  const entrance = reduceMotion ? undefined : { opacity: 1, y: 0 };
  const STATUS = [
    {
      label: "Currently building",
      value: `Software and agentic infra @ Lindy`,
    },
    { label: "Studying", value: "Computer Science @ Cal Poly SLO" },
    { label: "Based in", value: "Bay Area, CA" },
    { label: "Seeking", value: "Software engineering internships" },
  ];

  return (
    <section
      ref={ref}
      className="relative flex min-h-[95vh] flex-col justify-end overflow-hidden border-b border-border px-6 pb-10 sm:px-8 sm:pb-12 lg:px-12 lg:pb-14"
    >
      <div aria-hidden className="pointer-events-none z-0 absolute inset-0">
        {GRID_STOPS.map((stop) => (
          <div
            key={stop}
            className="absolute inset-y-0 w-px bg-dim2/15"
            style={{ left: `${stop}%`, marginLeft: stop === 100 ? "-1px" : undefined }}
          />
        ))}
        {GRID_STOPS.map((stop, index) => (
          <motion.div
            key={`accent-${stop}`}
            className="absolute inset-y-0 w-px bg-accent"
            style={{
              left: `${stop}%`,
              marginLeft: stop === 100 ? "-1px" : undefined,
              scaleY: lineScaleY[index],
              transformOrigin: "bottom",
              opacity: lineOpacity[index],
            }}
          />
        ))}
      </div>

      {/* Three cells, not two, so the intro paragraph can be resequenced on
        * mobile. Below `lg` the reading order becomes role -> name -> the
        * status card -> paragraph: the card carries what a recruiter came for
        * (what he is building, what he is studying, where he is, what he
        * wants, and the resume) and in a single column it used to sit roughly
        * a screen and a half down, behind the paragraph and the portrait. The
        * paragraph is context; it can wait its turn.
        *
        * DOM order is unchanged, so assistive tech still reads the prose
        * before the card, and nothing focusable moves.
        *
        * `lg:gap-y-0` is load-bearing: with the paragraph promoted to a grid
        * child, a row gap would ALSO open between the name and the paragraph
        * on desktop, where their spacing is owned by the paragraph's own
        * `lg:mt-4`. Column gap stays 8.
        *
        * `lg:grid-rows-[1fr_auto]` is the other half of that, and without it
        * this layout is broken: the card spans both rows, so with implicit
        * `auto auto` rows the grid distributed the card's height ACROSS them
        * and opened ~90px of dead space between the name and the paragraph.
        * Pinning row 2 to the paragraph's own height and letting row 1 absorb
        * all the slack puts the pair back together, and `items-end` keeps them
        * bottom-aligned against the card exactly as they were when they shared
        * one cell. */}
      <div className="grid grid-cols-1 items-end gap-10 mt-10 z-10 lg:grid-cols-[1.5fr_minmax(220px,1.2fr)] lg:grid-rows-[1fr_auto] lg:gap-x-8 lg:gap-y-0">
        <div className="lg:col-start-1 lg:row-start-1">
          <motion.div
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : state}
            variants={riseVariants}
            className="mb-3"
          >
            <RoleCycle />
          </motion.div>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={
              reduceMotion
                ? undefined
                : {
                    opacity: state === "visible" ? 1 : 0,
                    y: state === "visible" ? 0 : 14,
                  }
            }
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="m-0 mb-4 font-display text-[length:var(--size-display-xl)] leading-[0.94] font-bold tracking-[var(--track-display-xl)] text-balance text-fg"
          >
            {NAME_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </motion.h1>
        </div>

        <motion.p
          aria-labelledby="home-introduction"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={entrance}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
          className="order-last mb-14 text-[length:var(--text-lead)] leading-[var(--leading-lead)] max-w-[var(--measure-lead)] text-dim lg:order-none lg:col-start-1 lg:row-start-2 lg:mt-4"
          id="home-introduction"
        >
          {/* "in my free time" and "video games" are deliberately gone. The
            * site gives `/music` and `/lens` the same nav weight as
            * `/builds` and backs all three with first-party work, so a
            * sentence that filed two of them under free time contradicted
            * the structure the reader is about to navigate. Video games had
            * no artifact anywhere on the site, which is the one thing every
            * claim here is supposed to have. */}
          Building intelligent systems with a focus on creating accessible
          user experiences. Producing music and shooting photography
          alongside it. Published researcher, NMSC finalist, and
          entrepreneurial award winner.
        </motion.p>

        <motion.div
          className="justify-self-center lg:justify-self-end bg-card z-10 border border-border lg:col-start-2 lg:row-start-1 lg:row-span-2"
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? undefined : state}
          variants={photoVariants}
        >
          <ViewfinderFrame>
            <div className="p-3">
              <div className="relative aspect-4/5 h-55 overflow-hidden sm:h-65 lg:h-70 w-full">
                <Image
                  src={portrait}
                  alt="Snehil Kakani"
                  fill
                  priority
                  placeholder="blur"
                  sizes="(min-width: 1024px) 280px, 260px"
                  className="object-cover object-top grayscale-15"
                />
              </div>
            </div>
            <div className="p-4 border-t-border border-t">
              <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                {STATUS.map(({ label, value }) => (
                  <div key={label}>
                    {/* `dim2` is 4.87:1 — the floor. A definition list is a
                      * two-step reading path: you find the label, then the
                      * value under it. Setting the step you land on first as
                      * the least legible text in the card inverts that.
                      * `dim` is 8.42:1 and still recedes behind the `fg`
                      * value, so the hierarchy survives the lift. */}
                    <dt className="mb-1 text-[length:var(--text-meta)] font-normal tracking-[var(--track-text-sm)] text-dim">
                      {label}
                    </dt>
                    <dd className="text-[length:var(--text-body)] leading-5 font-medium text-fg">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              <a
                href="/resume.pdf"
                download
                className={`mt-4 ${BORDERED_CONTROL}`}
              >
                <FileText className="size-3.5" aria-hidden="true" />
                Résumé
              </a>
            </div>
          </ViewfinderFrame>
        </motion.div>
      </div>
    </section>
  );
}
