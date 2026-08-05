import { routeMetadata } from "@/app/lib/metadata";

// `page.tsx` here renders `WorkPage`, and /lens and /reach are `"use
// client"` outright — a client component cannot export `metadata`, so
// every route's metadata lives in a server layout like this one.
// Without them, all five routes served the root's title and description
// verbatim.
//
// The named projects and the Innovation Quest placing come from
// `app/lib/data/projects.ts`. Keep them in step with it.
export const metadata = routeMetadata({
  title: "Builds - Software Projects",
  description:
    "Software projects with stack, dates and source links: Fere, an AI dev-tooling desktop app that placed 2nd at Cal Poly Innovation Quest; Orbis, AI-agent observability; GU-Net glioma segmentation research.",
  path: "/builds",
});

export default function BuildsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
