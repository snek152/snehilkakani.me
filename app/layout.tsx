import type { Metadata } from "next";
import { Epilogue, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import AppShell from "./lib/components/AppShell";

// Epilogue sets every display line — the hero lockup, page titles, card and
// section headings, the small display labels. Schibsted Grotesk, a news-media
// grotesque, carries body copy and UI text.
//
// The weights requested here are exactly the ones the components use:
// `font-semibold`/`font-bold`/`font-extrabold` on display (600 is the small
// display labels in `GridIndex` and `RoleCycle`), and
// `font-normal`/`font-medium`/`font-semibold` on body. A class asking for an
// unloaded weight gets synthesized by the browser instead of rendered, so this
// list and the classes have to stay in step. Schibsted is loaded as a VARIABLE
// font (no `weight` array), so its whole 400..900 range is always available.
const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});


// Site-wide default, used verbatim on `/` and as the fallback anywhere a
// route forgets its own. Every route under `app/` that needs a distinct
// one has a server `layout.tsx` next to its page — the pages themselves
// are `"use client"` and so cannot export `metadata`.
//
// Grounded in `app/lib/data/experience.ts`: role, employer and location
// are the first entry there. If that entry changes, change this too.
const title = "Snehil Kakani - Software Engineer Intern at Lindy";
const description =
  "Software engineer interning at Lindy, San Francisco, on infrastructure for a high-volume AI agent platform. CS at Cal Poly SLO. Projects, music, photography.";

export const metadata: Metadata = {
  metadataBase: new URL("https://snehilkakani.me"),
  title: {
    template: "%s | Snehil Kakani",
    default: title,
  },
  description: description,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "Snehil Kakani",
    "Software Engineer",
    "Lindy",
    "AI agents",
    "TypeScript",
    "Next.js",
    "PyTorch",
    "Cal Poly SLO",
    "Computer Science",
    "Music Production",
    "Photography",
  ],
  authors: [{ name: "Snehil Kakani", url: "https://snehilkakani.me" }],
  creator: "Snehil Kakani",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: {
      template: "%s | Snehil Kakani",
      default: title,
    },
    description: description,
    url: "/",
    siteName: "Snehil Kakani",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      template: "%s | Snehil Kakani",
      default: title,
    },
    description: description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${epilogue.variable} ${schibstedGrotesk.variable} antialiased`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
