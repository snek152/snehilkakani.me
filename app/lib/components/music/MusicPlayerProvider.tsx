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

  level: MotionValue<number>;
  playTrack: (index: number) => void;
  toggleTrack: (index: number) => void;
  skip: (direction: 1 | -1) => void;
  handleScrub: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) {
    throw new Error("useMusicPlayer must be used within MusicPlayerProvider");
  }
  return ctx;
}

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
  const { bars, level, ensureAnalyser } = useAudioAnalyser(
    audioRef,
    playbackState === "playing",
    prefersReducedMotion,
  );

  const attemptPlay = useCallback(
    (audio: HTMLAudioElement, index: number) => {
      const request = ++playbackRequestRef.current;
      setError(null);
      setPlaybackState("loading");

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
      level,
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
      level,
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
        level={level}
      />
    </MusicPlayerContext.Provider>
  );
}
