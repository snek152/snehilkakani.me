import {
  UserCircleIcon as UserIconOutline,
  CommandLineIcon as CommandOutline,
  MusicalNoteIcon as MusicOutline,
  PhotoIcon as PhotoOutline,
  ChatBubbleOvalLeftEllipsisIcon as ChatIconOutline,
} from "@heroicons/react/24/outline";
import {
  UserCircleIcon as UserIconSolid,
  CommandLineIcon as CommandSolid,
  MusicalNoteIcon as MusicSolid,
  PhotoIcon as PhotoSolid,
  ChatBubbleOvalLeftEllipsisIcon as ChatIconSolid,
} from "@heroicons/react/24/solid";

export type NavLink = {
  iconInactive: React.FC<React.SVGProps<SVGSVGElement>>;
  iconActive: React.FC<React.SVGProps<SVGSVGElement>>;
  href: string;
  label: string;
};

export const navlinks: NavLink[] = [
  {
    iconInactive: UserIconOutline,
    iconActive: UserIconSolid,
    href: "/",
    label: "Home",
  },
  {
    iconInactive: CommandOutline,
    iconActive: CommandSolid,
    href: "/projects",
    label: "Projects",
  },
  {
    iconInactive: MusicOutline,
    iconActive: MusicSolid,
    href: "/music",
    label: "Music",
  },
  {
    iconActive: PhotoSolid,
    iconInactive: PhotoOutline,
    href: "/gallery",
    label: "Gallery",
  },
  {
    iconActive: ChatIconSolid,
    iconInactive: ChatIconOutline,
    href: "/contact",
    label: "Contact",
  },
];
