/**
 * The bordered pill control: the Résumé download on `/` and `/reach`, and the
 * three actions on the Reach form's confirmation (email directly, copy the
 * draft, send another).
 *
 * One string because it was five copies of the same ~300 characters, and they
 * had drifted in the way copies always do — every one of them suppressed its
 * focus ring (`focus-visible:outline-none`) and left a 1px border swapping to
 * `--accent` as the only cue that the control was focused. At 3.87:1 on
 * `--bg`, a one-pixel line is not a focus indicator, and `--accent` is scoped
 * to shapes precisely because it is too weak to carry meaning on its own. A
 * keyboard visitor tabbing to "Résumé" — one of the two conversions the site
 * exists for — could not reliably tell they were on it.
 *
 * The outline here matches the one the email link in `reach/page.tsx` already
 * used correctly, eight lines above one of the offenders. Same reasoning as
 * `ICON_LINK_CLASS` in `ProjectMeta`: these are deliberately one treatment so
 * they cannot drift apart again.
 *
 * Callsites add their own LAYOUT classes (`mt-4`, `mb-11`, `self-start`) and
 * nothing else. Anything that paints or reacts belongs in here.
 *
 * `scale`, not `transform`: Tailwind v4 compiles `scale-[0.97]` to the
 * independent `scale` property, so a transition list naming `transform`
 * transitions nothing and the press snaps.
 */
export const BORDERED_CONTROL =
  "inline-flex items-center gap-1.5 border border-border px-[0.875rem] py-[0.45rem] text-[length:var(--text-meta)] text-dim transition-[color,border-color,scale] duration-[120ms] ease-[var(--ease-press)] hover:text-fg active:scale-[0.97] focus-visible:rounded-sm focus-visible:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";
