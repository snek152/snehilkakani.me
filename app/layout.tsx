import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AppShell from "./lib/components/AppShell";
import { LOADER_GATE_SCRIPT } from "./lib/loader-gate";

// Both faces are self-hosted rather than pulled from a font CDN. That is a
// deliberate choice, not an optimisation: the free Google catalogue is where
// every generated portfolio shops, and its most-reached-for grotesques are why
// so many of them read the same. These two are drawn by the Indian Type
// Foundry, so they share construction logic and sit together without being
// lookalikes. Licences ship next to the files (`*-FFL-LICENSE.txt`).
//
// Both are VARIABLE — one file each, every weight in the design available from
// it, and no possibility of a class asking for a cut that was never fetched.
//
// Clash Display's axis stops at 700. There is no 800, which is why the display
// tiers top out at `font-bold` and the card/section tier sits at
// `font-semibold`: an `font-extrabold` class here would be synthesized by the
// browser, not rendered. Do not reintroduce one.
const clashDisplay = localFont({
  src: "./fonts/ClashDisplay-Variable.woff2",
  variable: "--font-clash-display",
  weight: "200 700",
  display: "swap",
});

const switzer = localFont({
  src: "./fonts/Switzer-Variable.woff2",
  variable: "--font-switzer",
  weight: "100 900",
  display: "swap",
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
    /* `suppressHydrationWarning` is required, not defensive, and it is scoped
     * to exactly one element on purpose. The script below sets
     * `data-loader-seen` on this `<html>` before React hydrates, so the server
     * markup and the client DOM legitimately disagree about one attribute —
     * React reports that as a hydration mismatch it "won't patch up". The flag
     * silences it for THIS element's own attributes only; children are still
     * fully checked. Same mechanism a theme toggle uses for the same reason.
     * Do not move it to `<body>` or a wrapper: it would stop covering the
     * attribute that actually differs, and stop being true. */
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Before first paint, so a returning visitor never sees a frame of an
          * intro they already watched. See `loader-gate.ts` for why an effect
          * cannot do this job: the loader is in the prerendered HTML. */}
        <script dangerouslySetInnerHTML={{ __html: LOADER_GATE_SCRIPT }} />
      </head>
      <body
        className={`${clashDisplay.variable} ${switzer.variable} antialiased`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
