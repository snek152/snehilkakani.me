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
 * A release lane in the catalog sequencer. Each row exposes the real
 * category, tempo, and duration as stable scan points; only the selected
 * release carries an output state and the live level bars.
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
      className={`relative ${isActive ? "bg-white/[0.025]" : ""}`}
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
        className={`grid w-full grid-cols-1 items-center gap-x-4 gap-y-1 px-2 py-3.5 text-left transition-[background-color,opacity] duration-[120ms] ease-[var(--ease-press)] active:opacity-80 lg:grid-cols-[minmax(11rem,1fr)_minmax(0,2fr)_auto_auto] ${
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
          {/* On phones, keep the release's actual mode, tempo, and length in
            * the title lane instead of hiding the desktop metadata. */}
          <span className="shrink-0 pl-3 font-sans text-[length:var(--text-micro)] tabular-nums tracking-[var(--track-text-sm)] text-dim2 lg:hidden">
            <span className="capitalize">{beat.category}</span> · {beat.tempo} BPM · {formatTime(duration)}
          </span>
        </span>

        <span className="block truncate pl-9 font-sans text-[length:var(--text-meta)] tracking-[var(--track-text-sm)] text-dim2 lg:pl-0">
          {beat.description}
        </span>

        <span className="hidden font-sans text-[length:var(--text-micro)] capitalize tracking-[var(--track-text-sm)] text-dim2 lg:block">
          {beat.category}
          {isActive && <span className="ml-2 text-[color:var(--accent-text)]">· routed</span>}
        </span>

        <span className="hidden items-center justify-end gap-3 font-sans text-[length:var(--text-micro)] tracking-[var(--track-text-sm)] text-dim2 lg:flex">
          <span className="tabular-nums">{beat.tempo} BPM</span>
          <span aria-hidden="true" className="h-px w-3 bg-rule" />
          <span className="tabular-nums">{formatTime(duration)}</span>
        </span>
      </button>

      {/* The active release gains a quiet surface and an output marker; the
        * rule remains the visible seam connecting its lane to the catalog
        * signal without shifting the list. */}
      <DrawnRule
        ruleClassName={`transition-colors duration-150 ${isActive ? "!bg-accent" : ""}`}
      />
    </motion.div>
  );
}
