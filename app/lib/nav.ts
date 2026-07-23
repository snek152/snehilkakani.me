import { Home, Briefcase, Music2, Camera, Send, type LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  Icon: LucideIcon;
  /** Exact-match required for active state (e.g. "/") */
  end: boolean;
};

export const navItems: NavItem[] = [
  { href: "/", label: "Home", Icon: Home, end: true },
  { href: "/projects", label: "Work", Icon: Briefcase, end: false },
  { href: "/music", label: "Music", Icon: Music2, end: false },
  { href: "/gallery", label: "Lens", Icon: Camera, end: false },
  { href: "/contact", label: "Reach", Icon: Send, end: false },
];
