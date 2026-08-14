"use client";

import { motion, type MotionValue } from "motion/react";
import { Play } from "lucide-react";
import type { Beat } from "@/app/lib/data/beats";
import { EASE_OUT } from "@/app/lib/motion";
import { beats as beatTime } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import DrawnRule from "@/app/lib/components/shared/DrawnRule";
import BeatBars from "./BeatBars";
import { formatTime } from "./format";

/**
 * One release, on the page's four-column grid — title in the first
 * quarter, the line about the track across the middle two, tempo and
 * (once known) duration sharing the last.
 *
 * The middle used to be the category word (and before that a colour
 * swatch keyed off a five-hex palette). Category is what the filter bar
 * above is for; repeating it on all twenty-two rows only restated the
 * filter you were already looking at. The description is the one thing
 * that actually distinguishes one row from the next, so it takes that
 * space instead of being a mobile-only afterthought. Category still
 * rides along in the row's `aria-label`, where the filter's effect
 * isn't visible.
 *
 * The split follows the text rather than the grid's convenience: the
 * longest title measures 159px and the longest description 517px, so
 * the title takes one column and the description two. Under the old
 * two-and-one split the titles sat in 594px of mostly empty space while
 * every description was cut off 200px short.
 *
 * The active/playing state is carried entirely by the row's rule turning
 * accent and the level bars replacing the play glyph — nothing about the
 * row's own position, size or scale changes, so toggling a track never
 * moves anything else on the page.
 */
export default function TrackRow({
  beat,
  isActive,
  isPlayingRow,
  duration,
  bars,
  onToggle,
  delay,
}: {
  beat: Beat;
  isActive: boolean;
  isPlayingRow: boolean;
  /** Track length in seconds, baked from the audio file at authoring time. */
  duration: number;
  bars: MotionValue<number>[];
  onToggle: () => void;
  /** Entrance stagger offset, in seconds (already on the tempo grid). */
  delay: number;
}) {
  const reduceMotion = useMotionPreference();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100000px 0px -18% 0px" }}
      transition={{ duration: reduceMotion ? 0 : beatTime(0.4), ease: EASE_OUT, delay }}
      className="relative"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isActive}
        aria-label={`${isPlayingRow ? "Pause" : "Play"} ${beat.name}, ${beat.category}, ${beat.tempo} BPM`}
        // A row is the full width of the page, so the usual 0.97 press
        // scale would swing its right edge ~18px and drag every column
        // with it. Dimming the whole surface says "held" without moving
        // anything — and it works on the active row too, which has no
        // hover tint to darken.
        className={`grid w-full grid-cols-1 items-center gap-x-4 gap-y-1 px-2 py-3.5 text-left transition-[background-color,opacity] duration-[120ms] ease-[var(--ease-press)] active:opacity-80 lg:grid-cols-4 ${
          isActive ? "" : "hover:bg-white/[0.02]"
        }`}
      >
        <span className="flex min-w-0 items-center gap-4">
          <span className="flex w-5 shrink-0 items-center justify-center">
            {isPlayingRow ? (
              <BeatBars bars={bars} />
            ) : (
              <Play
                size={12}
                strokeWidth={1.75}
                className={isActive ? "text-accent" : "text-dim2"}
              />
            )}
          </span>
          <span
            // Constant type size. Growing the title on activation
            // reflowed the row and drew the eye to a size change rather
            // than to what is playing; weight and colour say it without
            // moving anything.
            className={`block min-w-0 flex-1 truncate font-sans text-[length:var(--text-meta)] transition-colors duration-150 ${
              isActive ? "font-semibold text-fg" : "font-medium text-dim"
            }`}
          >
            {beat.name}
          </span>
          {/* Below `lg` the four-column grid collapses and the BPM/duration
            * cell below is `hidden`, which used to drop tempo and length off
            * the page entirely on phones — while the flavour text kept its
            * row and truncated mid-word. That inverted the value: on a beat
            * list, tempo and length are the functional figures someone is
            * actually scanning for, and the `aria-label` above was already
            * announcing the tempo that sighted mobile visitors could not see.
            * They ride here instead, in the dead space at the end of the
            * truncating title, and the `lg` layout is untouched. */}
          <span className="shrink-0 pl-3 font-sans text-[length:var(--text-micro)] tabular-nums tracking-[var(--track-text-sm)] text-dim2 lg:hidden">
            {beat.tempo} BPM · {formatTime(duration)}
          </span>
        </span>

        {/* One cell, two placements: at `lg` it spans the middle two
          * columns; below, it stacks under the title, indented past the
          * glyph gutter (w-5 + gap-4) so it still hangs off the title's
          * left edge. */}
        <span className="block truncate pl-9 font-sans text-[length:var(--text-meta)] tracking-[var(--track-text-sm)] text-dim2 lg:col-span-2 lg:pl-0">
          {beat.description}
        </span>

        <span className="hidden items-center justify-between font-sans text-[length:var(--text-micro)] tracking-[var(--track-text-sm)] text-dim2 lg:flex">
          <span className="tabular-nums">{beat.tempo} BPM</span>
          <span className="tabular-nums">{formatTime(duration)}</span>
        </span>
      </button>

      {/* `ruleClassName`, not `className`: these classes PAINT the line (the
        * active track's rule turns accent). `className` is for layout and, on
        * an `accent` rule, lands on the wrapper rather than the line itself. */}
      <DrawnRule
        ruleClassName={`transition-colors duration-150 ${isActive ? "!bg-accent" : ""}`}
      />
    </motion.div>
  );
}
