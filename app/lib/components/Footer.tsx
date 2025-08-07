"use client";
import Link from "next/link";
import { navlinks } from "../data/navlinks";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full py-8 px-6">
      <div className="flex flex-col items-center gap-3 text-center text-surface">
        {/* Nav Links */}
        <div className="flex gap-4 justify-center">
          {navlinks.map((n, i) => (
            <Link
              key={i}
              href={n.href}
              className="hover:text-primary transition-transform transform hover:scale-110"
              title={n.label || n.href}
            >
              <n.iconInactive className="w-6 h-6" />
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="w-10 h-[2px] bg-primary/30 rounded-full" />

        {/* Copyright */}
        <p className="text-sm font-domine tracking-tight lowercase text-surface/70">
          © {year} <span className="text-primary">Snehil Kakani</span>. All
          rights reserved.
        </p>

        {/* Tech Attribution */}
        <p className="text-xs font-ibm text-surface/60">
          Built with <span className="text-primary">Next.js</span> &{" "}
          <span className="text-primary">Tailwind CSS</span>.
        </p>
      </div>
    </footer>
  );
}
