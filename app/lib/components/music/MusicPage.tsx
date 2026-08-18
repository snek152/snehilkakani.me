"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { beats } from "@/app/lib/data/beats";
import { BEAT_DURATIONS } from "@/app/lib/data/beat-durations";
import { beats as beatTime } from "@/app/lib/tempo";
import { useMusicPlayer } from "@/app/lib/components/music/MusicPlayerProvider";
import ManifestoHeading from "@/app/lib/components/home/ManifestoHeading";
import RouteSignal from "@/app/lib/components/shared/RouteSignal";
import TrackRow from "./TrackRow";
import { formatTime } from "./format";

export default function MusicPage() {
  const { activeIndex, playbackState, bars, toggleTrack } = useMusicPlayer();
  const headingRef = useRef<HTMLDivElement>(null);
  const headingActive = useInView(headingRef, {
    once: true,
    margin: "0px 0px -15% 0px",
  });

  const activeBeat = activeIndex === null ? null : beats[activeIndex];
  const activeDuration = activeBeat
    ? (BEAT_DURATIONS[activeBeat.file] ?? 0)
    : 0;

  const activeDetail = activeBeat
    ? `${activeBeat.tempo} BPM · ${formatTime(activeDuration)}`
    : "";
  return (
    <div className="px-6 pb-12 pt-8 sm:px-8 lg:px-12 lg:pt-8">
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
      <section aria-labelledby="music-tracklist-heading" className="mt-4">
        <h2 id="music-tracklist-heading" className="sr-only">
          Track list
        </h2>
        {beats.map((beat, position) => (
          <TrackRow
            key={beat.name}
            beat={beat}
            isActive={activeIndex === position}
            isPlayingRow={activeIndex === position && playbackState === "playing"}
            isLoadingRow={activeIndex === position && playbackState === "loading"}
            duration={BEAT_DURATIONS[beat.file] ?? 0}
            bars={bars}
            onToggle={() => toggleTrack(position)}
            showRule={position < beats.length - 1}
            delay={Math.min(position, 6) * beatTime(0.04)}
          />
        ))}
      </section>
    </div>
  );
}
