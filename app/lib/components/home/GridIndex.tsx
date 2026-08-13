"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, type MotionValue, useTransform } from "motion/react";
import { GRID_LANDINGS, GRID_STOPS } from "@/app/lib/grid";
import { navItems, type NavItem } from "@/app/lib/nav";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";

const BLURBS: Record<string, string> = {
  "/builds": "Selected projects and tools",
  "/music": "Beats and production",
  "/lens": "Photography portfolio",
  "/reach": "Get in touch",
};

const items = navItems.filter((item) => item.href in BLURBS);

/** How much scroll a line takes to drop into place before it lands. */
const FALL = 0.14;

/**
 * The index between Hero and Experience — and the thing Hero's grid
 * turns into.
 *
 * Hero draws four vertical lines and retracts them as it scrolls away.
 * There are also exactly four places to go on this site. Those two facts
 * were sitting next to each other doing nothing about it: the lines
 * vanished, and the wayfinding list was a separate block at the foot of
 * the page.
 *
 * So the lines land here as the dividers of the index. Each one drops
 * into the rule at its own horizontal position, flares to accent on
 * impact, and the label in the cell it just closed rises in behind it.
 * By the time Hero is gone the page's structure has resolved into its
 * navigation — the grid was the menu the whole time.
 *
 * This replaced both a status band (a location and a clock, set in small
 * monospace, doing no work) and the separate index panel that used to sit
 * at the bottom of the page.
 */
export default function GridIndex({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const reduceMotion = useMotionPreference();
  const ruleScale = useTransform(
    progress,
    [0.12, 0.6],
    reduceMotion ? [1, 1] : [0, 1],
  );

  return (
    <nav
      aria-label="Explore the site"
      className="relative -mx-6 grid grid-cols-4 sm:-mx-8 lg:-mx-12"
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-border"
        style={{ scaleX: reduceMotion ? 1 : ruleScale }}
      />
      {items.map((item, index) => (
        <Cell
          key={item.href}
          item={item}
          progress={progress}
          landing={GRID_LANDINGS[index]}
          stop={GRID_STOPS[index]}
          first={index === 0}
          last={index === items.length - 1}
          reduceMotion={reduceMotion}
        />
      ))}
    </nav>
  );
}

function Cell({
  item,
  progress,
  landing,
  stop,
  first,
  last,
  reduceMotion,
}: {
  item: NavItem;
  progress: MotionValue<number>;
  landing: number;
  stop: number;
  first: boolean;
  last: boolean;
  reduceMotion: boolean;
}) {
  // The divider is Hero's line arriving: it grows from the rule upward as
  // that line finishes retracting above. Scroll-linked is right here —
  // it only ever travels one way and ends where it stays.
  const divider = useTransform(
    progress,
    [landing - FALL, landing],
    reduceMotion ? [1, 1] : [0, 1],
  );
  // Accent on impact, settling back to a hairline.
  const flare = useTransform(
    progress,
    [landing - FALL, landing, landing + 0.1],
    // Half strength, matching the dividers: the flare should read as a
    // line settling, not as the page flashing.
    reduceMotion ? [0, 0, 0] : [0, 0.5, 0],
  );

  // The labels do not animate in. Only the lines do: they are what Hero
  // hands down, and the eye candy belongs to them. Tying the labels to
  // the same value meant the reader arrived at the band to find four
  // blank cells, since Hero's grid does not finish landing until roughly
  // two-thirds of the way through it. Wayfinding that is invisible when
  // you reach it is not choreography, it is a missing menu.

  return (
    <>
      {/* The cell's own right-hand divider, at the matching grid stop.
       * Carried at half strength: below the border these are a
       * continuation of Hero's grid rather than the grid itself, and at
       * full weight they competed with the labels sitting between
       * them. */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 top-0 w-px origin-bottom bg-border/50"
        style={{
          left: `${stop}%`,
          marginLeft: stop === 100 ? "-1px" : undefined,
          scaleY: divider,
        }}
      />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 top-0 w-px origin-bottom bg-accent"
        style={{
          left: `${stop}%`,
          marginLeft: stop === 100 ? "-1px" : undefined,
          scaleY: divider,
          opacity: flare,
        }}
      />
      <div>
        {/* Press feedback lands on pointer-down, not on release. These four
          * cells are the site's primary wayfinding, so they have to answer
          * the finger before the navigation resolves. 0.98 rather than the
          * house 0.97: a cell is a full page quarter, and at that width the
          * extra percent reads as the panel lurching rather than as a
          * button depressing. Scale only — the label's colour is the hover
          * channel and has no business moving on press. */}
        <Link
          href={item.href}
          className={`group flex h-full items-start justify-between gap-2 py-4 no-underline transition-transform duration-[120ms] ease-[var(--ease-press)] active:scale-[0.98] sm:py-5 ${
            first ? "pl-4 sm:pl-8 lg:pl-12" : "pl-2 sm:pl-4 lg:pl-6"
          } ${last ? "pr-4 sm:pr-8 lg:pr-12" : "pr-2 sm:pr-4 lg:pr-6"}`}
        >
          <span className="min-w-0">
            <span className="block font-display text-[length:var(--size-display-sm)] font-semibold tracking-[var(--track-display-sm)] text-dim transition-colors duration-200 ease-[var(--ease-press)] group-hover:text-fg">
              {item.label}
            </span>
            {/* Was `dim2` at 4.87:1 — the faintest text on the home page,
              * sat under the labels a reader is choosing between.
              *
              * 0.78rem in the sans face is small enough that the letterfit
              * tightens optically; +0.01em opens it back to the density the
              * body copy reads at. Tracking is size-specific, so this is the
              * opposite end of the same rule the display sizes above follow
              * with their negative values. */}
            <span className="mt-1 sr-only text-[length:var(--text-micro)] leading-snug tracking-[var(--track-text-sm)] text-dim sm:not-sr-only sm:block">
              {BLURBS[item.href]}
            </span>
          </span>
          {/* Four cells across a phone leaves ~60px of usable width each;
           * the arrow is the first thing to go rather than letting a
           * label wrap.
           *
           * `translate`, not `transform`: Tailwind v4 compiles
           * `translate-x-*` to the standalone `translate` property, so a
           * `transition-transform` here would animate nothing. (The
           * parent's press uses `transition-transform`, which v4 expands
           * to `transform, translate, scale, rotate` — that one does cover
           * its `scale`.) */}
          <ArrowUpRight
            size={13}
            strokeWidth={2}
            className="mt-0.5 hidden shrink-0 text-dim2 transition-[translate,color] duration-200 ease-[var(--ease-press)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg sm:block"
          />
        </Link>
      </div>
    </>
  );
}
