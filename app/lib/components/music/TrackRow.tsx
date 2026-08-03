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
 * One release, on the page's four-column grid — title in the first two
 * quarters, category in the third, tempo and (once known) duration
 * sharing the last. Category was previously a colour swatch keyed off a
 * five-hex palette; the site is greyscale-plus-one-accent, so category is
 * just a word now, same as everything else that isn't state.
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
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100000px 0px -18% 0px" }}
      transition={{ duration: reduceMotion ? 0 : beatTime(0.6), ease: EASE_OUT, delay }}
      className="relative"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isActive}
        aria-label={`${isPlayingRow ? "Pause" : "Play"} ${beat.name}, ${beat.category}, ${beat.tempo} BPM`}
        className={`grid w-full grid-cols-1 items-center gap-x-4 gap-y-1 px-2 py-3.5 text-left transition-colors duration-150 lg:grid-cols-4 ${
          isActive ? "" : "hover:bg-white/[0.02]"
        }`}
      >
        <span className="flex min-w-0 items-center gap-4 lg:col-span-2">
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
          <span className="min-w-0 flex-1">
            <span
              // Constant type size. Growing the title on activation
              // reflowed the row and drew the eye to a size change rather
              // than to what is playing; weight and colour say it without
              // moving anything.
              className={`block truncate font-sans text-[0.95rem] transition-colors duration-150 ${
                isActive
                  ? "font-semibold text-fg"
                  : "font-medium text-dim"
              }`}
            >
              {beat.name}
            </span>
            {beat.description && (
              <span className="block truncate font-sans text-sm text-dim2 lg:hidden">
                {beat.description}
              </span>
            )}
          </span>
        </span>

        <span className="hidden font-sans text-sm capitalize text-dim lg:block">
          {beat.category}
        </span>

        <span className="hidden items-center justify-between font-sans text-sm text-dim2 lg:flex">
          <span className="tabular-nums">{beat.tempo} BPM</span>
          <span className="tabular-nums">{formatTime(duration)}</span>
        </span>
      </button>

      <DrawnRule
        className={`transition-colors duration-150 ${isActive ? "!bg-accent" : ""}`}
      />
    </motion.div>
  );
}
