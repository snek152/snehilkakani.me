"use client";

import { motion } from "motion/react";
import { createPortal } from "react-dom";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import type { Beat } from "@/app/lib/data/beats";
import { EASE_OUT } from "@/app/lib/motion";
import { beats as beatTime } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { TRANSPORT_CLEARANCE } from "@/app/lib/components/AppShell";
import { formatTime } from "./format";

type PlaybackState = "loading" | "playing" | "paused" | "error";

/**
 * The fixed transport — the track list's own grid, continued.
 *
 * It is deliberately not a media-player slab docked to the window. It
 * reuses the page container's padding and the row's four-column grid, so
 * the playing track sits column-for-column under the list: title where
 * titles are, the line about the track where the list puts it, tempo
 * where tempo is, and the clock in the column the durations live in.
 * Nothing about it is centred on the window; everything is aligned to
 * the list.
 *
 * The bar's top hairline *is* the progress rule — the same 1px
 * `border` line that separates every row, inset to the same width,
 * filling with accent as the track plays. There is no second scrubber
 * floating above it. The native `<input type="range">` is still there as
 * a transparent 12px band straddling that rule, so dragging, keyboard
 * seeking and screen-reader semantics are untouched; focusing it
 * thickens the rule to 3px, which is the only visible chrome the
 * scrubber ever gets.
 *
 * The one allowed flourish: while a track plays, the fill breathes at
 * *that track's* tempo (`beat.tempo`), not the page's BPM-92 grid — this
 * stays entirely inside the player and never touches entrance timing.
 *
 * Height is pinned to `TRANSPORT_CLEARANCE`, the exact amount `AppShell`
 * has `Footer` reserve inside its own surface, so the page's maximum
 * scroll ends on the footer's background rather than in empty space
 * below it.
 *
 * It renders through a portal into `document.body`, and has to. The route
 * wrapper in `app/template.tsx` animates `clip-path` and settles on
 * `inset(0 0% 0 0%)` — a clip-path clips every descendant including
 * `position: fixed` ones, and that wrapper's box stops where the page
 * content stops. Rendered in place, the transport was clipped out of
 * existence the moment you scrolled far enough for the footer to own the
 * bottom of the window: not painted, not hit-testable, simply gone. The
 * portal puts it outside that clip. `z-30` reproduces the layering it had
 * inside the page column — above the fixed backdrops at `z-0`, below the
 * scroll rail and the sidebar.
 */
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
}: {
  active: Beat | null;
  error: string | null;
  playbackState: PlaybackState;
  currentTime: number;
  duration: number;
  /** Baked fallback length (from BEAT_DURATIONS) shown in the time labels
   * before the audio element's real `duration` is known — the seek range
   * below still uses the real `duration` for its bounds, since that's the
   * only value the browser can actually scrub against. */
  displayDuration: number;
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
  const knownDuration = displayDuration > 0;

  if (!active) return null;

  const secondary = error ?? active.description ?? "";
  // `formatTime` returns the unknown-length placeholder for 0, which is
  // right for a duration and wrong for a playhead: a track sitting at the
  // start is at 0:00, not at an unknown time.
  const elapsed = currentTime > 0 ? formatTime(currentTime) : "0:00";
  const clock = knownDuration ? `${elapsed} / ${formatTime(displayDuration)}` : "--:-- / --:--";

  // `active` only becomes non-null through a click, so this never runs
  // during SSR or the hydrating render — `document` is always there.
  return createPortal(
    <motion.div
      initial={reduceMotion ? false : { y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : beatTime(0.4), ease: EASE_OUT }}
      style={{ height: TRANSPORT_CLEARANCE }}
      className="fixed bottom-0 left-0 right-0 z-30 bg-bg/95 backdrop-blur-xl lg:left-[52px]"
    >
      {/* Same horizontal padding as the music page's own container, so the
        * rule and the grid below inherit the list's geometry exactly rather
        * than approximating it. */}
      <div className="h-full px-6 sm:px-8 lg:px-12">
        <div className="relative h-full">
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
            className="peer absolute inset-x-0 top-0 h-3 w-full cursor-pointer appearance-none bg-transparent opacity-0 disabled:cursor-default"
          />

          {/* The bar's top edge, the list's row separator and the scrubber
            * track are all this one line. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden bg-border transition-[height,background-color] duration-150 peer-focus-visible:h-[3px] peer-focus-visible:bg-dim2"
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
          </span>

          {/* Single announcement channel. The visible copies below are
            * marked aria-hidden so an error is never read twice. */}
          <p className="sr-only" role={error ? "alert" : "status"} aria-live="polite">
            {error ?? ""}
          </p>

          <div className="flex h-full items-center gap-4 px-2 lg:grid lg:grid-cols-4 lg:gap-x-4">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              {/* Holds the width of the row's play-state glyph so the title
                * starts on the same x as every title in the list. */}
              <span className="hidden w-5 shrink-0 lg:block" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-sans text-[0.95rem] font-semibold text-fg">
                  {active.name}
                </span>
                {/* Below `lg` the description is skipped — the row it came
                  * from is a few pixels above and says it in full, and
                  * stealing a second line here only bought a version of it
                  * truncated to nothing. An error has no other home, so it
                  * still gets the line. */}
                {error && (
                  <span aria-hidden="true" className="block truncate font-sans text-sm text-dim lg:hidden">
                    {error}
                  </span>
                )}
              </span>
            </div>

            <div
              aria-hidden="true"
              className={`hidden truncate font-sans text-sm lg:col-span-2 lg:block ${
                error ? "text-dim" : "text-dim2"
              }`}
            >
              {secondary}
            </div>

            <div className="flex shrink-0 items-center font-sans text-dim2">
              <span className="hidden text-sm tabular-nums xl:inline">
                {active.tempo} BPM
              </span>
              {/* Stacked below `lg`: side by side the clock and the three
                * controls took 166 of the 326px available and left the
                * title 151px, narrow enough to cut real track names. */}
              <span className="ml-auto flex flex-col items-end gap-1.5 lg:flex-row lg:items-center lg:gap-6">
                <span className="text-xs tabular-nums lg:text-sm">{clock}</span>
                <span className="flex items-center gap-3 lg:gap-4">
                  <button
                    type="button"
                    onClick={() => onSkip(-1)}
                    disabled={activeIndex === 0}
                    aria-label="Previous track"
                    className="text-dim2 transition-colors duration-150 hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-30"
                  >
                    <SkipBack size={16} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                  {/* A hairline rectangle, the same idiom as the contact
                    * form's and the study page's buttons — not a filled
                    * pill, and deliberately not accent-coloured either.
                    * The accent in this bar means one thing (elapsed
                    * progress, and the active row's rule); spending it on
                    * a button that is already unambiguous from its glyph
                    * would cost the rule its meaning. */}
                  <button
                    type="button"
                    onClick={onToggle}
                    aria-label={isPlaybackActive ? "Pause" : "Play"}
                    className="flex h-7 w-7 items-center justify-center border border-border text-fg transition-colors duration-150 hover:border-dim focus:outline-none focus-visible:border-accent focus-visible:text-accent"
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
                    className="text-dim2 transition-colors duration-150 hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-30"
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
