"use client";

import Image from "next/image";
import {
  motion,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { useIntroReady } from "@/app/lib/components/AppShell";
import { EASE_OUT } from "@/app/lib/motion";
import ViewfinderFrame from "@/app/lib/components/shared/ViewfinderFrame";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { GRID_STOPS } from "@/app/lib/grid";
import RoleCycle from "@/app/lib/components/home/RoleCycle";
import { experiences } from "@/app/lib/data/experience";

const NAME_LINES = ["Snehil", "Kakani"];

const featuredExperience = experiences[0];

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

const photoVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay: 0.15, ease: EASE_OUT },
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
 * `HomeContent`/`IndexStrip` — see `HomeShell.tsx`.
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
      label: "Currently at",
      value: `${featuredExperience.company} - ${featuredExperience.title}`,
    },
    { label: "Studying", value: "Computer Science @ Cal Poly SLO" },
    { label: "Based", value: "San Luis Obispo, CA" },
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
          bottom border as the section hands off to IndexStrip below. */}
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

      <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.5fr_minmax(220px,1.2fr)] lg:gap-8 mt-10 z-10">
        <div>
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
            className="m-0 mb-4 font-display text-[clamp(3.2rem,8.5vw,7.4rem)] leading-[0.95] font-extrabold tracking-[-0.04em] text-fg"
          >
            {NAME_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </motion.h1>
          <motion.p
            aria-labelledby="home-introduction"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={entrance}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="mb-14 mt-4 text-[0.975rem] leading-[1.82] text-dim"
            id="home-introduction"
          >
            Computer science student at Cal Poly SLO. I build software, produce
            music, and shoot photos. Open to internships and interesting
            problems.
          </motion.p>
        </div>

        <motion.div
          className="justify-self-center lg:justify-self-end bg-card z-10 border border-border"
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? undefined : state}
          variants={photoVariants}
        >
          <ViewfinderFrame>
            <div className="p-3">
              <div className="relative aspect-4/5 h-55 overflow-hidden sm:h-65 lg:h-70 w-full">
                <Image
                  src="/about.jpg"
                  alt="Snehil Kakani"
                  fill
                  priority
                  sizes="(min-width: 1024px) 280px, 260px"
                  className="object-cover grayscale-15"
                />
              </div>
            </div>
            <div className="p-4 border-t-border border-t">
              <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                {STATUS.map(({ label, value }) => (
                  <div key={label}>
                    <dt className="mb-1 text-sm font-medium text-dim2">
                      {label}
                    </dt>
                    <dd className="text-[0.92rem] leading-5 font-medium text-fg">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </ViewfinderFrame>
        </motion.div>
      </div>
    </section>
  );
}
