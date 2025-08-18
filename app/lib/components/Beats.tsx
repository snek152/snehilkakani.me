"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { beats, categories } from "../data/beats";
import MusicBeat from "./MusicBeat";
import * as motion from "motion/react-m";

// const categories = Array.from(new Set(beats.map((beat) => beat.category)));

export default function Beats() {
  const waveformRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const wavesurferRefs = useRef<Record<string, WaveSurfer>>({});
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Helper to initialize wavesurfer in batches
    const batchSize = 5;
    const delay = 100; // ms between batches

    const beatNames = beats.map((b) => b.name);

    function loadBatch(startIdx: number) {
      for (
        let i = startIdx;
        i < Math.min(startIdx + batchSize, beatNames.length);
        i++
      ) {
        const beat = beats[i];
        if (
          !waveformRefs.current[beat.name] ||
          wavesurferRefs.current[beat.name]
        )
          continue;

        const ws = WaveSurfer.create({
          container: waveformRefs.current[beat.name] as HTMLDivElement,
          waveColor: "#999",
          progressColor: "#fff",
          height: 40,
          barWidth: 2,
          barGap: 0.5,
          cursorColor: "#fbfbfb",
          cursorWidth: 2,
        });

        ws.load(beat.file);
        wavesurferRefs.current[beat.name] = ws;
      }
      if (startIdx + batchSize < beatNames.length && !cancelled) {
        setTimeout(() => loadBatch(startIdx + batchSize), delay);
      }
    }

    loadBatch(0);

    return () => {
      cancelled = true;
      Object.values(wavesurferRefs.current).forEach((ws) => {
        if (ws && typeof ws.destroy === "function") {
          // Only destroy if ready or not loading
          if ((ws as WaveSurfer & { isReady?: boolean }).isReady) {
            ws.destroy();
          } else {
            ws.once("ready", () => ws.destroy());
            ws.once("error", () => ws.destroy());
          }
        }
      });
      // Clear the refs to avoid stale instances
      wavesurferRefs.current = {};
    };
  }, []);
  useEffect(() => {
    // Attach "finish" event listeners to all wavesurfer instances
    Object.entries(wavesurferRefs.current).forEach(([name, ws]) => {
      if (!ws) return;
      const onFinish = () => setPlaying((p) => (p === name ? null : p));
      ws.on("finish", onFinish);
      // Clean up listener on unmount or re-run
      return () => ws.un("finish", onFinish);
    });
  }, [playing]);

  const togglePlay = useCallback(
    (beatName: string) => {
      const current = wavesurferRefs.current[beatName];
      if (!current) return;

      if (playing === beatName) {
        current.pause();
        setPlaying(null);
      } else {
        Object.entries(wavesurferRefs.current).forEach(([name, ws]) => {
          if (name !== beatName) (ws as WaveSurfer).pause();
        });
        current.play();
        setPlaying(beatName);
      }
    },
    [playing]
  );

  return categories.map((c) => (
    <div key={c}>
      <motion.div
        className="flex items-center gap-2 px-4"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <span className="inline-block w-1 h-6 bg-primary/30 rounded-full shadow-lg"></span>
        <h2 className="text-2xl font-bold text-surface font-ibm">
          {c.charAt(0).toUpperCase() + c.slice(1)} Beats
        </h2>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 p-4">
        {beats
          .filter((b) => b.category === c)
          .sort((a, b) => a.tempo - b.tempo)
          .map((beat) => (
            <MusicBeat
              key={beat.name}
              beat={beat}
              playing={playing}
              waves={waveformRefs}
              togglePlay={togglePlay}
            />
          ))}
      </div>
    </div>
  ));
}
