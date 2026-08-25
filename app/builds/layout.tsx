import { routeMetadata } from "@/app/lib/metadata";

export const metadata = routeMetadata({
  title: "Projects",
  description:
    "Explore Fere, Orbis, GU-Net, and other software projects by Snehil Kakani. Fere placed 2nd at Cal Poly’s Innovation Quest.",
  path: "/builds",
});

export default function BuildsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
