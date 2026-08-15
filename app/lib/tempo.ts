const TEMPO_BPM = 92;

const BEAT = 60 / TEMPO_BPM;

export function beats(fraction: number): number {
  return BEAT * fraction;
}
