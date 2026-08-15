"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { createPortal } from "react-dom";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import type { Beat } from "@/app/lib/data/beats";
import { EASE_OUT } from "@/app/lib/motion";
import { beats as beatTime } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { TRANSPORT_CLEARANCE } from "@/app/lib/components/AppShell";
import { formatTime } from "./format";

type PlaybackState = "loading" | "playing" | "paused" | "error";

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
  level,
}: {
  active: Beat | null;
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

  level: MotionValue<number>;
}) {
  const reduceMotion = useMotionPreference();
  const isPlaybackActive = playbackState === "playing" || playbackState === "loading";
  const isPlaying = playbackState === "playing";
  const pct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const beatSeconds = active ? 60 / active.tempo : 0;
  const pulseActive = isPlaying && !reduceMotion && beatSeconds > 0;
  const knownDuration = displayDuration > 0;

  const bloom = useTransform(level, [0, 1], [0, 0.5]);

  if (!active) return null;

  const secondary = error ?? active.description ?? "";

  const elapsed = currentTime > 0 ? formatTime(currentTime) : "0:00";
  const clock = knownDuration ? `${elapsed} / ${formatTime(displayDuration)}` : "--:-- / --:--";

  return createPortal(
    <motion.div
      data-material=""
      initial={reduceMotion ? false : { y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : beatTime(0.4), ease: EASE_OUT }}
      style={{ height: TRANSPORT_CLEARANCE }}
      className="fixed bottom-0 left-0 right-0 z-30 bg-bg/95 backdrop-blur-xl lg:left-[52px]"
    >

      <div className="h-full px-6 sm:px-8 lg:px-12">
        <div className="group relative h-full">
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
            value={Math.min(currentTime, duration || 0)}
            onChange={onScrub}
            disabled={!duration}
            className="peer absolute inset-x-0 -top-5 h-11 w-full cursor-pointer appearance-none bg-transparent opacity-0 disabled:cursor-default"
          />

          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-5"
            style={{
              opacity: bloom,
              background:
                "linear-gradient(to bottom, rgb(var(--accent-rgb) / 0.28) 0%, rgb(var(--accent-rgb) / 0.06) 45%, transparent 100%)",
            }}
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden bg-border transition-[height,background-color] duration-150 ease-[var(--ease-press)] peer-active:h-[3px] peer-active:bg-dim2 peer-focus-visible:h-[3px] peer-focus-visible:bg-dim2"
          >
            <motion.span
              className="block h-full bg-accent"
              style={{ width: `${pct}%` }}
              animate={pulseActive ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }}
              transition={
                pulseActive
                  ? { duration: beatSeconds * 2, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0 }
              }
            />

            {!reduceMotion && (
              <motion.span
                key={activeIndex}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 block h-full bg-accent"
                style={{ transformOrigin: "left" }}
                initial={{ scaleX: 0, opacity: 1 }}
                animate={{ scaleX: 1, opacity: 0 }}
                transition={{
                  scaleX: { duration: beatTime(0.35), ease: EASE_OUT, delay: beatTime(0.25) },
                  opacity: {
                    duration: beatTime(0.35),
                    ease: EASE_OUT,
                    delay: beatTime(0.25) + beatTime(0.35),
                  },
                }}
              />
            )}
          </span>

          <span
            aria-hidden="true"
            style={{ left: `${pct}%` }}
            className="pointer-events-none absolute top-0 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-0 transition-[opacity,scale] duration-[120ms] ease-[var(--ease-press)] motion-reduce:transition-none group-hover:opacity-100 peer-focus-visible:opacity-100 peer-active:opacity-100 peer-active:scale-125"
          />

          <p className="sr-only" role={error ? "alert" : "status"} aria-live="polite">
            {error ?? ""}
          </p>

          <div className="flex h-full items-center gap-4 px-2 lg:grid lg:grid-cols-4 lg:gap-x-4">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <span className="hidden w-5 shrink-0 lg:block" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-sans text-[length:var(--text-meta)] font-semibold text-fg">
                  {active.name}
                </span>

                {error && (
                  <span aria-hidden="true" className="block truncate font-sans text-[length:var(--text-meta)] tracking-[var(--track-text-sm)] text-dim lg:hidden">
                    {error}
                  </span>
                )}
              </span>
            </div>

            <div
              aria-hidden="true"
              className={`hidden truncate font-sans text-[length:var(--text-meta)] tracking-[var(--track-text-sm)] lg:col-span-2 lg:block ${
                error ? "text-dim" : "text-dim2"
              }`}
            >
              {secondary}
            </div>

            <div className="flex shrink-0 items-center font-sans text-dim2">
              <span className="hidden text-[length:var(--text-micro)] tracking-[var(--track-text-sm)] tabular-nums xl:inline">
                {active.tempo} BPM
              </span>

              <span className="ml-auto flex flex-col items-end gap-1.5 lg:flex-row lg:items-center lg:gap-6">
                <span className="text-[length:var(--text-micro)] tracking-[var(--track-text-sm)] tabular-nums">{clock}</span>
                <span className="flex items-center gap-3 lg:gap-4">
                  <button
                    type="button"
                    onClick={() => onSkip(-1)}
                    disabled={activeIndex === 0}
                    aria-label="Previous track"
                    className="relative text-dim2 transition-[color,scale] duration-[120ms] ease-[var(--ease-press)] before:absolute before:-inset-3.5 before:content-[''] hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-90 active:text-fg active:before:-inset-4.5 disabled:pointer-events-none disabled:opacity-30"
                  >
                    <SkipBack size={16} strokeWidth={1.5} aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={onToggle}
                    aria-label={isPlaybackActive ? "Pause" : "Play"}

                    className="relative flex h-7 w-7 items-center justify-center border border-border text-fg transition-[color,background-color,border-color,scale] duration-[120ms] ease-[var(--ease-press)] before:absolute before:-inset-2 before:content-[''] hover:border-dim focus:outline-none focus-visible:border-accent focus-visible:text-accent active:scale-90 active:bg-white/[0.07] active:before:-inset-3"
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
                    disabled={activeIndex === totalTracks - 1}
                    aria-label="Next track"
                    className="relative text-dim2 transition-[color,scale] duration-[120ms] ease-[var(--ease-press)] before:absolute before:-inset-3.5 before:content-[''] hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-90 active:text-fg active:before:-inset-4.5 disabled:pointer-events-none disabled:opacity-30"
                  >
                    <SkipForward size={16} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>,
    document.body,
  );
}
