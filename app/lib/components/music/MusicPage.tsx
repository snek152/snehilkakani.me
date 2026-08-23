"use client";

import { useRef } from "react";
import { AnimatePresence, useInView } from "motion/react";
import { beats } from "@/app/lib/data/beats";
import { BEAT_DURATIONS } from "@/app/lib/data/beat-durations";
import { beats as beatTime } from "@/app/lib/tempo";
import { useMusicPlayer } from "@/app/lib/components/music/MusicPlayerProvider";
import ManifestoHeading from "@/app/lib/components/home/ManifestoHeading";
import RouteSignal from "@/app/lib/components/shared/RouteSignal";
import FeatureTrackGrid from "./FeatureTrackGrid";
import PlayerBar from "./PlayerBar";
import TrackRow from "./TrackRow";
import { formatTime } from "./format";

const FEATURED_COUNT = 4;

export default function MusicPage() {
  const {
    activeIndex,
    playbackState,
    error,
    currentTime,
    duration,
    bars,
    toggleTrack,
    skip,
    handleScrub,
    closeTrack,
  } = useMusicPlayer();
  const headingRef = useRef<HTMLDivElement>(null);
  const focusOriginRef = useRef<HTMLElement | null>(null);
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
  const featuredBeats = beats.slice(0, FEATURED_COUNT);
  const remainingBeats = beats
    .slice(FEATURED_COUNT)
    .map((beat, index) => ({ beat, position: index + FEATURED_COUNT }));

  const toggleFromOrigin = (index: number) => {
    if (activeIndex !== index) {
      const origin = document.activeElement;
      focusOriginRef.current =
        origin instanceof HTMLElement && origin !== document.body
          ? origin
          : null;
    }
    toggleTrack(index);
  };

  const handleClose = () => {
    const origin = focusOriginRef.current;
    closeTrack();
    requestAnimationFrame(() => {
      const target = origin?.isConnected ? origin : headingRef.current;
      target?.focus({ preventScroll: true });
      focusOriginRef.current = null;
    });
  };
  return (
    <div className="px-6 pb-12 pt-8 sm:px-8 lg:px-12 lg:pt-8">
      <header className="relative min-h-10">
        <div
          ref={headingRef}
          tabIndex={-1}
          className="focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <ManifestoHeading
            as="h1"
            id="music-heading"
            text="Music"
            active={headingActive}
            className="font-display text-[length:var(--size-display-lg)] font-bold tracking-[var(--track-display-lg)] text-fg text-balance"
          />
        </div>
        <div className="mt-4 flex items-center gap-3 sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2">
          <AnimatePresence>
            {activeBeat && (
              <PlayerBar
                key="player"
                active={activeBeat}
                error={error}
                playbackState={playbackState}
                currentTime={currentTime}
                duration={duration}
                displayDuration={activeDuration}
                activeIndex={activeIndex}
                totalTracks={beats.length}
                onToggle={() =>
                  activeIndex !== null && toggleTrack(activeIndex)
                }
                onSkip={skip}
                onScrub={handleScrub}
                onClose={handleClose}
              />
            )}
          </AnimatePresence>
          <RouteSignal
            scene="music"
            label={activeBeat ? activeBeat.name : "Catalog signal"}
            detail={activeDetail}
          />
        </div>
      </header>
      <section aria-labelledby="music-feature-heading" className="mt-6">
        <h2
          id="music-feature-heading"
          className="sr-only"
        >
          Featured
        </h2>
        <FeatureTrackGrid
          beats={featuredBeats}
          activeIndex={activeIndex}
          playbackState={playbackState}
          bars={bars}
          durations={BEAT_DURATIONS}
          onToggle={toggleFromOrigin}
        />
      </section>
      <section aria-labelledby="music-tracklist-heading" className="mt-6">
        <h2
          id="music-tracklist-heading"
          className="sr-only"
        >
          Catalog
        </h2>
        {remainingBeats.map(({ beat, position }) => (
          <TrackRow
            key={beat.name}
            beat={beat}
            isActive={activeIndex === position}
            isPlayingRow={activeIndex === position && playbackState === "playing"}
            isLoadingRow={activeIndex === position && playbackState === "loading"}
            duration={BEAT_DURATIONS[beat.file] ?? 0}
            bars={bars}
            onToggle={() => toggleFromOrigin(position)}
            showRule={position < beats.length - 1}
            delay={Math.min(position - FEATURED_COUNT, 6) * beatTime(0.04)}
          />
        ))}
      </section>
    </div>
  );
}
