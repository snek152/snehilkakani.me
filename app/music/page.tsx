"use client";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

const beats = [
  { name: "ny_beat", file: "/beats/ny_beat.mp3" },
  { name: "spooky_extended", file: "/beats/spooky_extended.mp3" },
  { name: "boat_4", file: "/beats/boat_4.mp3" },
];

export default function BeatArrangementView() {
  const waveformRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const wavesurferRefs = useRef<Record<string, WaveSurfer>>({});
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    beats.forEach((beat) => {
      // Prevent duplicate WaveSurfer instances
      if (!waveformRefs.current[beat.name] || wavesurferRefs.current[beat.name])
        return;

      const ws = WaveSurfer.create({
        container: waveformRefs.current[beat.name] as HTMLDivElement,
        waveColor: "#999",
        progressColor: "#fff",
        height: 40,
        barWidth: 2,
        barGap: 1,
        cursorColor: "white",
      });

      ws.load(beat.file);
      wavesurferRefs.current[beat.name] = ws;
    });

    return () => {
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

  const togglePlay = (beatName: string) => {
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
  };

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 p-4">
        {beats.map((beat) => (
          <motion.div
            key={beat.name}
            className="flex items-center h-16 w-full rounded-xl overflow-hidden shadow-lg relative bg-on-surface border-secondary border-2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.5,
              delay: 0.1 * beats.findIndex((b) => b.name === beat.name),
            }}
          >
            <div className="flex items-center justify-between h-full px-4 w-50 rounded-md relative bg-background">
              {/* Gradient border */}
              <motion.div
                className="absolute inset-0 rounded-md p-[2px] pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, transparent 50%, rgba(13, 110, 253, 0.5) 100%)",
                }}
                animate={
                  playing === beat.name
                    ? { boxShadow: "8px 0 16px 4px rgba(13,110,253,0.7)" }
                    : { boxShadow: "0 0 0px 0px rgba(13,110,253,0)" }
                }
                transition={{
                  duration: 1,
                  repeat: playing === beat.name ? Infinity : 0,
                  repeatType: "reverse",
                }}
              />
              {/* Inner content with background, inset to show border */}
              <div
                className="absolute inset-0 rounded-md bg-background z-0"
                style={{ margin: 2 }}
              />
              <span className="font-ibm font-semibold text-surface z-10">
                {beat.name}
              </span>
              {/* <div className="flex gap-1 z-10">
                <button className="text-xs px-1 py-0.5 bg-white rounded">
                  M
                </button>
                <button className="text-xs px-1 py-0.5 bg-[#333] rounded">
                  S
                </button>
                <button className="text-xs px-1 py-0.5 bg-[#333] rounded">
                  R
                </button>
              </div> */}
            </div>

            {/* Waveform */}
            <div className="flex-1 px-4 relative">
              <div
                ref={(el) => {
                  waveformRefs.current[beat.name] = el;
                }}
                className="w-full h-10"
              />
            </div>

            {/* Controls */}
            <div className="pr-4 flex items-center">
              <motion.button
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                onClick={() => togglePlay(beat.name)}
                className={`p-2 rounded-full bg-secondary/50 hover:bg-background focus:outline-none transition-colors duration-150`}
                aria-label={playing === beat.name ? "Pause" : "Play"}
              >
                <motion.span
                  key={playing === beat.name ? "pause" : "play"}
                  initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 20, scale: 0.8 }}
                  transition={{ duration: 0.18 }}
                  className="flex"
                >
                  {playing === beat.name ? (
                    <PauseIcon className="w-5 h-5 text-white" />
                  ) : (
                    <PlayIcon className="w-5 h-5 text-white" />
                  )}
                </motion.span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
