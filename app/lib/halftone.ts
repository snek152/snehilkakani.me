export const HALFTONE_CELL = 8;

const BAYER_4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

export function bayer(gx: number, gy: number): number {
  return (BAYER_4[(gy & 3) * 4 + (gx & 3)] + 0.5) / 16;
}
