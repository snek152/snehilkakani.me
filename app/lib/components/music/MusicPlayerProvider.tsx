"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { MotionValue } from "motion/react";
import { beats } from "@/app/lib/data/beats";
import { BEAT_DURATIONS } from "@/app/lib/data/beat-durations";
import { useMotionPreference } from "@/app/lib/components/shared/MotionPreference";
import { useAudioAnalyser } from "./useAudioAnalyser";
import PlayerBar from "./PlayerBar";

type PlaybackState = "loading" | "playing" | "paused" | "error";

interface MusicPlayerContextValue {
  activeIndex: number | null;
  playbackState: PlaybackState;
  error: string | null;
  currentTime: number;
  duration: number;
  bars: MotionValue<number>[];
  playTrack: (index: number) => void;
  toggleTrack: (index: number) => void;
  skip: (direction: 1 | -1) => void;
  handleScrub: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

/**
 * Read the shared transport's state and controls. Must be used under
 * `MusicPlayerProvider` (mounted once in `AppShell`, above every route),
 * so the route that drives it — currently only `/music` — never owns an
 * `<audio>` element of its own.
 */
export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) {
    throw new Error("useMusicPlayer must be used within MusicPlayerProvider");
  }
  return ctx;
}

/**
 * Owns the single `<audio>` element, all playback state, and the fixed
 * `PlayerBar` for the whole app.
 *
 * Mounted once in `AppShell`, above the route tree that `app/template.tsx`
 * animates — so navigating between routes never unmounts this component,
 * the `<audio>` element inside it, or the transport bar it renders. Beats
 * keep playing, `currentTime` keeps advancing, and the bar stays visible
 * across every route change. `MusicPage` (the only current driver) reaches
 * all of this through `useMusicPlayer()` instead of owning a second,
 * route-scoped player that would be destroyed on navigation.
 */
export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useMotionPreference();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeIndexRef = useRef<number | null>(null);
  const playbackRequestRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("paused");
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { bars, ensureAnalyser } = useAudioAnalyser(
    audioRef,
    playbackState === "playing",
    prefersReducedMotion,
  );

  const attemptPlay = useCallback(
    (audio: HTMLAudioElement, index: number) => {
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
    },
    [ensureAnalyser],
  );

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

  // A single audio element owns playback for the whole app, not just the
  // /music route. The event handlers are registered once, here, and read
  // the live active track from a ref to avoid stale closures when
  // changing tracks.
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

    // This provider is mounted once, above the route tree, so this
    // cleanup only runs on real app teardown — not on navigation between
    // routes the way the old route-owned player's did.
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("ended", onEnded);
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

      if (playbackState === "error") {
        playTrack(index);
        return;
      }

      // Branch on `playbackState`, not `audio.paused`. While a track is
      // still `loading`, `play()` has already been called, and
      // `audio.paused` can still read true until the browser actually
      // starts producing frames — that read `loading` as "not playing",
      // so the button shown as "Pause" fell into the `attemptPlay` branch
      // below and restarted the same load instead of cancelling it.
      if (playbackState === "playing" || playbackState === "loading") {
        ++playbackRequestRef.current;
        audio.pause();
        setPlaybackState("paused");
      } else {
        attemptPlay(audio, index);
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

  const handleScrub = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
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
  }, []);

  const active = activeIndex !== null ? beats[activeIndex] : null;

  const value = useMemo<MusicPlayerContextValue>(
    () => ({
      activeIndex,
      playbackState,
      error,
      currentTime,
      duration,
      bars,
      playTrack,
      toggleTrack,
      skip,
      handleScrub,
    }),
    [
      activeIndex,
      playbackState,
      error,
      currentTime,
      duration,
      bars,
      playTrack,
      toggleTrack,
      skip,
      handleScrub,
    ],
  );

  return (
    <MusicPlayerContext.Provider value={value}>
      <audio ref={audioRef} preload="none" />
      {children}
      <PlayerBar
        active={active}
        error={error}
        playbackState={playbackState}
        currentTime={currentTime}
        duration={duration}
        displayDuration={active ? BEAT_DURATIONS[active.file] ?? 0 : 0}
        activeIndex={activeIndex}
        totalTracks={beats.length}
        onToggle={() => activeIndex !== null && toggleTrack(activeIndex)}
        onSkip={skip}
        onScrub={handleScrub}
      />
    </MusicPlayerContext.Provider>
  );
}
