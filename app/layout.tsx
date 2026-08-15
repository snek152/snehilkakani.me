import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AppShell from "./lib/components/AppShell";
import { LOADER_GATE_SCRIPT } from "./lib/loader-gate";

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
    <html lang="en" suppressHydrationWarning>
      <head>
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
