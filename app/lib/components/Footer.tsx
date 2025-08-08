"use client";
import Link from "next/link";
import { navlinks } from "../data/navlinks";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full py-6 px-6 border-t-2 border-on-surface">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Nav Links */}
          <div className="flex gap-2">
            {navlinks.map((n, i) => (
              <Link
                key={i}
                href={n.href}
                className="text-surface hover:text-primary transition-colors duration-200"
                title={n.label || n.href}
              >
                <n.iconInactive className="w-6 h-6 " />
              </Link>
            ))}
          </div>

          {/* Copyright & Attribution */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-lg font-domine flex items-center gap-2 tracking-tight text-surface">
              <span>© {year}</span>
              <span className="text-primary/80 text-xl">•</span>
              <span className="font-semibold font-domine tracking-normal bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Snehil Kakani
              </span>
            </p>
            <div className="font-ibm text-sm text-surface">
              All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
