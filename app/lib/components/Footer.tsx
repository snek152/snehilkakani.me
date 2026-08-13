import { Github, Linkedin, Mail, FileText } from "lucide-react";

const LINKS = [
  { href: "https://github.com/snek152", label: "GitHub", Icon: Github },
  { href: "https://linkedin.com/in/snehilkakani", label: "LinkedIn", Icon: Linkedin },
  { href: "mailto:kakanisnehil@gmail.com", label: "Email", Icon: Mail },
  { href: "/resume.pdf", label: "Résumé", Icon: FileText },
] as const;

export default function Footer({
  bottomReserve = 0,
}: {
  /** Extra space, in pixels, held below the footer's content and inside
   * its own background. `AppShell` passes the fixed music transport's
   * height here when a track is loaded, so the transport's footprint
   * belongs to the footer's surface instead of a spacer element after
   * it — a sibling spacer made the document taller than the footer, and
   * the page's maximum scroll ended in a band of empty background below
   * it. */
  bottomReserve?: number;
}) {
  return (
    <footer
      className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-5 sm:px-10"
      style={
        bottomReserve
          ? { paddingBottom: `calc(1.25rem + ${bottomReserve}px)` }
          : undefined
      }
    >
      <span className="font-sans text-[length:var(--text-meta)] tracking-[var(--track-text-sm)] text-dim2">
        © {new Date().getFullYear()} Snehil Kakani
      </span>
      {/* Icon + label links total 341px, which cannot sit inside the
        * footer's 24px side padding until the viewport reaches ~420px —
        * at 320px the row ran 45px past the document's right edge, and
        * even at 375px it was overhanging into the padding. Below 420px
        * the icons drop and the labels stay: the label is what names the
        * destination, the icon is decoration, so decoration is what
        * gives way. Label-only the row is 193px and fits with room to
        * spare. */}
      <div className="flex gap-5 min-[420px]:gap-6">
        {LINKS.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            // `relative` + an absolutely-positioned, contentful `::before`
            // extends the clickable/tappable area 8px past the visible
            // link on every side (36px tall against a 20px line box)
            // without touching the link's own box — so it can't shove
            // neighbouring links or grow the footer's own height. The
            // 20px `gap-5` floor above is what keeps those extenders from
            // meeting: 8px a side leaves 4px of clearance between two
            // adjacent hit areas, so no point on the row is ambiguous.
            // Opacity is the press channel here because it is the one cue
            // that cannot disturb the hit area above: a transform would
            // scale the `::before` extender along with the link, shrinking
            // the 36px target at the exact moment a thumb is on it.
            className="relative flex items-center gap-1.5 font-sans text-[length:var(--text-meta)] tracking-[var(--track-text-sm)] text-dim transition-[color,opacity] duration-[120ms] ease-[var(--ease-press)] before:absolute before:-inset-2 before:content-[''] hover:text-fg active:opacity-70"
          >
            <Icon size={13} strokeWidth={1.75} className="hidden min-[420px]:block" />
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}
