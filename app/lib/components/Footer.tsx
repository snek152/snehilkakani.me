import { Github, Linkedin, Mail, FileText } from "lucide-react";

const LINKS = [
  { href: "https://github.com/snek152", label: "GitHub", Icon: Github },
  { href: "https://linkedin.com/in/snehilkakani", label: "LinkedIn", Icon: Linkedin },
  { href: "mailto:kakanisnehil@gmail.com", label: "Email", Icon: Mail },
  { href: "/resume.pdf", label: "Résumé", Icon: FileText },
] as const;

export default function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-5 sm:px-10">
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
