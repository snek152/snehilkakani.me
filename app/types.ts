export type NavLink = {
    iconInactive: React.FC<React.SVGProps<SVGSVGElement>>;
    iconActive: React.FC<React.SVGProps<SVGSVGElement>>;
    href: string;
    label: string;
}