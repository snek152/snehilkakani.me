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
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { GRID_STOPS } from "@/app/lib/grid";
import RoleCycle from "@/app/lib/components/home/RoleCycle";
import portrait from "@/public/about.jpg";
import { socialLinks } from "../../nav";

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
  const resumeLink = socialLinks.find((link) => link.label === "Résumé")!;
  const secondaryLinks = socialLinks.filter((link) => link.label !== "Résumé");

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

        <div className="lg:col-start-1 lg:row-start-2 flex flex-col">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={entrance}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="order-2 mb-4 text-[length:var(--text-lead)] leading-[var(--leading-lead)] max-w-[var(--measure-lead)] text-dim lg:mb-3"
          >
            Building intelligent systems with a focus on creating accessible
            user experiences. Exploring music production, photography, and video
            games in my free time. Published researcher, NMSC finalist, and
            entrepreneurial award winner.
          </motion.p>
          <div className="order-2 mb-5 lg:mb-7">
            <RoleCycle />
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={entrance}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.45,
              ease: EASE_OUT,
              delay: reduceMotion ? 0 : 0.08,
            }}
            className="order-1 mb-5 flex flex-wrap items-center gap-2.5 lg:order-2 lg:mb-10"
          >
            <a
              href={resumeLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-1.5 border border-accent bg-accent px-4 text-[length:var(--text-meta)] font-medium text-white transition-[opacity,scale] duration-[120ms] ease-[var(--ease-press)] hover:opacity-80 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent focus-visible:opacity-80"
            >
              <resumeLink.Icon className="size-3.5" aria-hidden="true" />
              {resumeLink.label}
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            <div className="flex flex-wrap gap-2">
              {secondaryLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="inline-flex size-10 items-center justify-center border border-border text-dim transition-[color,border-color,scale] duration-[120ms] ease-[var(--ease-press)] hover:text-fg active:scale-[0.97] focus-visible:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  <Icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="w-full justify-self-start border border-border bg-card z-10 lg:w-auto lg:justify-self-end lg:col-start-2 lg:row-start-1 lg:row-span-2"
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? undefined : state}
          variants={photoVariants}
        >
          <ViewfinderFrame>
            <div className="p-3">
              <div className="relative aspect-[16/10] w-full overflow-hidden lg:aspect-4/5 lg:h-70">
                <Image
                  src={portrait}
                  alt="Snehil Kakani"
                  fill
                  priority
                  placeholder="blur"
                  sizes="(min-width: 1024px) 280px, (min-width: 640px) calc(100vw - 4rem), calc(100vw - 3rem)"
                  className="object-cover object-top"
                />
              </div>
            </div>
            <div className="border-t border-border px-4 pb-4 pt-3">
              <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
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
          </ViewfinderFrame>
        </motion.div>
      </div>
    </section>
  );
}
