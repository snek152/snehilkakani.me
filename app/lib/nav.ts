import {
  Home,
  Blocks,
  Music2,
  Camera,
  Send,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  Icon: LucideIcon;

  end: boolean;
};

export const navItems: NavItem[] = [
  { href: "/", label: "Home", Icon: Home, end: true },
  { href: "/builds", label: "Builds", Icon: Blocks, end: false },
  { href: "/music", label: "Music", Icon: Music2, end: false },
  { href: "/lens", label: "Lens", Icon: Camera, end: false },
  { href: "/reach", label: "Reach", Icon: Send, end: false },
];
