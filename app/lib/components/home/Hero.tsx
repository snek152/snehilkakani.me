"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "motion/react";
import { useIntroReady } from "@/app/lib/components/AppShell";
import { EASE_OUT, EASE_INOUT } from "@/app/lib/motion";
import ViewfinderFrame from "@/app/lib/components/shared/ViewfinderFrame";
import RoleCycle from "@/app/lib/components/home/RoleCycle";
import { useRef } from "react";

const NAME_LINES = ["Snehil", "Kakani"];

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

const photoVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, delay: 0.15, ease: EASE_OUT } },
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
  const photoY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 46]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[95vh] flex-col justify-end overflow-hidden border-b border-border px-6 pb-10 sm:px-8 sm:pb-12 lg:px-12 lg:pb-14"
    >
      {/* faint vertical lines — structural texture */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="absolute inset-y-0 w-px bg-border" style={{ left: `${25 * i}%` }} />
        ))}
      </div>

      <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.6fr_minmax(220px,0.9fr)] lg:gap-8">
        <div>
          <motion.h1
            layoutId={reduceMotion ? undefined : "hero-name"}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: state === "visible" ? 1 : 0 }}
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
            className="mb-6"
          >
            <RoleCycle />
          </motion.div>

          <motion.p
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : state}
            variants={riseVariants}
            className="m-0 mb-6 max-w-md text-[1.05rem] leading-[1.65] text-dim"
          >
            Computer science student, software engineer, and photographer — building tools by day,
            producing tracks and framing shots the rest of the time.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-6"
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : state}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1, ease: EASE_OUT } },
            }}
          >
            <p className="m-0 text-sm leading-none text-dim">CS · Cal Poly SLO</p>
            <span className="block h-3.5 w-px bg-border" />
            <p className="m-0 text-sm text-dim">Software · Music · Photography</p>
            <motion.div
              className="h-0.5 w-12 origin-left bg-accent"
              initial={reduceMotion ? false : { scaleX: 0 }}
              animate={reduceMotion ? undefined : { scaleX: state === "visible" ? 1 : 0 }}
              transition={{ duration: 0.45, delay: 0.3, ease: EASE_OUT }}
            />
          </motion.div>
        </div>

        <motion.div
          className="justify-self-center lg:justify-self-end"
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? undefined : state}
          variants={photoVariants}
          style={{ y: reduceMotion ? undefined : photoY }}
        >
          <ViewfinderFrame captionLeft="San Luis Obispo, CA" captionRight="01/05">
            <div className="relative aspect-[4/5] w-[220px] overflow-hidden bg-card sm:w-[260px] lg:w-[280px]">
              <Image
                src="/about.jpg"
                alt="Snehil Kakani"
                fill
                priority
                sizes="(min-width: 1024px) 280px, 260px"
                className="object-cover object-[50%_20%] grayscale-[15%]"
              />
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
