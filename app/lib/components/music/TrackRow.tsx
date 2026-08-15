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

export default function TrackRow({
  beat,
  isActive,
  isPlayingRow,
  isLoadingRow,
  duration,
  bars,
  onToggle,
  delay,
}: {
  beat: Beat;
  isActive: boolean;
  isPlayingRow: boolean;
  isLoadingRow: boolean;

  duration: number;
  bars: MotionValue<number>[];
  onToggle: () => void;

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
        className={`grid w-full grid-cols-1 items-center gap-x-4 gap-y-1 px-2 py-3.5 text-left transition-[background-color,opacity] duration-[120ms] ease-[var(--ease-press)] active:opacity-80 lg:grid-cols-[minmax(11rem,1fr)_minmax(0,2fr)_auto_auto] ${
          isActive ? "" : "hover:bg-white/[0.02]"
        }`}
      >
        <span className="sr-only" role="status" aria-live="polite">
          {isLoadingRow ? `Loading ${beat.name}` : ""}
        </span>
        <span className="flex min-w-0 flex-wrap items-center gap-4">
          <span className="flex w-5 shrink-0 items-center justify-center">
            {isLoadingRow ? (
              <motion.span
                aria-hidden="true"
                className="h-2 w-2 rounded-sm bg-accent"
                animate={reduceMotion ? { opacity: 0.55 } : { opacity: [0.35, 1, 0.35] }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: beatTime(2), repeat: Infinity, ease: EASE_OUT }
                }
              />
            ) : isPlayingRow ? (
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
            className={`block min-w-0 flex-1 truncate font-sans text-[length:var(--text-meta)] transition-colors duration-150 ${
              isActive ? "font-semibold text-fg" : "font-medium text-dim"
            }`}
          >
            {beat.name}
          </span>

          <span className="pl-3 font-sans text-[length:var(--text-micro)] tabular-nums tracking-[var(--track-text-sm)] text-dim2 lg:hidden">
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

      <DrawnRule
        ruleClassName={`transition-colors duration-150 ${isActive ? "!bg-accent" : ""}`}
      />
    </motion.div>
  );
}
