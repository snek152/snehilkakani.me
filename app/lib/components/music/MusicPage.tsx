"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { beats, categories, type Beat } from "@/app/lib/data/beats";
import { EASE_OUT } from "@/app/lib/motion";
import { beats as beatTime } from "@/app/lib/tempo";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import ManifestoHeading from "@/app/lib/components/home/ManifestoHeading";
import DrawnRule from "@/app/lib/components/shared/DrawnRule";
import TrackRow from "./TrackRow";
import PlayerBar from "./PlayerBar";
import { useAudioAnalyser } from "./useAudioAnalyser";

type BeatFilter = "all" | Beat["category"];

const FILTERS: BeatFilter[] = ["all", ...categories];

export default function MusicPage() {
  const prefersReducedMotion = useMotionPreference();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeIndexRef = useRef<number | null>(null);
  const playbackRequestRef = useRef(0);
  const headingRef = useRef<HTMLDivElement>(null);
  const headingActive = useInView(headingRef, { once: true });

  const [filter, setFilter] = useState<BeatFilter>("all");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [playbackState, setPlaybackState] = useState<
    "loading" | "playing" | "paused" | "error"
  >("paused");
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { bars, ensureAnalyser } = useAudioAnalyser(audioRef, playbackState === "playing", prefersReducedMotion);

  const attemptPlay = useCallback((audio: HTMLAudioElement, index: number) => {
    const request = ++playbackRequestRef.current;
    setError(null);
    setPlaybackState("loading");
    // Synchronous, still inside the click's call stack — creating (or
    // resuming) the AudioContext here, not in an effect reacting to
    // state, keeps it inside the actual user gesture.
    ensureAnalyser();

    void audio.play().catch(() => {
      if (
        request !== playbackRequestRef.current ||
        activeIndexRef.current !== index
      ) {
        return;
      }

      setError("Couldn't play this track.");
      setPlaybackState("error");
    });
  }, [ensureAnalyser]);

  const playTrack = useCallback(
    (index: number) => {
      const audio = audioRef.current;
      const beat = beats[index];
      if (!audio || !beat) return;

      activeIndexRef.current = index;
      setActiveIndex(index);
      setError(null);
      setPlaybackState("loading");
      setCurrentTime(0);
      setDuration(0);
      audio.src = beat.file;
      audio.load();
      attemptPlay(audio, index);
    },
    [attemptPlay],
  );

  // A single audio element owns playback for the page. The event handlers are
  // registered once and read the live active track from a ref to avoid stale
  // closures when changing tracks.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateDuration = () => {
      setDuration(
        Number.isFinite(audio.duration) && audio.duration > 0
          ? audio.duration
          : 0,
      );
    };
    const onPlay = () => {
      setError(null);
      setPlaybackState("loading");
    };
    const onPlaying = () => {
      setError(null);
      setPlaybackState("playing");
    };
    const onPause = () => {
      if (audio.paused && !audio.ended) setPlaybackState("paused");
    };
    const onWaiting = () => {
      if (!audio.paused) setPlaybackState("loading");
    };
    const onTimeUpdate = () => {
      setCurrentTime(Number.isFinite(audio.currentTime) ? audio.currentTime : 0);
    };
    const onError = () => {
      if (activeIndexRef.current === null) return;
      setError("Couldn't play this track.");
      setPlaybackState("error");
    };
    const onEnded = () => {
      const index = activeIndexRef.current;
      if (index === null) return;

      const next = index + 1;
      if (next < beats.length) {
        playTrack(next);
        return;
      }

      ++playbackRequestRef.current;
      activeIndexRef.current = null;
      setActiveIndex(null);
      setPlaybackState("paused");
      setCurrentTime(0);
      setDuration(0);
      audio.removeAttribute("src");
      audio.load();
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("error", onError);
    audio.addEventListener("ended", onEnded);

    return () => {
      ++playbackRequestRef.current;
      activeIndexRef.current = null;
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    };
  }, [playTrack]);

  const toggleTrack = useCallback(
    (index: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (activeIndexRef.current !== index) {
        playTrack(index);
        return;
      }

      if (audio.paused || playbackState === "error") {
        if (playbackState === "error") {
          playTrack(index);
        } else {
          attemptPlay(audio, index);
        }
      } else {
        ++playbackRequestRef.current;
        audio.pause();
      }
    },
    [attemptPlay, playbackState, playTrack],
  );

  const skip = useCallback(
    (direction: 1 | -1) => {
      const index = activeIndexRef.current;
      if (index === null) return;

      const next = index + direction;
      if (next >= 0 && next < beats.length) playTrack(next);
    },
    [playTrack],
  );

  const handleScrub = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current;
      const nextTime = Number(event.target.value);
      if (
        !audio ||
        !Number.isFinite(nextTime) ||
        !Number.isFinite(audio.duration) ||
        audio.duration <= 0
      ) {
        return;
      }

      const clampedTime = Math.min(Math.max(nextTime, 0), audio.duration);
      audio.currentTime = clampedTime;
      setCurrentTime(clampedTime);
    },
    [],
  );

  const active = activeIndex !== null ? beats[activeIndex] : null;
  const filtered =
    filter === "all"
      ? beats.map((beat, index) => ({ beat, index }))
      : beats
          .map((beat, index) => ({ beat, index }))
          .filter(({ beat }) => beat.category === filter);

  return (
    <div className="px-6 pb-28 pt-16 sm:px-8 lg:px-12 lg:pt-[4.5rem]">
      <audio ref={audioRef} preload="none" />

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
              className={`relative pb-1.5 font-sans text-sm capitalize transition-colors duration-150 ${
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
            isPlayingRow={activeIndex === index && playbackState === "playing"}
            duration={duration}
            bars={bars}
            onToggle={() => toggleTrack(index)}
            delay={Math.min(position, 10) * beatTime(0.05)}
          />
        ))}
      </div>

      <PlayerBar
        active={active}
        error={error}
        playbackState={playbackState}
        currentTime={currentTime}
        duration={duration}
        activeIndex={activeIndex}
        totalTracks={beats.length}
        onToggle={() => activeIndex !== null && toggleTrack(activeIndex)}
        onSkip={skip}
        onScrub={handleScrub}
      />
    </div>
  );
}
