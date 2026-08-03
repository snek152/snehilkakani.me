/** Track lengths in seconds, read from the audio files with `ffprobe`
 * at authoring time.
 *
 * Baked rather than measured in the browser on purpose: the list shows
 * every track's length up front, and the alternative is loading metadata
 * for all of them on page load just to fill a column. Regenerate when the
 * beats change. */
export const BEAT_DURATIONS: Record<string, number> = {
  "/beats/alien_trap.mp3": 131.58,
  "/beats/alien_trap_3.mp3": 179.17,
  "/beats/all_i_do.mp3": 197.57,
  "/beats/ascension.mp3": 157.78,
  "/beats/beach.mp3": 260.13,
  "/beats/boat.mp3": 109.98,
  "/beats/bounce_back.mp3": 213.89,
  "/beats/cloud.mp3": 265.85,
  "/beats/college_dropout_beat.mp3": 144.07,
  "/beats/comedy_crazy.mp3": 152.35,
  "/beats/feelings.mp3": 250.78,
  "/beats/game_over.mp3": 119.23,
  "/beats/hell.mp3": 130.35,
  "/beats/in_my_mind.mp3": 99.11,
  "/beats/spooky_extended.mp3": 238.32,
  "/beats/static.mp3": 137.21,
  "/beats/the_bag.mp3": 202.16,
  "/beats/trouble.mp3": 170.48,
  "/beats/utopia.mp3": 190.98,
  "/beats/vengeance.mp3": 105.51,
  "/beats/vengeance_3.mp3": 134.45,
  "/beats/zombie_2.mp3": 138.03,
};
