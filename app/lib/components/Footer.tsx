import { Github, Linkedin, Mail, FileText } from "lucide-react";
import Clock from "@/app/lib/components/shared/Clock";

const LINKS = [
  { href: "https://github.com/snek152", label: "GitHub", Icon: Github },
  { href: "https://linkedin.com/in/snehilkakani", label: "LinkedIn", Icon: Linkedin },
  { href: "mailto:kakanisnehil@gmail.com", label: "Email", Icon: Mail },
  { href: "/resume.pdf", label: "Résumé", Icon: FileText },
] as const;

export default function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-5 sm:px-10">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="font-sans text-sm text-dim2">
          © {new Date().getFullYear()} Snehil Kakani
        </span>
        <span className="hidden h-3 w-px bg-border sm:inline-block" aria-hidden />
        <span className="font-mono text-sm text-dim2">
          <Clock />
        </span>
      </div>
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
