"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useTransform } from "motion/react";
import { EASE_OUT } from "@/app/lib/motion";
import { beats } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { useProximity } from "@/app/lib/components/shared/CursorField";
import { navItems, type NavItem } from "@/app/lib/nav";

const BLURBS: Record<string, string> = {
  "/projects": "Selected builds and products",
  "/music": "Beats and production",
  "/gallery": "Photography portfolio",
  "/contact": "Get in touch",
};

const items = navItems.filter((item) => item.href in BLURBS);

/** A quiet wayfinding strip between Hero and Experience — a single thin
 * bar, not a section of its own. Previous versions gave this four full-
 * width rows and an elaborate scroll-linked reveal; none of that content
 * needs that much of the page, so it's collapsed to one line of compact
 * links, revealed with a plain fade like any other section.
 *
 * Each link reads the shared `CursorField`: as the pointer nears (not
 * yet hovering), a faint accent glow rises behind it — the same light
 * `CursorGlow` casts across the page, now legible on the interface
 * itself. Purely a background layer, so it never fights with the
 * label's own hover/focus color (plain CSS, unaffected by this). */
export default function IndexStrip({ layout = "bar" }: { layout?: "bar" | "panel" }) {
  const reduceMotion = useMotionPreference();

  // Two shapes for two contexts: a compact inline bar on narrow screens,
  // and on desktop a stacked panel — one row per destination — which
  // gives the end of the page a proper closing block rather than a thin
  // rule the reader scrolls straight past.
  if (layout === "panel") {
    return (
      // The block lifts as a unit — one `whileInView` on the container,
      // triggered as soon as its top edge clears the viewport bottom, so
      // the whole panel is visibly rising while the reader arrives at
      // it. The rows then cascade inside that movement rather than each
      // waiting for its own threshold, which is what made them appear
      // independently and read as nothing happening at all.
      <motion.nav
        aria-label="Explore the site"
        className="flex flex-col border-t border-border"
        initial={reduceMotion ? false : "hidden"}
        whileInView={reduceMotion ? undefined : "shown"}
        viewport={{ once: true, margin: "0px 0px -80px 0px" }}
        variants={{
          hidden: {},
          shown: { transition: { staggerChildren: beats(0.16), delayChildren: beats(0.1) } },
        }}
      >
        {items.map((item) => (
          <motion.div
            key={item.href}
            variants={{
              hidden: { opacity: 0, y: 26 },
              shown: { opacity: 1, y: 0, transition: { duration: beats(0.8), ease: EASE_OUT } },
            }}
          >
            <PanelLink item={item} />
          </motion.div>
        ))}
      </motion.nav>
    );
  }

  return (
    <motion.nav
      aria-label="Explore the site"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mt-8 border-y border-border sm:mt-10"
    >
      <ul className="flex flex-wrap">
        {items.map((item) => (
          <li key={item.href} className="border-r border-border last:border-r-0">
            <IndexLink item={item} />
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}

/**
 * A row in the panel layout. Deliberately quiet: no accent wash, no
 * accent-coloured label. The bar variant's proximity glow works because
 * it's a thin strip, but spread across four tall rows the same effect
 * turned this into the loudest block on the page and pulled the eye
 * away from the work above it.
 *
 * What's left is the register the rest of the site already uses —
 * hairline rules, a dim label that resolves to full strength on hover,
 * a `text-dim2` blurb — with the only movement being the arrow easing
 * outward. The accent stays reserved for the things that genuinely need
 * it rather than being spent on a wayfinding list.
 */
function PanelLink({ item }: { item: NavItem }) {
  return (
    <Link
      href={item.href}
      className="group flex items-center justify-between gap-6 border-b border-border py-4 no-underline last:border-b-0"
    >
      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
        <span className="font-display text-[1.05rem] font-semibold tracking-[-0.01em] text-dim transition-colors duration-200 group-hover:text-fg">
          {item.label}
        </span>
        <span className="text-sm text-dim2">{BLURBS[item.href]}</span>
      </span>
      <ArrowUpRight
        size={14}
        strokeWidth={2}
        className="shrink-0 text-dim2/60 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-dim"
      />
    </Link>
  );
}

function IndexLink({ item }: { item: NavItem }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const proximity = useProximity(ref, 140);
  const glowOpacity = useTransform(proximity, [0, 1], [0, 0.16]);

  return (
    <Link
      ref={ref}
      href={item.href}
      title={BLURBS[item.href]}
      className="group relative flex items-center gap-1.5 px-5 py-3 text-sm font-medium text-dim2 no-underline transition-colors duration-150 hover:text-accent sm:px-6"
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-accent"
        style={{ opacity: glowOpacity }}
      />
      <span className="relative">{item.label}</span>
      <ArrowUpRight
        size={13}
        strokeWidth={2}
        className="relative text-dim2/70 transition-colors duration-150 group-hover:text-accent"
      />
    </Link>
  );
}
