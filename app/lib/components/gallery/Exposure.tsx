export default function Exposure({
  photo,
  className = "",
  id,
}: {
  photo: { aperture: string; shutter: string; iso: number };
  className?: string;

  id?: string;
}) {
  return (
    <span
      id={id}
      className={`flex flex-wrap items-baseline gap-x-3.5 gap-y-0.5 text-[length:var(--text-meta)] tracking-[var(--track-text-sm)] tabular-nums leading-snug text-dim ${className}`}
    >

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
