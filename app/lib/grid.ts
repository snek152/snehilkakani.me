/**
 * The site's structural grid.
 *
 * Four vertical lines at quarter positions, drawn behind the top of a
 * page. Everything that references the grid reads these numbers, so the
 * three places it appears stay in register:
 *
 *   Hero        — the lines retract upward as the section scrolls away.
 *   GridIndex   — each one lands as a divider of the site index below
 *                 Hero, and the label in the cell it closes rises in.
 *   Work header — they arrive, drawing downward, as the page opens.
 *
 * Depart, land, arrive: one gesture, read three ways. Positions are
 * percentages of a full-bleed box, so any element using them must span
 * the page's full width rather than its padded content column.
 */
export const GRID_STOPS = [25, 50, 75, 100] as const;

/** Scroll progress at which each Hero line finishes retracting, and so
 * the moment its tick lands in the datum rule below. Matches the
 * `lineScaleY` ranges in `Hero.tsx`. */
export const GRID_LANDINGS = [0.65, 0.69, 0.73, 0.77] as const;
