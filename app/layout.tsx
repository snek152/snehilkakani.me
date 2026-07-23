import type { Metadata } from "next";
import { Epilogue, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "./lib/components/AppShell";

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const title = "Snehil Kakani - Software Engineer & Creative Developer";
const description =
  "Full-stack developer and creative technologist crafting innovative web solutions, producing music, and building meaningful digital experiences.";

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
    "Full-stack Developer",
    "Creative Developer",
    "Web Development",
    "Music Production",
    "Portfolio",
    "Cal Poly SLO",
    "Computer Science",
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
        className={`${epilogue.variable} ${plusJakartaSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
