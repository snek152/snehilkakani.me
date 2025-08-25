"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type WaveSurferType from "wavesurfer.js";
import { beats, categories } from "../data/beats";
import MusicBeat from "./MusicBeat";
import * as motion from "motion/react-m";

type WS = WaveSurferType & { __loadedAudio?: boolean };

type ContainerElement = HTMLDivElement & { __wsCleanup?: () => void };

const MAX_CONCURRENCY = 3; // how many offscreen loads at once
const BATCH_DELAY_MS = 150; // delay between queue pumps

export default function Beats() {
  const waveformRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const wavesurferRefs = useRef<Record<string, WS | undefined>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  const [playing, setPlaying] = useState<string | null>(null);

  // background loader state
  const loadQueue = useRef<string[]>([]);
  const inflight = useRef(0);
  const seen = useRef<Set<string>>(new Set()); // we've seen a container for this beat

  // dynamic import to keep bundle small
  const getWaveSurfer = useCallback(async () => {
    const mod = await import("wavesurfer.js");
    return mod.default as unknown as typeof WaveSurferType;
  }, []);

  // create a WS instance for a beat if needed
  const createWS = useCallback(
    async (beatName: string) => {
      const beat = beats.find((b) => b.name === beatName);
      const container = waveformRefs.current[beatName];
      if (!beat || !container || wavesurferRefs.current[beatName]) return;

      const WaveSurfer = await getWaveSurfer();

      const ws = WaveSurfer.create({
        container,
        backend: "MediaElement", // shows a thin line, starts audio element quickly
        waveColor: "#999",
        progressColor: "#fff",
        height: 40,
        barWidth: 2,
        barGap: 0.5,
        cursorColor: "#fbfbfb",
        cursorWidth: 2,
      }) as WS;

      wavesurferRefs.current[beatName] = ws;

      // one finish listener per instance + cleanup hook stored on the container
      const onFinish = () => setPlaying((p) => (p === beatName ? null : p));
      (container as ContainerElement).__wsCleanup = () => {
        ws.un("finish", onFinish);
        ws.destroy();
      };

      return ws;
    },
    [getWaveSurfer]
  );

  // eager load (instantiate + load the URL immediately) — used for visible cards
  const ensureAndLoadNow = useCallback(
    async (beatName: string) => {
      const ws = (await createWS(beatName)) ?? wavesurferRefs.current[beatName];
      if (!ws) return;

      if (!ws.__loadedAudio) {
        const beat = beats.find((b) => b.name === beatName);
        if (!beat) return;
        await ws.load(beat.file); // begin fetch/decoding now so waveform draws ASAP
        ws.__loadedAudio = true;
      }
    },
    [createWS]
  );

  // background queue (for offscreen cards) with small concurrency to avoid jank
  const pumpQueue = useCallback(async () => {
    if (inflight.current >= MAX_CONCURRENCY) return;
    const next = loadQueue.current.shift();
    if (!next) return;

    inflight.current += 1;
    try {
      await ensureAndLoadNow(next);
    } finally {
      inflight.current -= 1;
      setTimeout(pumpQueue, BATCH_DELAY_MS);
    }
  }, [ensureAndLoadNow]);

  // observe containers: visible => eager load immediately, else queue for background
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const currentSeen = seen.current;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          const name = el.dataset["beatName"];
          if (!name) continue;

          // record we have a DOM container for this beat
          seen.current.add(name);

          if (entry.isIntersecting) {
            // high priority: visible — create + load now
            ensureAndLoadNow(name);
          } else {
            // offscreen — enqueue if not already scheduled
            if (!loadQueue.current.includes(name)) {
              loadQueue.current.push(name);
              // kick the queue
              pumpQueue();
            }
          }
        }
      },
      { rootMargin: "200px 0px", threshold: 0.1 }
    );

    // attach observer to any refs already present
    Object.entries(waveformRefs.current).forEach(([name, el]) => {
      if (el) {
        el.dataset.beatName = name;
        observerRef.current!.observe(el);
      }
    });

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      // cleanup all instances
      Object.values(wavesurferRefs.current).forEach((ws) => ws?.destroy());
      wavesurferRefs.current = {};
      loadQueue.current = [];
      inflight.current = 0;
      currentSeen.clear();
    };
  }, [ensureAndLoadNow, pumpQueue]);

  // small safety: after first paint, queue any containers we already have but the
  // observer hasn’t fired for (e.g., short pages). This ensures everything starts loading.
  useEffect(() => {
    const id = setTimeout(() => {
      for (const [name, el] of Object.entries(waveformRefs.current)) {
        if (!el) continue;
        if (!seen.current.has(name) && !loadQueue.current.includes(name)) {
          loadQueue.current.push(name);
        }
      }
      pumpQueue();
    }, 300);
    return () => clearTimeout(id);
  }, [pumpQueue]);

  // ref setter used by <MusicBeat />
  const setWave = useCallback((beatName: string, el: HTMLDivElement | null) => {
    waveformRefs.current[beatName] = el;

    if (el && observerRef.current) {
      el.dataset.beatName = beatName;
      observerRef.current.observe(el);
    }

    if (!el) {
      // if a card unmounts, try to run its cleanup:
      const prev = waveformRefs.current[beatName] as HTMLDivElement & {
        __wsCleanup?: () => void;
      };
      if (prev && prev.__wsCleanup) prev.__wsCleanup();
    }
  }, []);

  // play/pause — by now audio is already loaded (either visible or background)
  const togglePlay = useCallback(
    async (beatName: string) => {
      const ws = wavesurferRefs.current[beatName] as WS | undefined;
      if (!ws) return;

      // pause others
      Object.entries(wavesurferRefs.current).forEach(([name, other]) => {
        if (name !== beatName && other) other.pause();
      });

      if (playing === beatName) {
        ws.pause();
        setPlaying(null);
        return;
      }

      // if somehow not loaded yet (race), load it now
      if (!ws.__loadedAudio) {
        const beat = beats.find((b) => b.name === beatName);
        if (beat) {
          await ws.load(beat.file);
          ws.__loadedAudio = true;
        }
      }

      await ws.play();
      setPlaying(beatName);
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
        <span className="inline-block w-1 h-6 bg-primary/30 rounded-full shadow-lg" />
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
              setWave={setWave}
              togglePlay={togglePlay}
            />
          ))}
      </div>
    </div>
  ));
}
