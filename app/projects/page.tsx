import AllProjects from "./components/AllProjects";
import Tools from "./components/Tools";

export default function About() {
  return (
    <div className="w-full grid gap-5 px-5 py-2 lg:py-5 grid-cols-2">
      <Tools />
      <AllProjects />
    </div>
  );
}
