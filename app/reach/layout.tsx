import { routeMetadata } from "@/app/lib/metadata";

export const metadata = routeMetadata({
  title: "Contact",
  description:
    "Contact Snehil Kakani about software engineering opportunities, freelance web work, collaborations, or other interesting projects.",
  path: "/reach",
});

export default function ReachLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
