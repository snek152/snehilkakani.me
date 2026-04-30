import { Suspense } from "react";
import Tools from "../lib/components/Tools";
import LoadingSpinner from "../lib/components/LoadingSpinner";
import dynamic from "next/dynamic";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Full-stack web apps, AI tools, and research projects I've developed spanning machine learning, mobile development, and creative technology, and a breakdown of the tools I use.",
  alternates: { canonical: "/projects" },
  openGraph: { url: "/projects" },
};

const AllProjects = dynamic(() => import("../lib/components/AllProjects"));

export default function About() {
  return (
    <div className="w-full grid gap-5 px-5 py-2 lg:py-5 grid-cols-2">
      <Tools />
      <h1 className="text-3xl col-span-2 mt-7 lg:text-4xl font-bold text-center tracking-tight text-surface mb-2 font-domine">
        <span className="text-primary">{"<"}</span>Projects
        <span className="text-primary">{"/>"}</span>
      </h1>
      <Suspense
        fallback={<LoadingSpinner className="col-span-2 h-full mt-10" />}
      >
        <AllProjects />
      </Suspense>
    </div>
  );
}
