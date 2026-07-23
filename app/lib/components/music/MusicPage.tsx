"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { beats, categories, type Beat } from "@/app/lib/data/beats";
import { EASE_OUT, fadeUp } from "@/app/lib/motion";
import BeatBars from "./BeatBars";
import HeaderWaveform from "./HeaderWaveform";

type BeatFilter = "all" | Beat["category"];

const FILTERS: BeatFilter[] = ["all", ...categories];

/** Fixed palette for category markers — data, not chrome; the one accent stays reserved for state. */
const CATEGORY_COLOR: Record<Beat["category"], string> = {
  mellow: "#60a5fa",
  trap: "#f87171",
  acoustic: "#4ade80",
  spacey: "#a78bfa",
  synth: "#fbbf24",
};

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function MusicPage() {
  const prefersReducedMotion = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeIndexRef = useRef<number | null>(null);
  const playbackRequestRef = useRef(0);

  const [filter, setFilter] = useState<BeatFilter>("all");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [playbackState, setPlaybackState] = useState<
    "loading" | "playing" | "paused" | "error"
  >("paused");
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const attemptPlay = useCallback((audio: HTMLAudioElement, index: number) => {
    const request = ++playbackRequestRef.current;
    setError(null);
    setPlaybackState("loading");

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
  }, []);

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
  const isPlayingActive = active !== null && playbackState === "playing";
  const isPlaybackActive =
    playbackState === "playing" || playbackState === "loading";
  const filtered =
    filter === "all"
      ? beats.map((beat, index) => ({ beat, index }))
      : beats
          .map((beat, index) => ({ beat, index }))
          .filter(({ beat }) => beat.category === filter);

  return (
    <div className="px-6 pb-44 pt-24 sm:px-10 lg:px-14">
      <audio ref={audioRef} preload="none" />

      <div className="flex items-end justify-between gap-6">
        <motion.h1
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
          className="font-display text-5xl font-extrabold tracking-tight text-fg sm:text-6xl"
        >
          Music
        </motion.h1>
        <HeaderWaveform tempo={active?.tempo} playing={isPlayingActive} />
      </div>

      <div
        role="group"
        aria-label="Filter beats by category"
        className="mt-9 flex flex-wrap gap-1"
      >
        {FILTERS.map((category) => {
          const isActive = filter === category;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => setFilter(category)}
              className={`rounded px-3 py-1.5 font-sans text-sm capitalize transition-colors duration-150 ${
                isActive
                  ? "bg-white/[0.06] text-fg"
                  : "text-dim hover:text-fg"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="mt-7 border-t border-border">
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map(({ beat, index }) => {
            const isActive = activeIndex === index;
            const isPlaybackRow = isActive && isPlaybackActive;
            const isPlayingRow = isActive && isPlayingActive;
            return (
              <motion.button
                key={beat.name}
                type="button"
                layout={!prefersReducedMotion}
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.15, ease: EASE_OUT }}
                onClick={() => toggleTrack(index)}
                aria-pressed={isActive}
                aria-label={`${isPlaybackRow ? "Pause" : "Play"} ${beat.name}, ${beat.category}, ${beat.tempo} BPM`}
                className={`flex w-full items-center gap-4 border-b border-border px-2 py-3 text-left transition-colors duration-150 ${
                  isActive ? "bg-accent/[0.08]" : "hover:bg-white/[0.02]"
                }`}
                style={{
                  borderLeft: isActive
                    ? "2px solid var(--accent)"
                    : "2px solid transparent",
                }}
              >
                <span className="flex w-5 shrink-0 items-center justify-center">
                  {isPlayingRow ? (
                    <BeatBars tempo={beat.tempo} />
                  ) : (
                    <Play
                      size={12}
                      strokeWidth={1.75}
                      className={isActive ? "text-accent" : "text-dim2"}
                    />
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className={`block truncate font-sans transition-[font-size,color] duration-150 ${
                      isActive
                        ? "text-[1.02rem] font-semibold text-fg"
                        : "text-[0.9rem] font-medium text-dim"
                    }`}
                  >
                    {beat.name}
                  </span>
                  {beat.description && (
                    <span className="block truncate font-sans text-sm text-dim">
                      {beat.description}
                    </span>
                  )}
                </span>

                <span className="hidden shrink-0 items-center gap-3 sm:flex">
                  <span
                    className="flex items-center gap-1.5 font-sans text-sm capitalize"
                    style={{ color: CATEGORY_COLOR[beat.category] }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: CATEGORY_COLOR[beat.category] }}
                      aria-hidden="true"
                    />
                    {beat.category}
                  </span>
                  <span className="text-sm tabular-nums text-dim2">
                    {beat.tempo}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={prefersReducedMotion ? false : { y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { y: 80, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.24, ease: EASE_OUT }}
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-bg/95 px-5 py-3.5 backdrop-blur-xl sm:px-8 lg:left-[52px]"
          >
            <div className="flex items-center gap-5 sm:gap-8">
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-1.5">
                  <span className="h-2.5 w-[2px] bg-accent" aria-hidden="true" />
                  <span className="font-sans text-sm font-semibold uppercase tracking-widest text-accent">
                    Now Playing
                  </span>
                </div>
                <div className="truncate font-sans text-sm font-medium text-fg">
                  {active.name}
                </div>
                <div
                  className="truncate font-sans text-sm capitalize"
                  style={{
                    color: error ? undefined : CATEGORY_COLOR[active.category],
                  }}
                  role={error ? "alert" : "status"}
                  aria-live="polite"
                >
                  {error ? (
                    <span className="text-dim">{error}</span>
                  ) : (
                    `${active.category} · ${active.tempo} BPM`
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => skip(-1)}
                  disabled={activeIndex === 0}
                  aria-label="Previous track"
                  className="text-dim transition-colors duration-150 hover:text-fg disabled:pointer-events-none disabled:opacity-30"
                >
                  <SkipBack size={14} strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={() => activeIndex !== null && toggleTrack(activeIndex)}
                  aria-label={isPlaybackActive ? "Pause" : "Play"}
                  className="flex h-[30px] w-[30px] items-center justify-center rounded bg-accent text-white"
                >
                  {isPlaybackActive ? (
                    <Pause size={12} strokeWidth={1.75} />
                  ) : (
                    <Play size={12} strokeWidth={1.75} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => skip(1)}
                  disabled={activeIndex === beats.length - 1}
                  aria-label="Next track"
                  className="text-dim transition-colors duration-150 hover:text-fg disabled:pointer-events-none disabled:opacity-30"
                >
                  <SkipForward size={14} strokeWidth={1.75} />
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="w-11 shrink-0 text-right text-sm tabular-nums text-dim2">
                {duration > 0 ? formatTime(currentTime) : "--:--"}
              </span>
              <input
                type="range"
                aria-label={`Seek through ${active.name}`}
                aria-valuetext={
                  duration > 0
                    ? `${formatTime(currentTime)} of ${formatTime(duration)}`
                    : "Duration unavailable"
                }
                min={0}
                max={duration || 0}
                step={0.01}
                value={Math.min(currentTime, duration || 0)}
                onChange={handleScrub}
                disabled={!duration}
                className="h-1 w-full flex-1 cursor-pointer appearance-none rounded-full bg-border accent-accent disabled:cursor-default disabled:opacity-40"
              />
              <span className="w-11 shrink-0 text-sm tabular-nums text-dim2">
                {duration > 0 ? formatTime(duration) : "--:--"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
