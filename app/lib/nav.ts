import {
  Home,
  Blocks,
  Music2,
  Camera,
  Send,
  type LucideIcon,
  Github,
  Linkedin,
  Mail,
  FileText,
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

export const socialLinks = [
  { href: "/resume.pdf", label: "Résumé", Icon: FileText },
  { href: "https://github.com/snek152", label: "GitHub", Icon: Github },
  {
    href: "https://linkedin.com/in/snehilkakani",
    label: "LinkedIn",
    Icon: Linkedin,
  },
  { href: "mailto:kakanisnehil@gmail.com", label: "Email", Icon: Mail },
];
