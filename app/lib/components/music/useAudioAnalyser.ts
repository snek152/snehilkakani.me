"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { animate, useMotionValue, type MotionValue } from "motion/react";
import { EASE_OUT } from "@/app/lib/motion";

const BAR_COUNT = 5;

const LOW_BINS = 8;
const LOW_WEIGHT = 0.65;

const ATTACK = 0.5;
const RELEASE = 0.075;

const EXTINGUISH_S = 0.6;

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
