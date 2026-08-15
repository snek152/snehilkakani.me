import { Github, Linkedin, Mail, FileText } from "lucide-react";
import SignalRule from "./shared/SignalRule";

const LINKS = [
  { href: "https://github.com/snek152", label: "GitHub", Icon: Github },
  { href: "https://linkedin.com/in/snehilkakani", label: "LinkedIn", Icon: Linkedin },
  { href: "mailto:kakanisnehil@gmail.com", label: "Email", Icon: Mail },
  { href: "/resume.pdf", label: "Résumé", Icon: FileText },
] as const;

export default function Footer({
  bottomReserve = 0,
}: {
  bottomReserve?: number;
}) {
  return (
    <footer
      className="instrument-footer relative flex flex-wrap items-center justify-between gap-3 px-6 py-5 sm:px-8 lg:px-12"
      style={
        bottomReserve
          ? { paddingBottom: `calc(1.25rem + ${bottomReserve}px)` }
          : undefined
      }
    >
      <SignalRule draw={false} className="absolute inset-x-0 top-0 z-10" />
      <span className="font-sans text-[length:var(--text-meta)] tracking-[var(--track-text-sm)] text-dim2">
        © {new Date().getFullYear()} Snehil Kakani
      </span>

      <div className="flex flex-wrap gap-3 gap-x-5 min-[420px]:gap-x-6">
        {LINKS.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
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
