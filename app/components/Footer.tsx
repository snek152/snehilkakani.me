// import { CodeBracketIcon, MusicalNoteIcon } from "@heroicons/react/24/outline";
// import { Code, Music } from "lucide-react";
"use client";
import Link from "next/link";
import { navlinks } from "../navlinks";

export default function Footer() {
  return (
    <footer className="w-full bg-secondary text-surface py-4">
      <div className="container flex items-center justify-center flex-col gap-2">
        <div className="flex items-center gap-3 group/footer">
          {navlinks.map((n, i) => (
            <Link key={i} href={n.href} className="relative">
              <n.iconInactive className="w-7 h-7 text-surface transition-transform duration-300" />
            </Link>
          ))}
        </div>
        <p className="text-sm">
          © {new Date().getFullYear()} Snehil Kakani. All rights reserved.
        </p>
        <p className="text-xs mt-2">
          Built with <span className="text-primary">Next.js</span> and{" "}
          <span className="text-primary">Tailwind CSS</span>.
        </p>
      </div>
    </footer>
  );
}
