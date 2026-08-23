"use client";

import { motion, type MotionValue } from "motion/react";
import { Play } from "lucide-react";
import type { Beat } from "@/app/lib/data/beats";
import { EASE_OUT } from "@/app/lib/motion";
import { beats as beatTime } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import BeatBars from "./BeatBars";
import { formatTime } from "./format";

function FeatureTrackCell({
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
      viewport={{ once: true }}
      transition={{
        duration: reduceMotion ? 0 : beatTime(0.4),
        ease: EASE_OUT,
        delay,
      }}
      className={`relative border-b border-r border-border ${isActive ? "bg-white/[0.025]" : ""}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isPlayingRow}
        aria-label={`${isLoadingRow ? "Cancel loading" : isPlayingRow ? "Pause" : "Play"} ${beat.name}, ${beat.category}, ${beat.tempo} BPM`}
        className={`flex w-full flex-col items-start gap-3 p-4 text-left transition-[background-color,opacity] duration-[120ms] ease-[var(--ease-press)] active:opacity-80 sm:p-5 ${
          isActive ? "" : "hover:bg-white/[0.02]"
        }`}
      >
        <span className="flex w-full min-w-0 items-center gap-3">
          <span className="flex h-4 w-5 shrink-0 items-center justify-center">
            {isLoadingRow ? (
              <motion.span
                aria-hidden="true"
                className="h-2 w-2 rounded-sm bg-accent"
                animate={
                  reduceMotion ? { opacity: 0.55 } : { opacity: [0.35, 1, 0.35] }
                }
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
            className={`block min-w-0 flex-1 truncate font-sans text-[length:var(--text-body)] transition-colors duration-150 ${
              isActive ? "font-semibold text-fg" : "font-medium text-dim"
            }`}
          >
            {beat.name}
          </span>
        </span>

        <span className="flex w-full items-center gap-2 font-sans text-[length:var(--text-micro)] tracking-[var(--track-text-sm)] text-dim2">
          <span className="capitalize">{beat.category}</span>
          <span aria-hidden="true" className="h-px w-3 bg-rule" />
          <span className="tabular-nums">{beat.tempo} BPM</span>
          <span aria-hidden="true" className="h-px w-3 bg-rule" />
          <span className="tabular-nums">{formatTime(duration)}</span>
        </span>
      </button>
    </motion.div>
  );
}

export default function FeatureTrackGrid({
  beats,
  activeIndex,
  playbackState,
  bars,
  durations,
  onToggle,
}: {
  beats: Beat[];
  activeIndex: number | null;
  playbackState: string;
  bars: MotionValue<number>[];
  durations: Record<string, number>;
  onToggle: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 border-l border-t border-border sm:grid-cols-2 lg:grid-cols-4">
      {beats.map((beat, position) => (
        <FeatureTrackCell
          key={beat.name}
          beat={beat}
          isActive={activeIndex === position}
          isPlayingRow={activeIndex === position && playbackState === "playing"}
          isLoadingRow={activeIndex === position && playbackState === "loading"}
          duration={durations[beat.file] ?? 0}
          bars={bars}
          onToggle={() => onToggle(position)}
          delay={position * beatTime(0.06)}
        />
      ))}
    </div>
  );
}
