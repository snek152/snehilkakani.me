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
import RouteSignal from "@/app/lib/components/shared/RouteSignal";
import TrackRow from "./TrackRow";
import { formatTime } from "./format";

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
  const activeBeat = activeIndex === null ? null : beats[activeIndex];
  const activeDuration = activeBeat ? (BEAT_DURATIONS[activeBeat.file] ?? 0) : 0;

  const activeDetail = activeBeat
    ? `${activeBeat.category} · ${activeBeat.tempo} BPM · ${formatTime(activeDuration)}`
    : `${filtered.length} releases · select a track to route it`;
  return (
    <div className="px-6 pb-16 pt-16 sm:px-8 lg:px-12 lg:pt-[4.5rem]">
      <div className="grid gap-8 border-b border-border pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.38fr)] lg:items-end lg:gap-12">
        <div ref={headingRef}>
          <ManifestoHeading
            as="h1"
            id="music-heading"
            text="Music"
            active={headingActive}
            className="font-display text-[length:var(--size-display-lg)] font-bold tracking-[var(--track-display-lg)] text-fg text-balance"
          />
          <p className="mt-4 max-w-xl font-sans text-[length:var(--text-meta)] leading-relaxed text-dim">
            A release catalog organized as a playable sequence.
          </p>
        </div>

        <div className="relative border-l border-border pl-5">
          <span className="font-sans text-[length:var(--text-micro)] uppercase tracking-[var(--track-text-lg)] text-dim2">
            Local output
          </span>
          <RouteSignal
            scene="music"
            label={activeBeat ? activeBeat.name : "Catalog signal"}
            detail={activeDetail}
            className="mt-3"
          />
          <span className="mt-2 block font-sans text-[length:var(--text-micro)] tracking-[var(--track-text-sm)] text-dim">
            {activeBeat ? `${activeBeat.name} · ${activeDetail}` : activeDetail}
          </span>
          {activeBeat && (
            <span className="mt-2 block font-sans text-[length:var(--text-micro)] uppercase tracking-[var(--track-text-lg)] text-[color:var(--accent-text)]">
              {playbackState === "playing" ? "Live routing" : "Cue held"}
            </span>
          )}
        </div>
      </div>

      <div
        role="group"
        aria-label="Filter beats by category"
        className="mt-7 flex flex-wrap gap-x-5 gap-y-2"
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
              className={`relative inline-flex min-h-11 items-center pb-1.5 font-sans text-[length:var(--text-meta)] capitalize transition-[color,scale,opacity] duration-[120ms] ease-[var(--ease-press)] active:scale-95 active:opacity-70 ${
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

      <div className="mt-8">
        <div className="mb-3 hidden grid-cols-[minmax(11rem,1fr)_minmax(0,2fr)_auto_auto] gap-x-4 px-2 font-sans text-[length:var(--text-micro)] uppercase tracking-[var(--track-text-lg)] text-dim2 lg:grid">
          <span>Release</span>
          <span>Material</span>
          <span>Mode</span>
          <span className="text-right">Tempo / length</span>
        </div>
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
