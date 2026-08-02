"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useMotionValue, type MotionValue } from "motion/react";

const BAR_COUNT = 5;

/**
 * Real Web Audio frequency analysis of `audioRef`'s element while
 * `playing` is true — five frequency-band levels (0–1 each), read from
 * `AnalyserNode.getByteFrequencyData()` on an animation frame loop. Not a
 * tempo-locked decorative pattern: these numbers come from the actual
 * audio signal currently playing.
 *
 * `ensureAnalyser()` must be called synchronously from inside the real
 * click handler that starts playback, *before* `audio.play()` — not from
 * an effect reacting to state, which runs several hops (state update,
 * re-render, commit) removed from the actual gesture and can leave the
 * context suspended, silently muting playback once its output has been
 * rerouted through it. It's idempotent: safe to call on every play
 * attempt, since `createMediaElementSource` can only be called once ever
 * per `<audio>` element, so the context and node are created once and
 * reused for every subsequent track, just resumed if suspended.
 */
export function useAudioAnalyser(
  audioRef: React.RefObject<HTMLAudioElement | null>,
  playing: boolean,
  reduceMotion: boolean,
): { bars: MotionValue<number>[]; ensureAnalyser: () => void } {
  const bar0 = useMotionValue(0.12);
  const bar1 = useMotionValue(0.12);
  const bar2 = useMotionValue(0.12);
  const bar3 = useMotionValue(0.12);
  const bar4 = useMotionValue(0.12);
  const bars = useMemo(() => [bar0, bar1, bar2, bar3, bar4], [bar0, bar1, bar2, bar3, bar4]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const ensureAnalyser = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const source = ctx.createMediaElementSource(audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.75;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
    }

    if (audioCtxRef.current.state === "suspended") {
      void audioCtxRef.current.resume();
    }
  }, [audioRef]);

  useEffect(() => {
    if (!playing || reduceMotion) {
      for (const bar of bars) bar.set(0.12);
      return;
    }
    const analyser = analyserRef.current;
    if (!analyser) return;

    const data = new Uint8Array(analyser.frequencyBinCount);
    const bucketSize = Math.max(1, Math.floor(data.length / BAR_COUNT));
    let frame: number;

    const tick = () => {
      analyser.getByteFrequencyData(data);
      for (let i = 0; i < BAR_COUNT; i++) {
        let sum = 0;
        for (let j = 0; j < bucketSize; j++) sum += data[i * bucketSize + j];
        bars[i].set(Math.max(0.12, sum / bucketSize / 255));
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, reduceMotion, bars]);

  return { bars, ensureAnalyser };
}
