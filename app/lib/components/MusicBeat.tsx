import * as motion from "motion/react-m";
import { Beat, beats } from "../data/beats";
import { RefObject } from "react";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/outline";
import { SiApplemusic, SiSpotify } from "@icons-pack/react-simple-icons";

export default function MusicBeat({
  beat,
  playing,
  waves,
  togglePlay,
}: {
  beat: Beat;
  playing: string | null;
  waves: RefObject<Record<string, HTMLDivElement | null>>;
  togglePlay: (beatName: string) => void;
}) {
  return (
    <motion.div
      className="flex items-center h-16 w-full rounded-xl overflow-hidden shadow-lg relative bg-on-surface border-secondary border-2"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        type: "tween",
        // stiffness: 150,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
        delay: 0.08 * (beats.findIndex((b) => b.name === beat.name) % 2),
      }}
    >
      <div className="flex items-center justify-between h-full px-3 lg:px-4 w-40 lg:w-52 rounded-md relative bg-background">
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
        <span className="font-ibm flex flex-col font-semibold text-surface z-10">
          {beat.name}
          <span className="font-ibm font-light text-xs text-surface/80">
            {beat.tempo} BPM
          </span>
        </span>
        <div className="z-10 flex items-center lg:flex-row flex-col lg:gap-2 gap-1">
          {beat.spotifyUrl && (
            <a
              href={beat.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Listen to ${beat.name} on Spotify`}
              className={`lg:p-1 p-0.5 rounded-full z-10 text-surface hover:text-green-500 focus:outline-none transition-colors duration-150`}
            >
              <span className="flex group">
                <SiSpotify className="lg:w-5 lg:h-5 w-4 h-4" />
              </span>
            </a>
          )}
          {beat.appleMusicUrl && (
            <a
              href={beat.appleMusicUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Listen to ${beat.name} on Apple Music`}
              className={`lg:p-1 p-0.5 rounded-full z-10 text-surface focus:outline-none transition-colors duration-150 hover:text-rose-500`}
            >
              <span className="flex">
                <SiApplemusic className="lg:w-5 lg:h-5 w-4 h-4" />
              </span>
            </a>
          )}
        </div>
      </div>

      {/* Waveform */}
      <div className="flex-1 px-4 relative">
        <div
          ref={(el) => {
            waves.current[beat.name] = el;
          }}
          className="w-full max-w-15vw] h-10 mx-auto cursor-pointer"
        />
      </div>

      {/* Controls */}
      <div className="pr-4 flex items-center">
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          onClick={() => togglePlay(beat.name)}
          className={`p-2 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-150 ${
            playing === beat.name
              ? "bg-primary/75 hover:bg-primary"
              : "bg-secondary/50 hover:bg-background"
          }`}
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
  );
}
