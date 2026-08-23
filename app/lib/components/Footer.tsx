import SignalRule from "./shared/SignalRule";
import { socialLinks } from "@/app/lib/nav";

export default function Footer() {
  return (
    <footer className="instrument-footer relative flex flex-wrap items-center justify-between gap-3 px-6 py-5 sm:px-8 lg:px-12 bg-bg">
      <SignalRule draw={false} className="absolute inset-x-0 top-0 z-10" />
      <span className="font-sans text-[length:var(--text-meta)] tracking-[var(--track-text-sm)] text-dim2">
        © {new Date().getFullYear()} Snehil Kakani
      </span>

      <div className="flex flex-wrap gap-3 gap-x-5 min-[420px]:gap-x-6">
        {socialLinks.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center gap-1.5 font-sans text-[length:var(--text-meta)] tracking-[var(--track-text-sm)] text-dim transition-[color,opacity] duration-[120ms] ease-[var(--ease-press)] before:absolute before:-inset-2 before:content-[''] hover:text-fg active:opacity-70"
          >
            <Icon
              size={13}
              strokeWidth={1.75}
              className="hidden min-[420px]:block"
            />
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}
