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
      <span className="font-sans text-sm text-dim2">
        © {new Date().getFullYear()} Snehil Kakani
      </span>
      <div className="flex gap-6">
        {LINKS.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-sans text-sm text-dim transition-colors duration-150 hover:text-fg"
          >
            <Icon size={13} strokeWidth={1.75} />
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}
