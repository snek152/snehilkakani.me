/**
 * The exposure a frame was shot at, as a plate rather than a sentence.
 *
 * Was one middot-joined string, set in `dim2` (4.87:1) and truncated in narrow
 * cells. Now three values separated by space alone, a tier brighter, wrapping
 * instead of truncating so no value is silently dropped. `ƒ` is the notation
 * cameras use; tabular figures hold the digits to a common width.
 */
export default function Exposure({
  photo,
  className = "",
  id,
}: {
  /* Structural, so any `Photo` satisfies it and this file states exactly
   * what it reads. */
  photo: { aperture: string; shutter: string; iso: number };
  className?: string;
  /* The lightbox points `aria-describedby` at this line, so it has to be
   * able to carry the id itself. */
  id?: string;
}) {
  return (
    <span
      id={id}
      className={`flex flex-wrap items-baseline gap-x-3.5 gap-y-0.5 text-[length:var(--text-micro)] tracking-[var(--track-text-sm)] tabular-nums leading-snug text-dim ${className}`}
    >
      {/* The gaps between the three values are flex gutters, so they do not
        * exist as characters: read out, the visible spans run together as
        * "ƒ/3.21/1000sISO 400". The lightbox uses this element as its
        * `aria-describedby` target, so that is what a screen reader would
        * announce for the photograph. Spoken form here, notation shown. */}
      <span className="sr-only">
        Aperture f/{photo.aperture}, shutter {photo.shutter} second, ISO{" "}
        {photo.iso}
      </span>
      <span aria-hidden="true">&#402;/{photo.aperture}</span>
      <span aria-hidden="true">{photo.shutter}s</span>
      <span aria-hidden="true">ISO {photo.iso}</span>
    </span>
  );
}
