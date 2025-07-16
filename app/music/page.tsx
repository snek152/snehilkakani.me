import Beats from "./components/Beats";

export default function MusicPage() {
  return (
    <div className="min-h-screen px-5 py-5">
      <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 font-domine text-center tracking-tight">
        Music Portfolio
      </h1>
      <Beats />
    </div>
  );
}
