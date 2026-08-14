"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { animate, useMotionValue, type MotionValue } from "motion/react";
import { EASE_OUT } from "@/app/lib/motion";

const BAR_COUNT = 5;

/** Bins of the 32-bin spectrum treated as "the low end" for `level` below.
 * A kick and a bassline live here, and they are what a room actually reads as
 * loud. A flat average across all 32 bins under-reads a beat badly: hi-hats
 * occupy most of the spectrum by width while carrying almost none of the
 * felt energy. */
const LOW_BINS = 8;
const LOW_WEIGHT = 0.65;

/** Asymmetric smoothing, and the reason `level` reads as light rather than as
 * a meter. A kick arrives faster than the eye resolves, so the rise is nearly
 * immediate; what sells it as illumination is the DECAY, which is slow enough
 * that the room is still bright a moment after the transient has gone. Equal
 * attack and release gives a twitching gauge; this gives something that
 * glows. */
const ATTACK = 0.5;
const RELEASE = 0.075;

/** How long the light takes to go out when playback stops. Not a hard cut:
 * something that was glowing should fade, and a snap to black reads as a bug
 * in the glow rather than the end of a track. */
const EXTINGUISH_S = 0.6;

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
 *
 * Returns two things from one pass over the same spectrum:
 * - `bars` — the five band levels the transport's meter draws, resting at a
 *   visible 0.12 so the meter is a shape rather than a gap when idle.
 * - `level` — one bass-weighted scalar for the site's ambient light, resting
 *   at a true 0 so that with nothing playing the page looks exactly as it did
 *   before any of this existed. Silence must cost nothing.
 */
export function useAudioAnalyser(
  audioRef: React.RefObject<HTMLAudioElement | null>,
  playing: boolean,
  reduceMotion: boolean,
): { bars: MotionValue<number>[]; level: MotionValue<number>; ensureAnalyser: () => void } {
  const bar0 = useMotionValue(0.12);
  const bar1 = useMotionValue(0.12);
  const bar2 = useMotionValue(0.12);
  const bar3 = useMotionValue(0.12);
  const bar4 = useMotionValue(0.12);
  const bars = useMemo(() => [bar0, bar1, bar2, bar3, bar4], [bar0, bar1, bar2, bar3, bar4]);
  const level = useMotionValue(0);

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
      /* Reduced motion never lights the page at all, and a pause fades it out
       * rather than cutting. `animate` rather than `set` so the decay is a
       * real transition the compositor can carry. */
      if (reduceMotion) level.set(0);
      else if (level.get() !== 0) {
        const fade = animate(level, 0, { duration: EXTINGUISH_S, ease: EASE_OUT });
        return () => fade.stop();
      }
      return;
    }
    const analyser = analyserRef.current;
    if (!analyser) return;

    const data = new Uint8Array(analyser.frequencyBinCount);
    const bucketSize = Math.max(1, Math.floor(data.length / BAR_COUNT));
    const lowBins = Math.min(LOW_BINS, data.length);
    let frame: number;

    const tick = () => {
      analyser.getByteFrequencyData(data);

      let total = 0;
      for (let i = 0; i < BAR_COUNT; i++) {
        let sum = 0;
        for (let j = 0; j < bucketSize; j++) sum += data[i * bucketSize + j];
        total += sum;
        bars[i].set(Math.max(0.12, sum / bucketSize / 255));
      }

      /* One more pass over the low bins only — the same buffer, already
       * populated, so this costs a handful of adds per frame rather than a
       * second `getByteFrequencyData`. */
      let low = 0;
      for (let i = 0; i < lowBins; i++) low += data[i];

      const lowEnergy = low / lowBins / 255;
      const fullEnergy = total / (bucketSize * BAR_COUNT) / 255;
      const target = lowEnergy * LOW_WEIGHT + fullEnergy * (1 - LOW_WEIGHT);

      const current = level.get();
      level.set(current + (target - current) * (target > current ? ATTACK : RELEASE));

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, reduceMotion, bars, level]);

  return { bars, level, ensureAnalyser };
}
