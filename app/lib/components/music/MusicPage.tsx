"use client";

import { useMemo, useRef, useState } from "react";
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

  // Per-filter counts, derived once from `beats` rather than recomputed
  // inside the render loop below. "all" is the full catalog; every other
  // key is how many releases carry that category.
  const filterCounts = useMemo(() => {
    const counts = {} as Record<BeatFilter, number>;
    counts.all = beats.length;
    for (const category of categories) {
      counts[category] = beats.filter((beat) => beat.category === category).length;
    }
    return counts;
  }, []);
  return (
    <div className="px-6 pb-12 pt-16 sm:px-8 lg:px-12 lg:pt-[4.5rem]">
      <header className="relative min-h-10">
        <div ref={headingRef}>
          <ManifestoHeading
            as="h1"
            id="music-heading"
            text="Music"
            active={headingActive}
            className="font-display text-[length:var(--size-display-lg)] font-bold tracking-[var(--track-display-lg)] text-fg text-balance"
          />
        </div>
        <RouteSignal
          scene="music"
          label={activeBeat ? activeBeat.name : "Catalog signal"}
          detail={activeDetail}
          className="mt-4 sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2"
        />
      </header>

      <section aria-labelledby="music-filter-heading" className="mt-7">
        <h2 id="music-filter-heading" className="sr-only">
          Filter releases by category
        </h2>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
        {FILTERS.map((category) => {
          const isActive = filter === category;
          const count = filterCounts[category];
          const label =
            category === "all"
              ? `All releases, ${count}`
              : `${category.charAt(0).toUpperCase()}${category.slice(1)}, ${count} release${count === 1 ? "" : "s"}`;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              aria-label={label}
              onClick={() => setFilter(category)}
              // Scale *and* opacity. The filters are short words — "all"
              // is 20px wide, where a scale press on its own amounts to
              // about a pixel — and the one press signal that would be
              // unmistakable on touch, brightening the text, is already
              // spoken for: `text-fg` here means "this filter is on", so
              // flashing it would announce a selection that hasn't
              // happened yet. Dimming can't be misread that way.
              className={`relative inline-flex min-h-11 items-center gap-1.5 pb-1.5 font-sans text-[length:var(--text-meta)] transition-[color,scale,opacity] duration-[120ms] ease-[var(--ease-press)] active:scale-95 active:opacity-70 ${
                isActive ? "text-fg" : "text-dim hover:text-fg"
              }`}
            >
              <span className="capitalize">{category}</span>
              <span
                aria-hidden="true"
                className="text-[length:var(--text-micro)] tabular-nums text-dim2"
              >
                {count}
              </span>
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
      </section>

      <section aria-labelledby="music-tracklist-heading" className="mt-8">
        <h2 id="music-tracklist-heading" className="sr-only">
          Track list
        </h2>
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
      </section>
    </div>
  );
}
