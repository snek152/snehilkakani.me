"use client";

import { motion } from "motion/react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import type { Beat } from "@/app/lib/data/beats";
import { EASE_OUT } from "@/app/lib/motion";
import { beats as beatTime } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { formatTime } from "./format";

type PlaybackState = "loading" | "playing" | "paused" | "error";

/**
 * The fixed transport bar. Restyled into the site's hairline language: a
 * single rule stands in for the bar's top edge, and the scrubber is a
 * hairline that fills rather than a browser `<input type="range">` track
 * — the native input is still there, just made transparent, so dragging,
 * keyboard seeking and screen-reader semantics are unchanged.
 *
 * The one allowed flourish: while a track plays, its fill breathes at
 * *that track's* tempo (`beat.tempo`), not the page's BPM-92 grid — this
 * stays entirely inside the player and never touches entrance timing.
 */
export default function PlayerBar({
  active,
  error,
  playbackState,
  currentTime,
  duration,
  activeIndex,
  totalTracks,
  onToggle,
  onSkip,
  onScrub,
}: {
  active: Beat | null;
  error: string | null;
  playbackState: PlaybackState;
  currentTime: number;
  duration: number;
  activeIndex: number | null;
  totalTracks: number;
  onToggle: () => void;
  onSkip: (direction: 1 | -1) => void;
  onScrub: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const reduceMotion = useMotionPreference();
  const isPlaybackActive = playbackState === "playing" || playbackState === "loading";
  const isPlaying = playbackState === "playing";
  const pct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const beatSeconds = active ? 60 / active.tempo : 0;
  const pulseActive = isPlaying && !reduceMotion && beatSeconds > 0;

  if (!active) return null;

  return (
    <motion.div
      initial={reduceMotion ? false : { y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : beatTime(0.5), ease: EASE_OUT }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-bg/95 px-5 pb-4 pt-3 backdrop-blur-xl sm:px-8 lg:left-[52px]"
    >
      <span className="absolute inset-x-0 top-0 h-px bg-border" aria-hidden="true" />

      <div className="flex items-center gap-3">
        <span className="w-9 shrink-0 text-right font-sans text-xs tabular-nums text-dim2">
          {duration > 0 ? formatTime(currentTime) : "--:--"}
        </span>

        <div className="relative h-4 flex-1">
          <span
            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border"
            aria-hidden="true"
          />
          <motion.span
            className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-accent"
            style={{ width: `${pct}%` }}
            animate={pulseActive ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }}
            transition={
              pulseActive
                ? { duration: beatSeconds * 2, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0 }
            }
            aria-hidden="true"
          />
          <input
            type="range"
            aria-label={`Seek through ${active.name}`}
            aria-valuetext={
              duration > 0
                ? `${formatTime(currentTime)} of ${formatTime(duration)}`
                : "Duration unavailable"
            }
            min={0}
            max={duration || 0}
            step={0.01}
            value={Math.min(currentTime, duration || 0)}
            onChange={onScrub}
            disabled={!duration}
            className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0 disabled:cursor-default"
          />
        </div>

        <span className="w-9 shrink-0 font-sans text-xs tabular-nums text-dim2">
          {duration > 0 ? formatTime(duration) : "--:--"}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-5">
        <div className="min-w-0 flex-1">
          <div className="truncate font-sans text-sm font-medium text-fg">{active.name}</div>
          <div
            className="truncate font-sans text-xs capitalize text-dim2"
            role={error ? "alert" : "status"}
            aria-live="polite"
          >
            {error ? (
              <span className="text-dim">{error}</span>
            ) : (
              `${active.category} · ${active.tempo} BPM`
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-5">
          <button
            type="button"
            onClick={() => onSkip(-1)}
            disabled={activeIndex === 0}
            aria-label="Previous track"
            className="rounded-sm text-dim2 transition-all duration-200 hover:translate-x-0.5 hover:text-fg disabled:pointer-events-none disabled:opacity-30"
          >
            <SkipBack size={19} strokeWidth={1.6} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onToggle}
            aria-label={isPlaybackActive ? "Pause" : "Play"}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white transition-opacity duration-150 hover:opacity-90"
          >
            {isPlaybackActive ? (
              <Pause size={13} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Play size={13} strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={() => onSkip(1)}
            disabled={activeIndex === totalTracks - 1}
            aria-label="Next track"
            className="rounded-sm text-dim2 transition-all duration-200 hover:translate-x-0.5 hover:text-fg disabled:pointer-events-none disabled:opacity-30"
          >
            <SkipForward size={19} strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
