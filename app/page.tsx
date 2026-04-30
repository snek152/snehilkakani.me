// import HomeGallery from "./lib/components/HomeGallery";
import HomePage from "./lib/components/HomePage";
import Experience from "./lib/components/Experience";

export default function Home() {
  return (
    <>
      <HomePage />
      <div className="w-full grid grid-cols-1 lg:grid-cols-2">
        <Experience />
      </div>
      {/* <HomeGallery /> */}
    </>
  );
}
