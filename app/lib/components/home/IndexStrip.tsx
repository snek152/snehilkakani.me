"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { EASE_OUT } from "@/app/lib/motion";
import { navItems } from "@/app/lib/nav";

const BLURBS: Record<string, string> = {
  "/projects": "Selected builds and products",
  "/music": "Beats and production",
  "/gallery": "Photography portfolio",
  "/contact": "Get in touch",
};

const items = navItems.filter((item) => item.href in BLURBS);

/** Compact content-led rail between Hero and Experience, previewing every
 * other route so the homepage's middle has a destination instead of empty
 * vertical space. Reuses the site's real nav items rather than decoration.
 *
 * The three internal column dividers sit at 25/50/75% — the same three
 * positions Hero's own vertical grid lines retract into as it scrolls out.
 * Their blue ink fades in and back out over the strip's full passage through
 * the viewport; a restrained peak opacity keeps the change legible without
 * overpowering the cards. */
export default function IndexStrip() {
  const reduceMotion = useReducedMotion();
  const entrance = reduceMotion ? undefined : { opacity: 1, y: 0 };
  const navRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: navRef,
    offset: ["start end", "end start"],
  });
  const lineOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    reduceMotion ? [1, 1, 1, 1] : [0, 0.55, 0.55, 0],
  );

  return (
    <motion.nav
      ref={navRef}
      aria-label="Explore the site"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      whileInView={entrance}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      className="relative mt-10 grid grid-cols-1 divide-y divide-border sm:mt-12 sm:grid-cols-4 sm:divide-y-0"
    >
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-border"
        style={{ opacity: lineOpacity }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-border"
        style={{ opacity: lineOpacity }}
      />

      {[25, 50, 75].map((left, index) => (
        <motion.div
          key={left}
          aria-hidden
          className="absolute top-0 hidden w-px origin-top bg-accent sm:block"
          style={{ left: `${left}%`, height: "100%", opacity: lineOpacity }}
          initial={reduceMotion ? false : { scaleY: 0 }}
          whileInView={reduceMotion ? undefined : { scaleY: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.5,
            delay: 0.15 + index * 0.1,
            ease: EASE_OUT,
          }}
        />
      ))}

      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group block no-underline"
        >
          <div className="flex h-full flex-col justify-between gap-6 px-1 py-7 sm:px-6 sm:py-9">
            <ArrowUpRight
              size={17}
              strokeWidth={1.75}
              className="text-dim2 opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent group-hover:opacity-100"
            />
            <div>
              <div className="font-display text-xl font-bold tracking-[-0.02em] text-fg transition-colors duration-150 group-hover:text-accent sm:text-[1.35rem]">
                {item.label}
              </div>
              <div className="mt-1.5 text-sm leading-snug text-dim">
                {BLURBS[item.href]}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </motion.nav>
  );
}
