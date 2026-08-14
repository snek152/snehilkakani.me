"use client";

import Image from "next/image";
import { FileText } from "lucide-react";
import {
  motion,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
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
 * Asymmetric hero. `useIntroReady()` flips to `visible` the instant
 * `LoadingScreen` calls `onDone` — the same tick `OrbitStage` begins its
 * counterclockwise release — so the role label, name, photo/status card,
 * and grid all start settling into place while the loader is still
 * fading out above them, rather than only appearing once it's gone. This
 * is the single accessible instance of the name; nothing in the loader
 * shares a layout id with it, so there is no duplicate name at any point
 * in the handoff.
 *
 * `progress` (0 at this section's top hitting the viewport top, 1 at its
 * bottom hitting it) is computed once by `HomeShell` and shared with
 * `HomeContent`/`GridIndex` — see `HomeShell.tsx`.
 *
 * The four vertical grid lines' own scale collapses 1 → 0 over the same
 * *width* as the site's original behavior (0.65 of scroll progress per
 * line, matching remote's [0, 0.65]/[0.05, 0.7]/[0.1, 0.75]/[0.15, 0.8])
 * — same "speed", not compressed. The stagger between lines is tightened
 * from remote's 0.05 to 0.02 ([0, 0.65]/[0.02, 0.67]/[0.04, 0.69]/
 * [0.06, 0.71]), a genuine translation (same span width, earlier start)
 * rather than a rescale — line 0 itself can't start any earlier, since
 * progress 0 is already scroll position zero. Opacity is new on top of
 * this: it peaks *before* scale finishes collapsing (e.g. line 0 hits
 * full accent brightness by progress 0.45, inside its [0, 0.65] scale
 * range) rather than sharing scale's own endpoint, so there's a real
 * window where a line is both bright and still has visible height,
 * instead of "full opacity" landing exactly on "zero height". */
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

  // Linear, two-keyframe, matching remote's rate exactly (no curvature,
  // no acceleration change). Stagger widened from 0.02 to 0.04 — still
  // ending before remote's own values (0.69/0.73/0.77 vs remote's
  // 0.7/0.75/0.8) so the "earlier than remote" fix holds, while roughly
  // doubling the visible spread between lines at any given scroll
  // position, for a more pronounced height difference across the four.
  const lineScaleY0 = useTransform(
    progress,
    [0, 0.65],
    reduceMotion ? [1, 1] : [1, 0],
  );
  const lineScaleY1 = useTransform(
    progress,
    [0.04, 0.69],
    reduceMotion ? [1, 1] : [1, 0],
  );
  const lineScaleY2 = useTransform(
    progress,
    [0.08, 0.73],
    reduceMotion ? [1, 1] : [1, 0],
  );
  const lineScaleY3 = useTransform(
    progress,
    [0.12, 0.77],
    reduceMotion ? [1, 1] : [1, 0],
  );
  const lineScaleY = [lineScaleY0, lineScaleY1, lineScaleY2, lineScaleY3];
  // Opacity ramps over the first ~70% of each line's own scale range,
  // reaching full brightness while scale still has real height left,
  // then holds at 1 through the rest (where scale continues to 0).
  const lineOpacity0 = useTransform(
    progress,
    [0, 0.3],
    reduceMotion ? [0.25, 0.25] : [0.1, 1],
  );
  const lineOpacity1 = useTransform(
    progress,
    [0.04, 0.34],
    reduceMotion ? [0.25, 0.25] : [0.1, 1],
  );
  const lineOpacity2 = useTransform(
    progress,
    [0.08, 0.38],
    reduceMotion ? [0.25, 0.25] : [0.1, 1],
  );
  const lineOpacity3 = useTransform(
    progress,
    [0.12, 0.42],
    reduceMotion ? [0.25, 0.25] : [0.1, 1],
  );
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
      {/* structural grid — a faint ambient line always sits at each
          position; an accent line retracts from the top down as the
          section scrolls out, brightening as it converges into the
          bottom border, where each line lands as a divider of the
          index in `GridIndex` below. */}
      <div aria-hidden className="pointer-events-none z-0 absolute inset-0">
        {GRID_STOPS.map((stop) => (
          <div
            key={stop}
            className="absolute inset-y-0 w-px bg-dim2/15"
            style={{
              left: `${stop}%`,
              marginLeft: stop === 100 ? "-1px" : undefined,
            }}
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
      {/* A local trace, not another ambient layer: three paths leave one
          source and resolve behind the three practices named in the intro.
          It is deliberately bound to this content field, where it can give
          systems, sound, and image a shared origin without competing with the
          recruiter-facing card or becoming page decoration. */}
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 1000 560"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-6 top-12 hidden h-[58%] overflow-visible sm:inset-x-8 lg:block lg:inset-x-12"
        initial={reduceMotion ? false : "hidden"}
        animate={reduceMotion ? undefined : state}
      >
        <defs>
          <linearGradient id="home-origin-spectrum" x1="0%" x2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
            <stop offset="46%" stopColor="currentColor" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#7567e8" stopOpacity="0.18" />
          </linearGradient>
        </defs>
        {[
          "M 138 438 C 262 414, 286 158, 492 110",
          "M 138 438 C 334 420, 404 262, 680 224",
          "M 138 438 C 372 466, 604 432, 872 344",
        ].map((path, index) => (
          <motion.path
            key={path}
            d={path}
            fill="none"
            stroke="url(#home-origin-spectrum)"
            strokeWidth="1.35"
            vectorEffect="non-scaling-stroke"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: {
                pathLength: 1,
                opacity: 1,
                transition: {
                  duration: beats(0.8),
                  delay: beats(0.18 + index * 0.12),
                  ease: EASE_OUT,
                },
              },
            }}
          />
        ))}
        <circle cx="138" cy="438" r="4" className="fill-accent" />
        <circle cx="492" cy="110" r="2" className="fill-accent" />
        <circle cx="680" cy="224" r="2" className="fill-accent" />
        <circle cx="872" cy="344" r="2" className="fill-accent" />
      </motion.svg>
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 240 120"
        preserveAspectRatio="none"
        className="pointer-events-none absolute right-6 top-10 z-0 h-24 w-40 overflow-visible text-accent/80 sm:right-8 sm:h-32 sm:w-56 lg:hidden"
        initial={reduceMotion ? false : "hidden"}
        animate={reduceMotion ? undefined : state}
      >
        <defs>
          <linearGradient id="home-origin-spectrum-compact" x1="0%" x2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
            <stop offset="46%" stopColor="currentColor" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#7567e8" stopOpacity="0.18" />
          </linearGradient>
        </defs>
        {[
          "M 28 94 C 68 89, 66 25, 122 18",
          "M 28 94 C 78 89, 100 55, 165 52",
          "M 28 94 C 90 105, 142 94, 212 76",
        ].map((path, index) => (
          <motion.path
            key={path}
            d={path}
            fill="none"
            stroke="url(#home-origin-spectrum-compact)"
            strokeWidth="1.35"
            vectorEffect="non-scaling-stroke"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: {
                pathLength: 1,
                opacity: 1,
                transition: {
                  duration: beats(0.8),
                  delay: beats(0.18 + index * 0.12),
                  ease: EASE_OUT,
                },
              },
            }}
          />
        ))}
        <circle cx="28" cy="94" r="3" className="fill-accent" />
        <circle cx="122" cy="18" r="1.5" className="fill-accent" />
        <circle cx="165" cy="52" r="1.5" className="fill-accent" />
        <circle cx="212" cy="76" r="1.5" className="fill-accent" />
      </motion.svg>

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
