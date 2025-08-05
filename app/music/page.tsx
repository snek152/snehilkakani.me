import Beats from "./components/Beats";

export default function MusicPage() {
  return (
    <div className="min-h-svh px-2 py-2 lg:py-10">
      <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 font-domine text-center">
        Music Portfolio
      </h1>
      <Beats />
    </div>
  );
}
