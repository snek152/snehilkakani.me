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
import { beats } from "@/app/lib/tempo";
import ViewfinderFrame from "@/app/lib/components/shared/ViewfinderFrame";
import { BORDERED_CONTROL } from "@/app/lib/components/shared/controls";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { GRID_STOPS } from "@/app/lib/grid";
import RoleCycle from "@/app/lib/components/home/RoleCycle";
import portrait from "@/public/about.jpg";
import { socialLinks } from "../../nav";


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
  const lineScaleY = [lineScaleY0, lineScaleY1, lineScaleY2];
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
  const lineOpacity = [lineOpacity0, lineOpacity1, lineOpacity2];
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
            style={{
              left: `${stop}%`,
            }}
          />
        ))}
        {GRID_STOPS.map((stop, index) => (
          <motion.div
            key={`accent-${stop}`}
            className="absolute inset-y-0 w-px bg-accent"
            style={{
              left: `${stop}%`,
              scaleY: lineScaleY[index],
              transformOrigin: "bottom",
              opacity: lineOpacity[index],
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 items-end gap-0 mt-10 z-10 lg:grid-cols-[1.5fr_minmax(220px,1.2fr)] lg:grid-rows-[1fr_auto] lg:gap-x-8 lg:gap-y-0">
        <div className="lg:col-start-1 lg:row-start-1">
          <motion.div
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : state}
            variants={riseVariants}
            className="mb-1"
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
            Snehil Kakani
          </motion.h1>
        </div>

        <motion.p
          aria-labelledby="home-introduction"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={entrance}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
          className="mb-14 text-[length:var(--text-lead)] leading-[var(--leading-lead)] max-w-[var(--measure-lead)] text-dim lg:col-start-1 lg:row-start-2"
          id="home-introduction"
        >
          Building intelligent systems with a focus on creating accessible user
          experiences. Exploring music production, photography, and video games
          in my free time. Published researcher, NMSC finalist, and
          entrepreneurial award winner.
        </motion.p>

        <motion.div
          className="justify-self-start lg:justify-self-end bg-card z-10 border border-border lg:col-start-2 lg:row-start-1 lg:row-span-2"
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
                    <dt className="mb-1 text-[length:var(--text-meta)] font-normal tracking-[var(--track-text-sm)] text-dim">
                      {label}
                    </dt>
                    <dd className="text-[length:var(--text-body)] leading-5 font-medium text-fg">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-t-border p-4 xl:grid-cols-4">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${BORDERED_CONTROL} w-full justify-center whitespace-nowrap px-3`}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {label}
                </a>
              ))}
            </div>
          </ViewfinderFrame>
        </motion.div>
      </div>
    </section>
  );
}
