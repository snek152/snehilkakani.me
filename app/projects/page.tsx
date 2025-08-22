import { Suspense } from "react";
import Tools from "../lib/components/Tools";
import LoadingSpinner from "../lib/components/LoadingSpinner";
import dynamic from "next/dynamic";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
};

const AllProjects = dynamic(() => import("../lib/components/AllProjects"));

export default function About() {
  return (
    <div className="w-full grid gap-5 px-5 py-2 lg:py-5 grid-cols-2">
      <Tools />
      <Suspense
        fallback={<LoadingSpinner className="col-span-2 h-full mt-10" />}
      >
        <AllProjects />
      </Suspense>
    </div>
  );
}
