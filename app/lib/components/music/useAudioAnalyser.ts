"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useMotionValue, type MotionValue } from "motion/react";

const BAR_COUNT = 5;


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
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const frameRef = useRef<number | null>(null);

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
      sourceRef.current = source;
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
    const tick = () => {
      analyser.getByteFrequencyData(data);

      for (let i = 0; i < BAR_COUNT; i++) {
        let sum = 0;
        for (let j = 0; j < bucketSize; j++) sum += data[i * bucketSize + j];
        bars[i].set(Math.max(0.12, sum / bucketSize / 255));
      }

      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [playing, reduceMotion, bars]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      try {
        sourceRef.current?.disconnect();
      } catch {
        sourceRef.current = null;
      }
      try {
        analyserRef.current?.disconnect();
      } catch {
        analyserRef.current = null;
      }
      analyserRef.current = null;
      sourceRef.current = null;
      const ctx = audioCtxRef.current;
      audioCtxRef.current = null;
      if (ctx && ctx.state !== "closed") {
        void ctx.close();
      }
    };
  }, []);

  return { bars, ensureAnalyser };
}
