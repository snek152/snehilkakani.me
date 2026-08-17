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

export default function MusicPage() {
  const prefersReducedMotion = useMotionPreference();
  const { activeIndex, playbackState, bars, toggleTrack } = useMusicPlayer();
  const headingRef = useRef<HTMLDivElement>(null);
  const headingActive = useInView(headingRef, { once: true, margin: "0px 0px -15% 0px" });

  const [filter, setFilter] = useState<BeatFilter>("all");

  const filtered =
    filter === "all"
      ? beats.map((beat, index) => ({ beat, index }))
      : beats
          .map((beat, index) => ({ beat, index }))
          .filter(({ beat }) => beat.category === filter);
  const activeBeat = activeIndex === null ? null : beats[activeIndex];
  const activeDuration = activeBeat ? (BEAT_DURATIONS[activeBeat.file] ?? 0) : 0;

  const activeDetail = activeBeat ? `${activeBeat.tempo} BPM · ${formatTime(activeDuration)}` : "";
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
          Filter by category
        </h2>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
        {FILTERS.map((category) => {
          const isActive = filter === category;
          const label = category === "all" ? "All beats" : `Filter by ${category}`;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              aria-label={label}
              onClick={() => setFilter(category)}

              className={`relative inline-flex min-h-11 items-center pb-1.5 font-sans text-[length:var(--text-meta)] transition-[color,scale,opacity] duration-[120ms] ease-[var(--ease-press)] active:scale-95 active:opacity-70 ${
                isActive ? "text-fg" : "text-dim hover:text-fg"
              }`}
            >
              <span className="capitalize">{category}</span>
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
        <DrawnRule />
        {filtered.map(({ beat, index }, position) => (
          <TrackRow
            key={beat.name}
            beat={beat}
            isActive={activeIndex === index}
            isPlayingRow={activeIndex === index && playbackState === "playing"}
            isLoadingRow={activeIndex === index && playbackState === "loading"}
            duration={BEAT_DURATIONS[beat.file] ?? 0}
            bars={bars}
            onToggle={() => toggleTrack(index)}
            delay={Math.min(position, 6) * beatTime(0.04)}
          />
        ))}
      </section>
    </div>
  );
}
