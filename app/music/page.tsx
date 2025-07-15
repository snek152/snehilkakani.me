"use client";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

const beats = [
  { name: "alien trap", file: "/beats/alien_trap.mp3" },
  { name: "alien trap 2", file: "/beats/alien_trap_2.mp3" },
  { name: "alien trap 3", file: "/beats/alien_trap_3.mp3" },
  { name: "all i do", file: "/beats/all_i_do.mp3" },
  { name: "alone", file: "/beats/alone.mp3" },
  { name: "apocalypse", file: "/beats/apocalypse.mp3" },
  { name: "apocalypse 2", file: "/beats/apocalypse_2.mp3" },
  { name: "be right", file: "/beats/be_right.mp3" },
  { name: "boat", file: "/beats/boat.mp3" },
  { name: "boat 2", file: "/beats/boat_2.mp3" },
  { name: "boat 3", file: "/beats/boat_3.mp3" },
  { name: "boat 4", file: "/beats/boat_4.mp3" },
  { name: "boat 5", file: "/beats/boat_5.mp3" },
  { name: "bollybeat", file: "/beats/bollybeat.mp3" },
  { name: "sea", file: "/beats/c_soup.mp3" },
  { name: "come back", file: "/beats/come_back.mp3" },
  { name: "comedy", file: "/beats/comedy_crazy.mp3" },
  { name: "danger", file: "/beats/danger.mp3" },
  { name: "deserted", file: "/beats/deserted.mp3" },
  { name: "drama", file: "/beats/drama.mp3" },
  { name: "drifting", file: "/beats/drifting.mp3" },
  { name: "e", file: "/beats/e.mp3" },
  { name: "game over", file: "/beats/game_over.mp3" },
  { name: "hell", file: "/beats/hell.mp3" },
  { name: "hell 2", file: "/beats/hell_2.mp3" },
  { name: "hero", file: "/beats/hero.mp3" },
  { name: "in my mind", file: "/beats/in_my_mind.mp3" },
  { name: "king", file: "/beats/king.mp3" },
  { name: "lonely", file: "/beats/lonely.mp3" },
  { name: "lowkey vibe", file: "/beats/lowkey_vibe.mp3" },
  { name: "melodrama", file: "/beats/melodrama.mp3" },
  { name: "memories", file: "/beats/memories.mp3" },
  { name: "monster", file: "/beats/cringe_beat.mp3" },
  { name: "music box", file: "/beats/music_box.mp3" },
  { name: "ny beat", file: "/beats/ny_beat.mp3" },
  { name: "office", file: "/beats/office.mp3" },
  { name: "operator", file: "/beats/operator.mp3" },
  { name: "rain falling", file: "/beats/rain_falling.mp3" },
  { name: "shadow", file: "/beats/shadow.mp3" },
  { name: "shut the front door", file: "/beats/shut_the_front_door.mp3" },
  { name: "spooky", file: "/beats/spooky_extended.mp3" },
  { name: "static", file: "/beats/static.mp3" },
  { name: "stranded", file: "/beats/stranded.mp3" },
  { name: "sunken", file: "/beats/sunken.mp3" },
  { name: "sunset", file: "/beats/sunset.mp3" },
  { name: "thirty three", file: "/beats/thirty_three.mp3" },
  { name: "thunder", file: "/beats/thunder.mp3" },
  { name: "utopia", file: "/beats/utopia.mp3" },
  { name: "vengeance", file: "/beats/vengeance.mp3" },
  { name: "vengeance 2", file: "/beats/vengeance_2.mp3" },
  { name: "vengeance 3", file: "/beats/vengeance_3.mp3" },
  { name: "zombie", file: "/beats/zombie_2.mp3" },
];

export default function BeatArrangementView() {
  const waveformRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const wavesurferRefs = useRef<Record<string, WaveSurfer>>({});
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Helper to initialize wavesurfer in batches
    const batchSize = 2;
    const delay = 200; // ms between batches

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
          barGap: 1,
          cursorColor: "white",
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
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.5,
              delay: 0.08 * (beats.findIndex((b) => b.name === beat.name) % 2),
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
                    : {
                        boxShadow: "0 0 0px 0px rgba(13,110,253,0)",
                        transition: { duration: 0.1 },
                      }
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
