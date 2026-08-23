"use client";

import { motion } from "motion/react";
import { Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import type { Beat } from "@/app/lib/data/beats";
import { EASE_OUT } from "@/app/lib/motion";
import { beats as beatTime } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { formatTime } from "./format";

type PlaybackState = "loading" | "playing" | "paused" | "error";

const ICON_BUTTON =
  "relative text-dim2 transition-colors duration-[120ms] ease-[var(--ease-press)] hover:text-fg focus:outline-none focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-30";

export default function PlayerBar({
  active,
  error,
  playbackState,
  currentTime,
  duration,
  displayDuration,
  activeIndex,
  totalTracks,
  onToggle,
  onSkip,
  onScrub,
  onClose,
}: {
  active: Beat;
  error: string | null;
  playbackState: PlaybackState;
  currentTime: number;
  duration: number;
  displayDuration: number;
  activeIndex: number | null;
  totalTracks: number;
  onToggle: () => void;
  onSkip: (direction: 1 | -1) => void;
  onScrub: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
}) {
  const reduceMotion = useMotionPreference();
  const isLoading = playbackState === "loading";
  const isPlaying = playbackState === "playing";
  const isPlaybackActive = isLoading || isPlaying;
  const knownDuration = displayDuration > 0;
  const elapsed = currentTime > 0 ? formatTime(currentTime) : "0:00";
  const progressPct =
    duration > 0 ? Math.min(Math.max((currentTime / duration) * 100, 0), 100) : 0;

  const playbackStatus = error
    ? error
    : isLoading
      ? `Loading ${active.name}`
      : isPlaying
        ? `Playing ${active.name}, ${elapsed} of ${knownDuration ? formatTime(displayDuration) : "unknown duration"}`
        : `Paused ${active.name}`;
  const playLabel = isLoading
    ? `Cancel loading ${active.name}`
    : isPlaying
      ? `Pause ${active.name}`
      : `Play ${active.name}`;

  return (
    <motion.div
      initial={reduceMotion ? false : { clipPath: "inset(0 0 0 100%)", opacity: 0 }}
      animate={{ clipPath: "inset(0 0 0 0%)", opacity: 1 }}
      exit={
        reduceMotion
          ? { opacity: 0, transition: { duration: 0 } }
          : { clipPath: "inset(0 0 0 100%)", opacity: 0 }
      }
      transition={{ duration: reduceMotion ? 0 : beatTime(0.55), ease: EASE_OUT }}
      className="flex w-40 min-w-0 flex-col gap-1.5 sm:w-56"
    >
      <p className="sr-only" role={error ? "alert" : "status"} aria-live="polite">
        {playbackStatus}
      </p>

      <div className="flex items-center gap-2">
        <span
          className={`min-w-0 flex-1 truncate font-sans text-[length:var(--text-meta)] font-medium ${
            error ? "text-dim" : "text-fg"
          }`}
        >
          {error ?? active.name}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close player for ${active.name}`}
          className={`${ICON_BUTTON} before:absolute before:-inset-2 before:content-['']`}
        >
          <X size={14} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onSkip(-1)}
          disabled={activeIndex === null || activeIndex === 0}
          aria-label="Previous track"
          className={`${ICON_BUTTON} before:absolute before:-inset-2.5 before:content-['']`}
        >
          <SkipBack size={14} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={isPlaying}
          aria-label={playLabel}
          className={`${ICON_BUTTON} text-fg before:absolute before:-inset-2.5 before:content-[''] hover:text-accent`}
        >
          {isPlaybackActive ? (
            <Pause size={13} strokeWidth={1} className="fill-current" aria-hidden="true" />
          ) : (
            <Play size={13} strokeWidth={1} className="fill-current" aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          onClick={() => onSkip(1)}
          disabled={activeIndex === null || activeIndex === totalTracks - 1}
          aria-label="Next track"
          className={`${ICON_BUTTON} before:absolute before:-inset-2.5 before:content-['']`}
        >
          <SkipForward size={14} strokeWidth={1.5} aria-hidden="true" />
        </button>

        <div className="relative ml-1 h-px min-w-8 flex-1 bg-border">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 bg-accent"
            style={{ width: `${progressPct}%` }}
          />
          <input
            type="range"
            aria-label={`Seek through ${active.name}`}
            aria-valuetext={
              knownDuration
                ? `${elapsed} of ${formatTime(displayDuration)}`
                : "Duration unavailable"
            }
            min={0}
            max={duration || 0}
            step={0.01}
            value={Math.min(Math.max(currentTime, 0), duration || 0)}
            onChange={onScrub}
            disabled={!duration}
            className="peer absolute -inset-y-2 inset-x-0 w-full cursor-pointer appearance-none bg-transparent opacity-0 focus:outline-none disabled:cursor-default"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-y-1 inset-x-0 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-accent"
          />
        </div>
      </div>
    </motion.div>
  );
}
