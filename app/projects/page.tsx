// import AllProjects from "./components/AllProjects";
import { lazy, Suspense } from "react";
import Tools from "./components/Tools";
import LoadingSpinner from "../components/LoadingSpinner";

const AllProjects = lazy(() => import("./components/AllProjects"));

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
