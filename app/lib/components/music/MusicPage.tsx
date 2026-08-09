"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { beats, categories, type Beat } from "@/app/lib/data/beats";
import { BEAT_DURATIONS } from "@/app/lib/data/beat-durations";
import { EASE_OUT } from "@/app/lib/motion";
import { beats as beatTime } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { useMusicPlayer } from "@/app/lib/components/music/MusicPlayerProvider";
import ManifestoHeading from "@/app/lib/components/home/ManifestoHeading";
import DrawnRule from "@/app/lib/components/shared/DrawnRule";
import TrackRow from "./TrackRow";

type BeatFilter = "all" | Beat["category"];

const FILTERS: BeatFilter[] = ["all", ...categories];

/**
 * The track list. Playback itself — the `<audio>` element, transport
 * state and the fixed `PlayerBar` — lives in `MusicPlayerProvider`,
 * mounted once in `AppShell` above every route, so it survives
 * navigating away from /music. This component only drives that shared
 * player through `useMusicPlayer()`.
 */
export default function MusicPage() {
  const prefersReducedMotion = useMotionPreference();
  const { activeIndex, playbackState, bars, toggleTrack } = useMusicPlayer();
  const headingRef = useRef<HTMLDivElement>(null);
  const headingActive = useInView(headingRef, { once: true });

  const [filter, setFilter] = useState<BeatFilter>("all");

  const filtered =
    filter === "all"
      ? beats.map((beat, index) => ({ beat, index }))
      : beats
          .map((beat, index) => ({ beat, index }))
          .filter(({ beat }) => beat.category === filter);

  return (
    <div className="px-6 pb-16 pt-16 sm:px-8 lg:px-12 lg:pt-[4.5rem]">
      <div ref={headingRef}>
        <ManifestoHeading
          id="music-heading"
          text="Music"
          active={headingActive}
          className="font-display text-5xl font-extrabold tracking-tight text-fg sm:text-6xl"
        />
      </div>

      <div
        role="group"
        aria-label="Filter beats by category"
        className="mt-9 flex flex-wrap gap-x-5 gap-y-2"
      >
        {FILTERS.map((category) => {
          const isActive = filter === category;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => setFilter(category)}
              // Scale *and* opacity. The filters are short words — "all"
              // is 20px wide, where a scale press on its own amounts to
              // about a pixel — and the one press signal that would be
              // unmistakable on touch, brightening the text, is already
              // spoken for: `text-fg` here means "this filter is on", so
              // flashing it would announce a selection that hasn't
              // happened yet. Dimming can't be misread that way.
              className={`relative pb-1.5 font-sans text-sm capitalize transition-[color,scale,opacity] duration-[120ms] ease-[var(--ease-press)] active:scale-95 active:opacity-70 ${
                isActive ? "text-fg" : "text-dim hover:text-fg"
              }`}
            >
              {category}
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-px h-px origin-left bg-accent"
                initial={false}
                animate={{ scaleX: isActive ? 1 : 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : beatTime(0.35),
                  ease: EASE_OUT,
                }}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-7">
        <DrawnRule />
        {filtered.map(({ beat, index }, position) => (
          <TrackRow
            key={beat.name}
            beat={beat}
            isActive={activeIndex === index}
            // A loading track's next action is also pause: `toggleTrack`
            // cancels its pending request exactly as it pauses an already
            // playing track. Keep the row's glyph and accessible name
            // honest about that action, rather than reporting "Play" until
            // audio frames arrive.
            isPlayingRow={
              activeIndex === index &&
              (playbackState === "playing" || playbackState === "loading")
            }
            duration={BEAT_DURATIONS[beat.file] ?? 0}
            bars={bars}
            onToggle={() => toggleTrack(index)}
            // A list of twenty-two rows should read as arriving, not
            // loading. The old grid — 0.6-beat rows stepped 0.05 of a
            // beat apart, capped at ten — put 0.33s between the first
            // and last row landing, long enough to watch rows queue up.
            // A smaller step and a cap of six keep the sweep legible
            // while halving the span to 0.16s.
            delay={Math.min(position, 6) * beatTime(0.04)}
          />
        ))}
      </div>
    </div>
  );
}
