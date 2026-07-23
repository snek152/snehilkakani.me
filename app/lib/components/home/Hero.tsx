"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { useIntroReady } from "@/app/lib/components/AppShell";
import { EASE_OUT, EASE_INOUT } from "@/app/lib/motion";
import ViewfinderFrame from "@/app/lib/components/shared/ViewfinderFrame";
import RoleCycle from "@/app/lib/components/home/RoleCycle";
import { useRef } from "react";
import Clock from "./Clock";
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
 * Asymmetric hero. The name itself is a TRUE shared element: the `<h1>`
 * below shares `layoutId="hero-name"` with `LoadingScreen`'s name box.
 * Both are mounted simultaneously (`AppShell` renders `children`
 * unconditionally alongside the loader), so when the loader's copy
 * unmounts, Framer Motion's projection engine FLIP-animates this `<h1>`
 * in from the loader's last screen position/size — the same technique
 * used for the Gallery lightbox (`GalleryCell`/`Lightbox`). This `<h1>`
 * is the single accessible instance of the name; the loader's copy is
 * `aria-hidden`. `useIntroReady()` still gates a cascade of the
 * SUPPORTING elements only (index/coordinate readout, tagline, photo,
 * scroll cue), which appear to settle into place around the name once
 * the curtain lifts. A subtle scroll-linked parallax on the photo adds
 * depth without a gradient or a second competing motif.
 */
export default function Hero() {
  const introReady = useIntroReady();
  const reduceMotion = useReducedMotion();
  const state = introReady ? "visible" : "hidden";
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduceMotion ? 0 : 46],
  );
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
      ref={sectionRef}
      className="relative flex min-h-[95vh] flex-col justify-end overflow-hidden border-b border-border px-6 pb-10 sm:px-8 sm:pb-12 lg:px-12 lg:pb-14"
    >
      {/* faint vertical lines — structural texture */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute inset-y-0 w-px bg-border"
            style={{ left: `${25 * i}%` }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.5fr_minmax(220px,1.2fr)] lg:gap-8 mt-10">
        <div>
          <motion.h1
            layoutId={reduceMotion ? undefined : "hero-name"}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={
              reduceMotion
                ? undefined
                : { opacity: state === "visible" ? 1 : 0 }
            }
            transition={{
              layout: { duration: 0.5, ease: EASE_INOUT },
              opacity: { duration: 0.4, ease: EASE_OUT },
            }}
            className="m-0 mb-4 font-display text-[clamp(3.2rem,8.5vw,7.4rem)] leading-[0.95] font-extrabold tracking-[-0.04em] text-fg"
          >
            {NAME_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </motion.h1>

          <motion.div
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : state}
            variants={riseVariants}
          >
            <RoleCycle />
          </motion.div>
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
            {/* <ViewfinderFrame></ViewfinderFrame> */}
          </motion.p>
        </div>

        <motion.div
          className="justify-self-center lg:justify-self-end bg-card z-10 border border-border"
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? undefined : state}
          variants={photoVariants}
          style={{ y: reduceMotion ? undefined : photoY }}
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

      {/* scroll cue */}
      <motion.div
        initial={reduceMotion ? false : "hidden"}
        animate={reduceMotion ? undefined : state}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.6, delay: 0.5 } },
        }}
        className="pointer-events-none absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <motion.span
          aria-hidden
          className="h-8 w-px bg-border"
          animate={reduceMotion ? undefined : { scaleY: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: EASE_OUT }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  );
}
