/**
 * A single shared rhythm the site's motion derives from, instead of every
 * component picking its own duration/delay in isolation (0.4s here, a
 * 0.06s stagger there, unrelated to each other). BPM 92 — an unhurried,
 * deliberate tempo, chosen once and reused everywhere, so that when
 * several things animate in sequence anywhere on the site they land on
 * the same underlying pulse rather than arbitrary numbers that merely
 * looked fine in isolation. Nothing audible plays; this is a timing
 * grid, not a soundtrack — a quiet nod to the music-production identity
 * rather than a literal audio cue.
 */
export const TEMPO_BPM = 92;

/** Duration, in seconds, of one beat at `TEMPO_BPM`. */
export const BEAT = 60 / TEMPO_BPM;

/** `beats(0.75)` = three-quarters of a beat, in seconds. Every reveal or
 * stagger duration on the site should be expressed as a fraction of a
 * beat through this helper rather than a bare number. */
export function beats(fraction: number): number {
  return BEAT * fraction;
}
