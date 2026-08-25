import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AppShell from "./lib/components/AppShell";
import { LOADER_GATE_SCRIPT } from "./lib/loader-gate";
import { SITE_NAME, SITE_URL } from "./lib/metadata";

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

const title = "Snehil Kakani — Software Engineer";
const description =
  "Snehil Kakani is a software engineer and CS student at Cal Poly SLO. Explore his work in intelligent systems, music production, and photography.";

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
    siteName: SITE_NAME,
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

export const viewport: Viewport = {
  themeColor: "#080808",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Snehil Kakani",
      url: SITE_URL,
      email: "mailto:kakanisnehil@gmail.com",
      jobTitle: "Software Engineer Intern",
      worksFor: { "@type": "Organization", name: "Lindy" },
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: "California Polytechnic State University, San Luis Obispo",
      },
      knowsAbout: [
        "Software Engineering",
        "AI Agents",
        "Music Production",
        "Photography",
      ],
      sameAs: [
        "https://github.com/snek152",
        "https://linkedin.com/in/snehilkakani",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: description,
      inLanguage: "en-US",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${clashDisplay.variable} ${switzer.variable} antialiased`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
