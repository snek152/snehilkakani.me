"use client";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/outline";
import { SiApplemusic, SiSpotify } from "@icons-pack/react-simple-icons";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

type Beat = {
  name: string;
  file: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
};

const beats: Beat[] = [
  {
    name: "alien trap",
    file: "/beats/alien_trap.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/5Cbk4pO9vukHhAJBunpRs9?si=0c4775b5303e48f1",
    appleMusicUrl:
      "https://music.apple.com/us/album/alien/1812580779?i=1812580782",
  },
  { name: "alien trap 2", file: "/beats/alien_trap_2.mp3" },
  {
    name: "alien trap 3",
    file: "/beats/alien_trap_3.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/19e91wHdNxh0pikniC4fz3?si=586efe57ddcb473b",
    appleMusicUrl:
      "https://music.apple.com/us/album/overflow/1823553490?i=1823553491",
  },
  { name: "all i do", file: "/beats/all_i_do.mp3" },
  { name: "alone", file: "/beats/alone.mp3" },
  {
    name: "apocalypse",
    file: "/beats/apocalypse.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/0Uv09DdE0nfqmiQUEM1rKE?si=484e72530e8e4833",
    appleMusicUrl:
      "https://music.apple.com/us/album/no-bodies/1812580779?i=1812580789",
  },
  {
    name: "apocalypse 2",
    file: "/beats/apocalypse_2.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/3iUffdXMAfeAn2VMAOUVwD?si=457f6f1ca71a4e81",
    appleMusicUrl:
      "https://music.apple.com/us/album/hit-and-miss/1823553490?i=1823553496",
  },
  { name: "be right", file: "/beats/be_right.mp3" },
  {
    name: "boat",
    file: "/beats/boat.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/4v0fZ7YkKMcioBM4UWhDTx?si=a949b9231649498b",
    appleMusicUrl:
      "https://music.apple.com/us/album/thats-it/1741673619?i=1741673948",
  },
  {
    name: "boat 2",
    file: "/beats/boat_2.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/4pTtxQRgYiG3HTfOY3g4K0?si=ef377d95e1c74191",
    appleMusicUrl:
      "https://music.apple.com/us/album/who/1741673619?i=1741674482",
  },
  { name: "boat 3", file: "/beats/boat_3.mp3" },
  { name: "boat 4", file: "/beats/boat_4.mp3" },
  { name: "boat 5", file: "/beats/boat_5.mp3" },
  { name: "bollybeat", file: "/beats/bollybeat.mp3" },
  { name: "sea", file: "/beats/c_soup.mp3" },
  { name: "come back", file: "/beats/come_back.mp3" },
  {
    name: "comedy",
    file: "/beats/comedy_crazy.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/0LQQek7Pep6Fp2puwAmNPB?si=f7f5dd0af9444513",
    appleMusicUrl:
      "https://music.apple.com/us/album/com/1812580779?i=1812580785",
  },
  { name: "danger", file: "/beats/danger.mp3" },
  { name: "deserted", file: "/beats/deserted.mp3" },
  {
    name: "drama",
    file: "/beats/drama.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/6KWNvyljumISmf0nMYbxcJ?si=17093579a1e24fda",
    appleMusicUrl:
      "https://music.apple.com/us/album/drama/1812580779?i=1812580881",
  },
  {
    name: "drifting",
    file: "/beats/drifting.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/4TKJnrXB6m0Uk0OsSKWvhX?si=bad63108da9847b6",
    appleMusicUrl:
      "https://music.apple.com/us/album/jailed/1741673619?i=1741674181",
  },
  { name: "e", file: "/beats/e.mp3" },
  {
    name: "game over",
    file: "/beats/game_over.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/0jBrSDS7KKTnDgW0zOmlpT?si=47290fecefc94435",
    appleMusicUrl:
      "https://music.apple.com/us/album/game-over/1741673619?i=1741674485",
  },
  {
    name: "hell",
    file: "/beats/hell.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/6E8KSaOSEucNwipzeBk3kn?si=cf75bbcbd3ea4b7d",
    appleMusicUrl:
      "https://music.apple.com/us/album/death-of-the-mind/1812580779?i=1812580786",
  },
  {
    name: "hell 2",
    file: "/beats/hell_2.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/5hmbLXxXMDxPobjKDQusFn?si=fd9b726f7a2244cc",
    appleMusicUrl:
      "https://music.apple.com/us/album/look-at-me/1823553490?i=1823553492",
  },
  { name: "hero", file: "/beats/hero.mp3" },
  {
    name: "in my mind",
    file: "/beats/in_my_mind.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/36fPERmAdvCWnP2lH9nZTD?si=97d57eb5f1d14dee",
    appleMusicUrl:
      "https://music.apple.com/us/album/in-my-mind/1812580779?i=1812580884",
  },
  {
    name: "king",
    file: "/beats/king.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/1olMepH9LQeO1aQOAOzvpQ?si=e6150e6608c34d3b",
    appleMusicUrl:
      "https://music.apple.com/us/album/the-king/1741673619?i=1741674489",
  },
  { name: "lonely", file: "/beats/lonely.mp3" },
  {
    name: "lowkey vibe",
    file: "/beats/lowkey_vibe.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/2uFt52Z49TSq7iTjkJ1y0y?si=9985c91b5d604fb8",
    appleMusicUrl:
      "https://music.apple.com/us/album/low-key/1812580779?i=1812580880",
  },
  { name: "melodrama", file: "/beats/melodrama.mp3" },
  { name: "memories", file: "/beats/memories.mp3" },
  {
    name: "monster",
    file: "/beats/cringe_beat.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/1tMznSU41DVnqaIrjun2ME?si=da09069952794a47",
    appleMusicUrl:
      "https://music.apple.com/us/album/i-am/1741673619?i=1741674177",
  },
  { name: "music box", file: "/beats/music_box.mp3" },
  { name: "ny beat", file: "/beats/ny_beat.mp3" },
  { name: "office", file: "/beats/office.mp3" },
  { name: "operator", file: "/beats/operator.mp3" },
  { name: "rain falling", file: "/beats/rain_falling.mp3" },
  {
    name: "shadow",
    file: "/beats/shadow.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/6IcItQ2bYVshKjjb88zh2f?si=32c9d7b5cf1a48cd",
    appleMusicUrl:
      "https://music.apple.com/us/album/attn-addict/1812580779?i=1812580787",
  },
  {
    name: "shut the front door",
    file: "/beats/shut_the_front_door.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/2Z4vcwNRINjoJ2XAu4acDd?si=27442a0956d9404a",
    appleMusicUrl:
      "https://music.apple.com/us/album/lost-my-youth/1812580779?i=1812580781",
  },
  { name: "spooky", file: "/beats/spooky_extended.mp3" },
  {
    name: "static",
    file: "/beats/static.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/2txXJlPmJ5W2tDtKBGV9D6?si=691a5d817d3c4c04",
    appleMusicUrl:
      "https://music.apple.com/us/album/nobody-in-my-way/1741673619?i=1741674183",
  },
  { name: "stranded", file: "/beats/stranded.mp3" },
  {
    name: "sunken",
    file: "/beats/sunken.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/2Hp4NpdI4uNXP6Z2ZKHcWW?si=18fe786740f14b92",
    appleMusicUrl:
      "https://music.apple.com/us/album/on-my-own-tonight/1741673619?i=1741673627",
  },
  { name: "sunset", file: "/beats/sunset.mp3" },
  {
    name: "thirty three",
    file: "/beats/thirty_three.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/0XoDkApdAHb2ajqnvvm2Gm?si=9e27663514284c25",
    appleMusicUrl:
      "https://music.apple.com/us/album/thirty-three/1823553490?i=1823553494",
  },
  { name: "thunder", file: "/beats/thunder.mp3" },
  {
    name: "utopia",
    file: "/beats/utopia.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/5NrzQTaiFQvnIR6cTlJmH1?si=1804a3afe70c45a3",
    appleMusicUrl:
      "https://music.apple.com/us/album/utopia/1812580779?i=1812580780",
  },
  {
    name: "vengeance",
    file: "/beats/vengeance.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/1hOwgZEUA0b7vs8CXopadG?si=46ec994119fa455d",
    appleMusicUrl:
      "https://music.apple.com/us/album/vengeance/1812580779?i=1812580882",
  },
  {
    name: "vengeance 2",
    file: "/beats/vengeance_2.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/6QzkhU10zGDONjh8VOTDns?si=293f21d98abe47da",
    appleMusicUrl:
      "https://music.apple.com/us/album/puppy-coat/1741673619?i=1741674062",
  },
  {
    name: "vengeance 3",
    file: "/beats/vengeance_3.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/36PV7mLQwYQpVgK5M3Uarr?si=dd80c7aba79c4b92",
    appleMusicUrl:
      "https://music.apple.com/us/album/lying-to-myself/1812580779?i=1812580883",
  },
  {
    name: "zombie",
    file: "/beats/zombie_2.mp3",
    spotifyUrl:
      "https://open.spotify.com/track/4wOzWjzN5w8Tri6wuztuBU?si=54f77b4a1137456f",
    appleMusicUrl:
      "https://music.apple.com/us/album/stuck-in-a-hole/1741673619?i=1741674059",
  },
];

export default function Beats() {
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
          barWidth: 1,
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
          <div className="flex items-center justify-between h-full px-4 w-52 rounded-md relative bg-background">
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
            <div className="z-10 flex items-center gap-2">
              {beat.spotifyUrl && (
                <a
                  href={beat.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Listen to ${beat.name} on Spotify`}
                  className={`p-1 rounded-full z-10 text-surface hover:text-green-500 focus:outline-none transition-colors duration-150`}
                >
                  <span className="flex group">
                    <SiSpotify className="w-5 h-5" />
                  </span>
                </a>
              )}
              {beat.appleMusicUrl && (
                <a
                  href={beat.appleMusicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Listen to ${beat.name} on Apple Music`}
                  className={`p-1 rounded-full z-10 text-surface focus:outline-none transition-colors duration-150 hover:text-rose-500`}
                >
                  <span className="flex">
                    <SiApplemusic className="w-5 h-5" />
                  </span>
                </a>
              )}
            </div>
          </div>

          {/* Waveform */}
          <div className="flex-1 px-4 relative">
            <div
              ref={(el) => {
                waveformRefs.current[beat.name] = el;
              }}
              className="w-full max-w-[15vw] h-10 mx-auto cursor-pointer"
            />
          </div>

          {/* Controls */}
          <div className="pr-4 flex items-center">
            <motion.button
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              onClick={() => togglePlay(beat.name)}
              className={`p-2 rounded-full cursor-pointer focus:outline-none transition-colors duration-150 ${
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
      ))}
    </div>
  );
}
